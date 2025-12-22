'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useTheme,
  Button,
  useMediaQuery,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  TrendingUp as TopIcon,
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Visibility as ViewIcon,
  ChatBubbleOutline as CommentIcon,
  KeyboardArrowRight as ArrowIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { PostListTable } from '@/components/Community/PostListTable';
import { getBoardPosts } from '@/services/supabase';
import { isDebugMode } from '@/lib/debug';
import {
  Post,
  SortOption,
  PostCategory,
  categoryColors,
  categoryIcons,
  MainCategory,
  SubCategoryTag,
  mainCategoryConfig,
  subCategoryColors,
} from '@/types/post';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type BoardType = 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'general';

interface CommunityBoardProps {
  boardType: BoardType;
  title: string;
  subtitle?: string;
  showSubCategories?: boolean;
  subCategories?: PostCategory[];
}

// Map board type to default category
const boardTypeToCategory: Record<BoardType, PostCategory> = {
  skill: '스킬',
  mcp: 'MCP',
  prompt: '프롬프트',
  ai_tool: 'AI 코딩 툴',
  general: '커뮤니티',
};

// Compact post item for popular section
const PopularPostItem: React.FC<{ post: Post; rank: number }> = ({ post, rank }) => {
  const theme = useTheme();
  const { language } = useLanguage();

  const timeAgo = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - post.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (language === 'ko') {
      if (days > 0) return `${days}일 전`;
      if (hours > 0) return `${hours}시간 전`;
      return `${minutes}분 전`;
    } else {
      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      return `${minutes}m ago`;
    }
  }, [post.createdAt, language]);

  return (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        },
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* Rank Badge */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.85rem',
          mr: 2,
          flexShrink: 0,
          bgcolor: rank <= 3
            ? rank === 1 ? '#ff6b35' : rank === 2 ? '#ffc857' : '#94a3b8'
            : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          color: rank <= 3 ? '#fff' : 'text.secondary',
        }}
      >
        {rank}
      </Box>

      {/* Content */}
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: `${categoryColors[post.category]}20`,
                color: categoryColors[post.category],
                fontWeight: 600,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {post.title}
            </Typography>
          </Box>
        }
        secondary={
          <Stack direction="row" spacing={1.5} sx={{ mt: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {post.author.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbUpIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">
                {post.upvotes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">
                {post.commentCount}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.disabled">
              {timeAgo}
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
};

export const CommunityBoard: React.FC<CommunityBoardProps> = ({
  boardType,
  title,
  subtitle,
  showSubCategories: showSubCategoriesProp = true,
  subCategories,
}) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [selectedSubCategory, setSelectedSubCategory] = useState<PostCategory | 'all'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 20;

  // New hierarchical filter states - now supports multi-select
  const [selectedMainCategories, setSelectedMainCategories] = useState<MainCategory[]>([]);
  const [selectedSubTags, setSelectedSubTags] = useState<SubCategoryTag[]>([]);
  const [expandedMainCategory, setExpandedMainCategory] = useState<MainCategory | null>(null);

  // For general board, show all posts
  // For category-specific boards, show only that category's posts
  const isGeneralBoard = boardType === 'general';
  const mainCategory = boardTypeToCategory[boardType];

  // Default sub-categories based on board type
  // For general board (Community), show ALL categories
  const defaultSubCategories: PostCategory[] = isGeneralBoard
    ? ['스킬', 'MCP', '프롬프트', 'AI 코딩 툴', '커뮤니티', '질문']
    : [mainCategory];

  const categories = subCategories || defaultSubCategories;

  // Only show sub-category filter for general board or when there are multiple categories
  const showSubCategories = showSubCategoriesProp && (isGeneralBoard || categories.length > 1);

  // Fetch posts from database or sample data based on debug mode
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const fetchedPosts = await getBoardPosts(boardType, {
          sortBy: 'new',
          limit: 50,
        });

        setPosts(fetchedPosts);
        // Set usingSampleData based on debug mode
        setUsingSampleData(isDebugMode());
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(language === 'ko' ? '게시글을 불러오는 데 실패했습니다' : 'Failed to load posts');
        setPosts([]);
        setUsingSampleData(false);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [boardType, language]);

  // Helper function to get top posts by score
  const getTopPosts = (postList: Post[]) => {
    return [...postList].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  };

  // Helper function to get hot posts
  const getHotPosts = (postList: Post[]) => {
    const now = Date.now();
    return [...postList].sort((a, b) => {
      const hoursA = (now - a.createdAt.getTime()) / (1000 * 60 * 60) + 2;
      const hoursB = (now - b.createdAt.getTime()) / (1000 * 60 * 60) + 2;
      const scoreA = (a.upvotes - a.downvotes) / Math.pow(hoursA, 1.5);
      const scoreB = (b.upvotes - b.downvotes) / Math.pow(hoursB, 1.5);
      return scoreB - scoreA;
    });
  };

  // Helper function to get new posts
  const getNewPosts = (postList: Post[]) => {
    return [...postList].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  // Get popular posts (top 5 by upvotes)
  const popularPosts = useMemo(() => {
    return getTopPosts(posts).slice(0, 5);
  }, [posts]);

  // Sort and filter posts for main list
  const displayedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by selected main categories (multi-select)
    if (selectedMainCategories.length > 0) {
      filtered = filtered.filter(post =>
        post.mainCategory && selectedMainCategories.includes(post.mainCategory)
      );
    }

    // Filter by selected sub-tags (multi-select)
    if (selectedSubTags.length > 0) {
      filtered = filtered.filter(post =>
        post.subCategoryTag && selectedSubTags.includes(post.subCategoryTag)
      );
    }

    // Legacy filter by sub-category (for backward compatibility)
    if (selectedSubCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedSubCategory);
    }

    // Filter by search query (title, author, content)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'hot':
        return getHotPosts(filtered);
      case 'new':
        return getNewPosts(filtered);
      case 'top':
        return getTopPosts(filtered);
      default:
        return filtered;
    }
  }, [posts, sortBy, selectedSubCategory, selectedMainCategories, selectedSubTags, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(displayedPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return displayedPosts.slice(startIndex, startIndex + postsPerPage);
  }, [displayedPosts, currentPage, postsPerPage]);

  // Reset page when filter/sort/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedSubCategory, selectedMainCategories, selectedSubTags, searchQuery]);

  // Check if any filters are active
  const hasActiveFilters = selectedMainCategories.length > 0 || selectedSubTags.length > 0;

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedMainCategories([]);
    setSelectedSubTags([]);
    setExpandedMainCategory(null);
  };

  // Handle main category click - expand/collapse AND auto-select 'all'
  const handleMainCategoryClick = (category: MainCategory) => {
    const isCurrentlyExpanded = expandedMainCategory === category;

    if (isCurrentlyExpanded) {
      // Collapsing: just close, don't change selection
      setExpandedMainCategory(null);
    } else {
      // Expanding: open and auto-select 'all' for this category
      setExpandedMainCategory(category);

      // Auto-select 'all' for this category if not already selected
      if (!selectedMainCategories.includes(category)) {
        setSelectedMainCategories(prev => [...prev, category]);
        // Clear any sub-tags from this category since we're selecting "all"
        const categorySubTags = mainCategoryConfig[category].subCategories;
        setSelectedSubTags(prev => prev.filter(t => !categorySubTags.includes(t)));
      }
    }
  };

  // Handle '전체' (All) button click within a main category - selects the main category
  const handleSelectAllInCategory = (category: MainCategory) => {
    setSelectedMainCategories(prev => {
      if (prev.includes(category)) {
        // Deselect: remove from array
        return prev.filter(c => c !== category);
      } else {
        // Select: add to array
        return [...prev, category];
      }
    });
    // Also clear any sub-tags from this category since we're selecting "all"
    const categorySubTags = mainCategoryConfig[category].subCategories;
    setSelectedSubTags(prev => prev.filter(t => !categorySubTags.includes(t)));
  };

  // Handle sub-tag click - toggle selection (mutually exclusive with '전체')
  const handleSubTagClick = (subTag: SubCategoryTag, mainCategory: MainCategory) => {
    // When selecting a sub-tag, deselect '전체' for this category
    setSelectedMainCategories(prev => prev.filter(c => c !== mainCategory));

    setSelectedSubTags(prev => {
      if (prev.includes(subTag)) {
        // Deselect: remove from array
        return prev.filter(t => t !== subTag);
      } else {
        // Select: add to array
        return [...prev, subTag];
      }
    });
  };

  // Remove a specific main category filter
  const handleRemoveMainCategory = (category: MainCategory) => {
    setSelectedMainCategories(prev => prev.filter(c => c !== category));
    // Also remove any sub-tags that belong to this category
    const categorySubTags = mainCategoryConfig[category].subCategories;
    setSelectedSubTags(prev => prev.filter(t => !categorySubTags.includes(t)));
  };

  // Remove a specific sub-tag filter
  const handleRemoveSubTag = (subTag: SubCategoryTag) => {
    setSelectedSubTags(prev => prev.filter(t => t !== subTag));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, newSort: SortOption | null) => {
    if (newSort) {
      setSortBy(newSort);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      alert(t('common.loginRequired'));
      return;
    }
    router.push('/board/write');
  };

  return (
    <Box sx={{ minHeight: '50vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Controls Bar - Search, Sort, Filter, Add */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {/* Top Row: Search + Add Button */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder={language === 'ko' ? '검색...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? '#222' : '#fafafa',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{
              bgcolor: '#ff6b35',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              borderRadius: 1.5,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': {
                bgcolor: '#e55a2b',
              },
            }}
          >
            {language === 'ko' ? '글쓰기' : 'Write'}
          </Button>
        </Box>

        {/* Bottom Row: Sort + Categories */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {/* Sort Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {language === 'ko' ? '정렬' : 'Sort'}
            </Typography>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={handleSortChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.25,
                  gap: 0.5,
                  fontSize: '0.8rem',
                  borderColor: theme.palette.divider,
                  '&.Mui-selected': {
                    bgcolor: '#ff6b35',
                    color: '#fff',
                    borderColor: '#ff6b35',
                    '&:hover': {
                      bgcolor: '#e55a2b',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="hot">
                <HotIcon sx={{ fontSize: 14 }} />
                {language === 'ko' ? '인기' : 'Hot'}
              </ToggleButton>
              <ToggleButton value="new">
                <NewIcon sx={{ fontSize: 14 }} />
                {language === 'ko' ? '최신' : 'New'}
              </ToggleButton>
              <ToggleButton value="top">
                <TopIcon sx={{ fontSize: 14 }} />
                {language === 'ko' ? '추천' : 'Top'}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Hierarchical Category Filter - Multi-select */}
          {showSubCategories && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              {/* Filter Selection UI */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Main Categories - expand/collapse toggles */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', minWidth: 35 }}>
                    {language === 'ko' ? '필터' : 'Filter'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {/* Main category chips - just toggles to expand sub-categories */}
                    {(Object.keys(mainCategoryConfig) as MainCategory[]).map((mainCat) => {
                      const config = mainCategoryConfig[mainCat];
                      const isExpanded = expandedMainCategory === mainCat;
                      const hasSelection = selectedMainCategories.includes(mainCat) ||
                        selectedSubTags.some(tag => config.subCategories.includes(tag));

                      return (
                        <Chip
                          key={mainCat}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>{config.icon}</span>
                              <span>{mainCat}</span>
                              {isExpanded ? <ExpandLessIcon sx={{ fontSize: 14, ml: 0.25 }} /> : <ExpandMoreIcon sx={{ fontSize: 14, ml: 0.25 }} />}
                            </Box>
                          }
                          size="small"
                          variant={isExpanded ? 'filled' : 'outlined'}
                          onClick={() => handleMainCategoryClick(mainCat)}
                          sx={{
                            fontWeight: isExpanded || hasSelection ? 600 : 400,
                            fontSize: '0.75rem',
                            height: 26,
                            bgcolor: isExpanded ? config.color : 'transparent',
                            color: isExpanded ? '#fff' : hasSelection ? config.color : 'text.secondary',
                            borderColor: isExpanded || hasSelection ? config.color : theme.palette.divider,
                            '&:hover': {
                              bgcolor: isExpanded ? config.color : `${config.color}20`,
                              borderColor: config.color,
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Sub-category tags (shown when main category is expanded) */}
                {expandedMainCategory && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      flexWrap: 'wrap',
                      pl: { xs: 0, sm: 5 },
                      pt: 1,
                      borderTop: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem', mr: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{mainCategoryConfig[expandedMainCategory].icon}</span>
                      <span>{expandedMainCategory}:</span>
                    </Typography>
                    {/* '전체' button to select entire main category */}
                    <Chip
                      label={language === 'ko' ? '전체' : 'All'}
                      size="small"
                      variant={selectedMainCategories.includes(expandedMainCategory) ? 'filled' : 'outlined'}
                      onClick={() => handleSelectAllInCategory(expandedMainCategory)}
                      sx={{
                        fontWeight: selectedMainCategories.includes(expandedMainCategory) ? 600 : 400,
                        fontSize: '0.7rem',
                        height: 22,
                        bgcolor: selectedMainCategories.includes(expandedMainCategory)
                          ? mainCategoryConfig[expandedMainCategory].color
                          : 'transparent',
                        color: selectedMainCategories.includes(expandedMainCategory) ? '#fff' : 'text.secondary',
                        borderColor: selectedMainCategories.includes(expandedMainCategory)
                          ? mainCategoryConfig[expandedMainCategory].color
                          : theme.palette.divider,
                        '&:hover': {
                          bgcolor: selectedMainCategories.includes(expandedMainCategory)
                            ? mainCategoryConfig[expandedMainCategory].color
                            : `${mainCategoryConfig[expandedMainCategory].color}20`,
                          borderColor: mainCategoryConfig[expandedMainCategory].color,
                        },
                      }}
                    />
                    {/* Sub-category tags */}
                    {mainCategoryConfig[expandedMainCategory].subCategories.map((subTag) => {
                      const isSelected = selectedSubTags.includes(subTag);
                      const color = subCategoryColors[subTag];

                      return (
                        <Chip
                          key={subTag}
                          label={subTag}
                          size="small"
                          variant={isSelected ? 'filled' : 'outlined'}
                          onClick={() => handleSubTagClick(subTag, expandedMainCategory)}
                          sx={{
                            fontWeight: isSelected ? 600 : 400,
                            fontSize: '0.7rem',
                            height: 22,
                            bgcolor: isSelected ? color : 'transparent',
                            color: isSelected ? '#fff' : 'text.secondary',
                            borderColor: isSelected ? color : theme.palette.divider,
                            '&:hover': {
                              bgcolor: isSelected ? color : `${color}20`,
                              borderColor: color,
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </Box>

              {/* Selected Filters Display - Separate section */}
              {hasActiveFilters && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.05)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,107,53,0.3)' : 'rgba(255,107,53,0.2)'}`,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#ff6b35', minWidth: 50 }}>
                    {language === 'ko' ? '선택됨' : 'Selected'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                    {/* Selected main categories (전체) with remove button */}
                    {selectedMainCategories.map((mainCat) => {
                      const config = mainCategoryConfig[mainCat];
                      return (
                        <Chip
                          key={`selected-${mainCat}`}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>{config.icon}</span>
                              <span>{mainCat}</span>
                              <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>({language === 'ko' ? '전체' : 'All'})</span>
                            </Box>
                          }
                          size="small"
                          onDelete={() => handleRemoveMainCategory(mainCat)}
                          deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 26,
                            bgcolor: config.color,
                            color: '#fff',
                            '& .MuiChip-deleteIcon': {
                              color: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                color: '#fff',
                              },
                            },
                          }}
                        />
                      );
                    })}
                    {/* Selected sub-tags with remove button */}
                    {selectedSubTags.map((subTag) => {
                      const color = subCategoryColors[subTag];
                      return (
                        <Chip
                          key={`selected-${subTag}`}
                          label={subTag}
                          size="small"
                          onDelete={() => handleRemoveSubTag(subTag)}
                          deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 22,
                            bgcolor: color,
                            color: '#fff',
                            '& .MuiChip-deleteIcon': {
                              color: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                color: '#fff',
                              },
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                  {/* Reset button */}
                  <Chip
                    label={language === 'ko' ? '초기화' : 'Reset'}
                    size="small"
                    onClick={handleResetFilters}
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 22,
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      '&:hover': {
                        bgcolor: `${theme.palette.error.main}15`,
                        borderColor: theme.palette.error.main,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Debug mode notice */}
      {usingSampleData && !loading && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {language === 'ko'
            ? '🔧 디버그 모드: 샘플 데이터를 표시하고 있습니다. 실제 데이터를 보려면 NEXT_PUBLIC_DEBUG_MODE=false로 설정하세요.'
            : '🔧 Debug Mode: Showing sample data. Set NEXT_PUBLIC_DEBUG_MODE=false for real data.'}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ff6b35' }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
          }}
        >
          {/* Main Content Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Posts List - DC Inside style table */}
            {paginatedPosts.length > 0 ? (
              <>
                <PostListTable
                  posts={paginatedPosts}
                  showCategory={isGeneralBoard || categories.length > 1}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                      mt: 3,
                      py: 2,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? 'small' : 'medium'}
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 1,
                          minWidth: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          '&.Mui-selected': {
                            bgcolor: '#ff6b35',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#e55a2b',
                            },
                          },
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {language === 'ko'
                        ? `총 ${displayedPosts.length}개 (${currentPage}/${totalPages} 페이지)`
                        : `Total ${displayedPosts.length} (Page ${currentPage}/${totalPages})`}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ko'
                    ? (searchQuery ? '검색 결과가 없습니다' : '아직 게시글이 없습니다')
                    : (searchQuery ? 'No results found' : 'No posts yet')}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {language === 'ko'
                    ? (searchQuery ? '다른 검색어를 입력해보세요' : '첫 번째 글을 작성해보세요!')
                    : (searchQuery ? 'Try a different search term' : 'Be the first to post!')}
                </Typography>
              </Box>
            )}

          </Box>

          {/* Sidebar - Popular Posts (DC Inside style) */}
          <Box
            sx={{
              width: { xs: '100%', lg: 320 },
              flexShrink: 0,
              order: { xs: -1, lg: 0 }, // Show on top for mobile
              position: { lg: 'sticky' },
              top: { lg: 100 },
              alignSelf: 'flex-start',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8fafc',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <HotIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
                  {language === 'ko' ? '실시간 인기글' : 'Popular Posts'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { color: '#ff6b35' },
                  }}
                >
                  {language === 'ko' ? '더보기' : 'More'}
                  <ArrowIcon sx={{ fontSize: 16 }} />
                </Typography>
              </Box>

              {/* Popular Posts List */}
              <List disablePadding>
                {popularPosts.length > 0 ? (
                  popularPosts.map((post, index) => (
                    <PopularPostItem key={post.id} post={post} rank={index + 1} />
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ko' ? '인기글이 없습니다' : 'No popular posts'}
                    </Typography>
                  </Box>
                )}
              </List>
            </Paper>

            {/* Weekly Best Section */}
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                display: { xs: 'none', lg: 'block' },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8fafc',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <TopIcon sx={{ color: '#ffc857', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
                  {language === 'ko' ? '주간 베스트' : 'Weekly Best'}
                </Typography>
              </Box>

              {/* Weekly Best List */}
              <List disablePadding>
                {getTopPosts(posts).slice(0, 3).map((post, index) => (
                  <ListItem
                    key={post.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        bgcolor: categoryColors[post.category],
                        fontSize: '0.9rem',
                      }}
                    >
                      {categoryIcons[post.category]}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {post.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                          <ThumbUpIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled">
                            {post.upvotes}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};
