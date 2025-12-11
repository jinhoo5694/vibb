'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useTheme,
  Button,
  useMediaQuery,
} from '@mui/material';
import {
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  TrendingUp as TopIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PostCard } from './PostCard';
import { samplePosts, getHotPosts, getNewPosts, getTopPosts, filterByCategory } from '@/data/posts';
import { SortOption, PostCategory, categoryColors, categoryIcons } from '@/types/post';

const categories: (PostCategory | 'all')[] = ['all', '스킬', 'MCP', '프롬프트', 'AI 도구', '자유게시판', '질문'];

export const PostFeed: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');

  const sortedPosts = useMemo(() => {
    let posts = filterByCategory(samplePosts, selectedCategory);

    switch (sortBy) {
      case 'hot':
        return getHotPosts(posts);
      case 'new':
        return getNewPosts(posts);
      case 'top':
        return getTopPosts(posts);
      default:
        return posts;
    }
  }, [sortBy, selectedCategory]);

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, newSort: SortOption | null) => {
    if (newSort) {
      setSortBy(newSort);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '50vh',
      }}
    >
      <Box>
        {/* Create Post Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              },
            }}
          >
            새 글 작성하기...
          </Button>
        </Box>

        {/* Sort & Filter Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Sort Options */}
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={handleSortChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
                gap: 0.5,
                borderColor: theme.palette.divider,
                '&.Mui-selected': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                  borderColor: '#ff6b35',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 107, 53, 0.25)' : 'rgba(255, 107, 53, 0.15)',
                  },
                },
              },
            }}
          >
            <ToggleButton value="hot">
              <HotIcon sx={{ fontSize: 18 }} />
              {!isMobile && '인기'}
            </ToggleButton>
            <ToggleButton value="new">
              <NewIcon sx={{ fontSize: 18 }} />
              {!isMobile && '최신'}
            </ToggleButton>
            <ToggleButton value="top">
              <TopIcon sx={{ fontSize: 18 }} />
              {!isMobile && '추천순'}
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Category Filter */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              flexWrap: 'wrap',
              flex: 1,
            }}
          >
            {categories.map((category) => {
              const isAll = category === 'all';
              const color = isAll ? theme.palette.primary.main : categoryColors[category as PostCategory];
              const icon = isAll ? '🏠' : categoryIcons[category as PostCategory];
              const isSelected = selectedCategory === category;

              return (
                <Chip
                  key={category}
                  label={`${icon} ${isAll ? '전체' : category}`}
                  size="small"
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.8rem',
                    bgcolor: isSelected ? `${color}20` : 'transparent',
                    color: isSelected ? color : 'text.secondary',
                    border: `1px solid ${isSelected ? color : 'transparent'}`,
                    '&:hover': {
                      bgcolor: `${color}15`,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Posts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                아직 게시글이 없습니다
              </Typography>
              <Typography variant="body2" color="text.disabled">
                첫 번째 글을 작성해보세요!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Load More */}
        {sortedPosts.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
              }}
            >
              더 보기
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
