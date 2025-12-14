'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
  Pagination,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  TrendingUp as TopIcon,
  KeyboardArrowRight as ArrowIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { NewsListTable } from '@/components/News/NewsListTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  NewsItem,
  NewsCategory,
  categoryColors,
  categoryIcons,
} from '@/types/news';
import {
  getNews,
  getPopularNews,
  getUserBookmarks,
  toggleBookmark,
  SortOption,
} from '@/services/newsService';

// Sample news data (fallback when database is empty)
const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
    summary: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다. 코딩 벤치마크에서 이전 버전 대비 30% 향상된 성능을 보여주며, 특히 복잡한 멀티파일 프로젝트 처리 능력이 크게 개선되었습니다.',
    source: 'Anthropic Blog',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    upvoteCount: 342,
    downvoteCount: 12,
    commentCount: 89,
    viewCount: 2850,
    status: 'published',
  },
  {
    id: '2',
    title: 'GitHub Copilot, 새로운 코드 리뷰 기능 추가',
    summary: 'GitHub이 Copilot에 AI 기반 코드 리뷰 기능을 추가했습니다. PR을 자동으로 분석하고 잠재적인 버그와 보안 취약점을 식별해줍니다.',
    source: 'GitHub Blog',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    upvoteCount: 256,
    downvoteCount: 8,
    commentCount: 67,
    viewCount: 1920,
    status: 'published',
  },
  {
    id: '3',
    title: 'Cursor IDE 1.0 정식 출시 - AI 네이티브 개발 환경의 새로운 기준',
    summary: 'Cursor가 드디어 1.0 버전을 정식 출시했습니다. VS Code 기반의 AI 네이티브 IDE로, Claude와 GPT-4를 모두 지원하며 실시간 코드 생성과 리팩토링 기능을 제공합니다.',
    source: 'Cursor',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    upvoteCount: 523,
    downvoteCount: 15,
    commentCount: 134,
    viewCount: 4210,
    status: 'published',
  },
  {
    id: '4',
    title: 'React 19 RC 발표 - 서버 컴포넌트 정식 지원',
    summary: 'React 팀이 React 19 Release Candidate를 발표했습니다. 서버 컴포넌트가 정식으로 지원되며, use() 훅과 향상된 Suspense 기능이 포함되었습니다.',
    source: 'React Blog',
    sourceUrl: '#',
    category: '개발',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    upvoteCount: 412,
    downvoteCount: 10,
    commentCount: 98,
    viewCount: 3540,
    status: 'published',
  },
  {
    id: '5',
    title: '바이브 코딩이란? AI와 함께하는 새로운 개발 패러다임',
    summary: '바이브 코딩(Vibe Coding)은 AI 어시스턴트와 협업하여 코드를 작성하는 새로운 개발 방식입니다. 전통적인 코딩과의 차이점과 효과적인 활용법을 알아봅니다.',
    source: 'VIB Builders',
    sourceUrl: '#',
    category: '튜토리얼',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    upvoteCount: 287,
    downvoteCount: 5,
    commentCount: 45,
    viewCount: 1650,
    status: 'published',
  },
  {
    id: '6',
    title: 'OpenAI, GPT-5 개발 진행 상황 공개',
    summary: 'OpenAI CEO Sam Altman이 GPT-5 개발이 순조롭게 진행중이라고 밝혔습니다. 멀티모달 능력과 추론 성능이 크게 향상될 것으로 예상됩니다.',
    source: 'TechCrunch',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    upvoteCount: 678,
    downvoteCount: 20,
    commentCount: 234,
    viewCount: 5890,
    status: 'published',
  },
  {
    id: '7',
    title: 'Vercel, AI SDK 3.0 출시 - 스트리밍 응답 개선',
    summary: 'Vercel이 AI SDK 3.0을 출시했습니다. OpenAI, Anthropic, Google AI를 통합 지원하며, 스트리밍 응답 처리가 크게 개선되었습니다.',
    source: 'Vercel Blog',
    sourceUrl: '#',
    category: '개발',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    upvoteCount: 189,
    downvoteCount: 3,
    commentCount: 42,
    viewCount: 1280,
    status: 'published',
  },
  {
    id: '8',
    title: 'AI 스타트업 투자 트렌드 2024: 코딩 도구에 집중',
    summary: '2024년 AI 스타트업 투자는 개발자 도구와 코딩 어시스턴트에 집중되고 있습니다. Cursor, Replit, Sourcegraph 등이 대규모 투자를 유치했습니다.',
    source: 'Forbes',
    sourceUrl: '#',
    category: '스타트업',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    upvoteCount: 156,
    downvoteCount: 7,
    commentCount: 28,
    viewCount: 980,
    status: 'published',
  },
  {
    id: '9',
    title: 'MCP(Model Context Protocol) 완벽 가이드',
    summary: 'Anthropic이 발표한 MCP는 AI 모델과 외부 도구를 연결하는 표준 프로토콜입니다. 설치부터 커스텀 서버 구축까지 상세히 알아봅니다.',
    source: 'VIB Builders',
    sourceUrl: '#',
    category: '튜토리얼',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    upvoteCount: 234,
    downvoteCount: 4,
    commentCount: 67,
    viewCount: 2100,
    status: 'published',
  },
  {
    id: '10',
    title: '2024년 개발자 설문: AI 도구 사용률 78% 돌파',
    summary: 'Stack Overflow 개발자 설문 결과, 78%의 개발자가 AI 코딩 도구를 사용하고 있는 것으로 나타났습니다. 가장 인기 있는 도구는 GitHub Copilot과 ChatGPT입니다.',
    source: 'Stack Overflow',
    sourceUrl: '#',
    category: '트렌드',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    upvoteCount: 345,
    downvoteCount: 9,
    commentCount: 89,
    viewCount: 3120,
    status: 'published',
  },
];

