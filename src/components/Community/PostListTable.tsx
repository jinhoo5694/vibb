'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  PushPin as PinIcon,
} from '@mui/icons-material';
import { Post, categoryColors } from '@/types/post';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostListTableProps {
  posts: Post[];
  showCategory?: boolean;
}

// Single row component for a post
const PostRow: React.FC<{ post: Post; showCategory: boolean }> = ({ post, showCategory }) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      // Today - show time
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      // Older - show date as MM.DD
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}.${day}`;
    }
  };

  const score = post.upvotes - post.downvotes;

  return (
    <Link href={`/board/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1,
          px: { xs: 1.5, sm: 2 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          cursor: 'pointer',
          transition: 'background-color 0.15s',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          },
          minHeight: 44,
        }}
      >
        {/* Category - Compact chip */}
        {showCategory && (
          <Box sx={{ width: { xs: 50, sm: 70 }, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <Chip
              label={post.category.length > 3 ? post.category.slice(0, 3) : post.category}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: `${categoryColors[post.category]}15`,
                color: categoryColors[post.category],
                '& .MuiChip-label': {
                  px: 0.75,
                },
              }}
            />
          </Box>
        )}

        {/* Title + Comment Count - Flex grow */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 0.5, pr: 1 }}>
          {post.isPinned && (
            <PinIcon sx={{ fontSize: 14, color: '#ff6b35', flexShrink: 0 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: post.isPinned ? 600 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: post.isPinned ? '#ff6b35' : 'text.primary',
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
            }}
          >
            {post.title}
          </Typography>
          {post.commentCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: '#ff6b35',
                fontWeight: 700,
                fontSize: '0.75rem',
                flexShrink: 0,
                ml: 0.5,
              }}
            >
              [{post.commentCount}]
            </Typography>
          )}
        </Box>

        {/* Author */}
        <Typography
          component="span"
          variant="caption"
          onClick={(e: React.MouseEvent) => {
            if (post.author.id) {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/profile/${post.author.id}`);
            }
          }}
          sx={{
            width: { xs: 60, sm: 90 },
            flexShrink: 0,
            color: 'text.secondary',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.75rem',
            cursor: post.author.id ? 'pointer' : 'default',
            '&:hover': post.author.id ? {
              color: 'primary.main',
              textDecoration: 'underline',
            } : {},
          }}
        >
          {post.author.name}
        </Typography>

        {/* Date */}
        <Typography
          variant="caption"
          sx={{
            width: { xs: 45, sm: 55 },
            flexShrink: 0,
            color: 'text.disabled',
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          {formatDate(post.createdAt)}
        </Typography>

        {/* Views - Hidden on mobile */}
        {!isMobile && (
          <Typography
            variant="caption"
            sx={{
              width: 50,
              flexShrink: 0,
              color: 'text.disabled',
              textAlign: 'center',
              fontSize: '0.75rem',
            }}
          >
            {post.viewCount ?? 0}
          </Typography>
        )}

        {/* Votes/Recommendations */}
        <Typography
          variant="caption"
          sx={{
            width: { xs: 35, sm: 45 },
            flexShrink: 0,
            color: score > 50 ? '#ff6b35' : score > 10 ? 'text.secondary' : 'text.disabled',
            fontWeight: score > 50 ? 700 : 500,
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          {score > 0 ? score : '-'}
        </Typography>
      </Box>
    </Link>
  );
};

// Table header component
const TableHeader: React.FC<{ showCategory: boolean }> = ({ showCategory }) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        px: { xs: 1.5, sm: 2 },
        borderBottom: `2px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8fafc',
      }}
    >
      {showCategory && (
        <Typography
          variant="caption"
          sx={{
            width: { xs: 50, sm: 70 },
            flexShrink: 0,
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {language === 'ko' ? '말머리' : 'Cat.'}
        </Typography>
      )}

      <Typography
        variant="caption"
        sx={{
          flex: 1,
          color: 'text.secondary',
          fontWeight: 600,
          fontSize: '0.75rem',
          pl: 0.5,
        }}
      >
        {language === 'ko' ? '제목' : 'Title'}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          width: { xs: 60, sm: 90 },
          flexShrink: 0,
          color: 'text.secondary',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {language === 'ko' ? '글쓴이' : 'Author'}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          width: { xs: 45, sm: 55 },
          flexShrink: 0,
          color: 'text.secondary',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {language === 'ko' ? '작성일' : 'Date'}
      </Typography>

      {!isMobile && (
        <Typography
          variant="caption"
          sx={{
            width: 50,
            flexShrink: 0,
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {language === 'ko' ? '조회' : 'Views'}
        </Typography>
      )}

      <Typography
        variant="caption"
        sx={{
          width: { xs: 35, sm: 45 },
          flexShrink: 0,
          color: 'text.secondary',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {language === 'ko' ? '추천' : 'Votes'}
      </Typography>
    </Box>
  );
};

export const PostListTable: React.FC<PostListTableProps> = ({ posts, showCategory = true }) => {
  const theme = useTheme();

  if (posts.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          게시글이 없습니다
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      <TableHeader showCategory={showCategory} />
      {posts.map((post) => (
        <PostRow key={post.id} post={post} showCategory={showCategory} />
      ))}
    </Box>
  );
};