// Compact news item for popular section
const PopularNewsItem: React.FC<{ news: NewsItem; rank: number }> = ({ news, rank }) => {
  const theme = useTheme();
  const { language } = useLanguage();

  const timeAgo = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - news.createdAt.getTime();
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
  }, [news.createdAt, language]);

  return (
    <ListItem
      component="a"
      href={news.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        textDecoration: 'none',
        color: 'inherit',
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
              label={news.category}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: `${categoryColors[news.category]}20`,
                color: categoryColors[news.category],
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
              {news.title}
            </Typography>
          </Box>
        }
        secondary={
          <Stack direction="row" spacing={1.5} sx={{ mt: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {news.source}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">
                {news.viewCount.toLocaleString()}
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

export default function NewsPage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [popularNews, setPopularNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const newsPerPage = 20;

  const categories: (NewsCategory | 'all')[] = ['all', 'AI', '개발', '스타트업', '트렌드', '튜토리얼'];

  // Fetch news from database
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const [fetchedNews, fetchedPopular] = await Promise.all([
          getNews({ sortBy, category: selectedCategory, searchQuery }),
          getPopularNews(5),
        ]);

        if (fetchedNews.length > 0) {
          setNews(fetchedNews);
          setPopularNews(fetchedPopular.length > 0 ? fetchedPopular : getSamplePopularNews());
          setUsingSampleData(false);
        } else {
          // Fall back to sample data
          setNews(sortSampleNews(sampleNews, sortBy, selectedCategory, searchQuery));
          setPopularNews(getSamplePopularNews());
          setUsingSampleData(true);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(sortSampleNews(sampleNews, sortBy, selectedCategory, searchQuery));
        setPopularNews(getSamplePopularNews());
        setUsingSampleData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [sortBy, selectedCategory, searchQuery]);

  // Fetch user bookmarks
  useEffect(() => {
    async function fetchBookmarks() {
      if (user?.id) {
        const bookmarks = await getUserBookmarks(user.id);
        setBookmarkedIds(bookmarks);
      } else {
        setBookmarkedIds(new Set());
      }
    }

    fetchBookmarks();
  }, [user?.id]);

  // Sort sample data locally
  function sortSampleNews(
    data: NewsItem[],
    sort: SortOption,
    category: NewsCategory | 'all',
    query: string
  ): NewsItem[] {
    let filtered = data;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter((n) => n.category === category);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'hot':
        return [...filtered].sort((a, b) => b.viewCount - a.viewCount);
      case 'top':
        return [...filtered].sort((a, b) => b.upvoteCount - a.upvoteCount);
      case 'new':
      default:
        return [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  function getSamplePopularNews(): NewsItem[] {
    return [...sampleNews].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  }

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, newSort: SortOption | null) => {
    if (newSort) {
      setSortBy(newSort);
    }
  };

  const handleToggleBookmark = async (id: string) => {
    if (!user?.id) {
      // Optionally show login prompt
      return;
    }

    try {
      const isNowBookmarked = await toggleBookmark(user.id, id);
      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        if (isNowBookmarked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(news.length / newsPerPage);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * newsPerPage;
    return news.slice(startIndex, startIndex + newsPerPage);
  }, [news, currentPage, newsPerPage]);

  // Reset page when filter/sort/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedCategory, searchQuery]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Page Header */}
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
            {language === 'ko' ? '뉴스' : 'News'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? 'AI와 개발 관련 최신 소식을 확인하세요'
              : 'Stay updated with the latest AI and development news'}
          </Typography>
        </Box>

        {/* Controls Bar */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {/* Search */}
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

          {/* Sort + Categories */}
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

            {/* Category Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                {language === 'ko' ? '필터' : 'Filter'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {categories.map((category) => {
                  const color = categoryColors[category];
                  const icon = categoryIcons[category];
                  const isSelected = selectedCategory === category;
                  const label = category === 'all' ? (language === 'ko' ? '전체' : 'All') : category;

                  return (
                    <Chip
                      key={category}
                      label={`${icon} ${label}`}
                      size="small"
                      onClick={() => setSelectedCategory(category)}
                      sx={{
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: '0.75rem',
                        height: 26,
                        bgcolor: isSelected ? color : 'transparent',
                        color: isSelected ? '#fff' : 'text.secondary',
                        border: `1px solid ${isSelected ? color : theme.palette.divider}`,
                        '&:hover': {
                          bgcolor: isSelected ? color : `${color}20`,
                          borderColor: color,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Sample data notice */}
        {usingSampleData && !loading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {language === 'ko'
              ? '현재 샘플 데이터를 표시하고 있습니다. 실제 뉴스가 추가되면 자동으로 업데이트됩니다.'
              : 'Showing sample data. Will be automatically updated when real news is added.'}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#ff6b35' }} />
          </Box>
        )}

        {!loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 3,
            }}
          >
            {/* News List */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {paginatedNews.length > 0 ? (
                <>
                  <NewsListTable
                    news={paginatedNews}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                    categoryColors={categoryColors}
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
                          ? `총 ${news.length}개 (${currentPage}/${totalPages} 페이지)`
                          : `Total ${news.length} (Page ${currentPage}/${totalPages})`}
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
                      ? (searchQuery ? '검색 결과가 없습니다' : '뉴스가 없습니다')
                      : (searchQuery ? 'No results found' : 'No news yet')}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {language === 'ko'
                      ? (searchQuery ? '다른 검색어를 입력해보세요' : '곧 새로운 소식이 올라옵니다!')
                      : (searchQuery ? 'Try a different search term' : 'New updates coming soon!')}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Sidebar */}
            <Box
              sx={{
                width: { xs: '100%', lg: 320 },
                flexShrink: 0,
                order: { xs: -1, lg: 0 },
                position: { lg: 'sticky' },
                top: { lg: 100 },
                alignSelf: 'flex-start',
              }}
            >
              {/* Trending News */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                }}
              >
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
                    {language === 'ko' ? '실시간 인기' : 'Trending'}
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
                <List disablePadding>
                  {popularNews.map((item, index) => (
                    <PopularNewsItem key={item.id} news={item} rank={index + 1} />
                  ))}
                </List>
              </Paper>

              {/* Newsletter Signup */}
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff8f5',
                  display: { xs: 'none', lg: 'block' },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  {language === 'ko' ? '뉴스레터 구독' : 'Subscribe to Newsletter'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {language === 'ko'
                    ? '매주 핫한 AI/개발 소식을 이메일로 받아보세요'
                    : 'Get weekly hot AI/dev news in your inbox'}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={language === 'ko' ? '이메일 주소' : 'Email address'}
                  sx={{
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
                <Box
                  component="button"
                  sx={{
                    width: '100%',
                    py: 1,
                    bgcolor: '#ff6b35',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 1.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#e55a2b' },
                  }}
                >
                  {language === 'ko' ? '구독하기' : 'Subscribe'}
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
