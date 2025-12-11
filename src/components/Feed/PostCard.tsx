'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ArrowUpward as UpvoteIcon,
  ArrowDownward as DownvoteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  PushPin as PinIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Post, categoryColors, categoryIcons } from '@/types/post';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  index?: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, index = 0 }) => {
  const theme = useTheme();
  const score = post.upvotes - post.downvotes;
  const categoryColor = categoryColors[post.category];
  const categoryIcon = categoryIcons[post.category];

  const timeAgo = formatDistanceToNow(post.createdAt, {
    addSuffix: true,
    locale: ko,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Box
        sx={{
          display: 'flex',
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          },
        }}
      >
        {/* Vote Column */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 1.5,
            px: 1,
            bgcolor: theme.palette.mode === 'dark' ? '#141414' : '#f8f9fa',
            minWidth: 50,
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: '#ff4500', bgcolor: 'rgba(255, 69, 0, 0.1)' },
            }}
          >
            <UpvoteIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: score > 0 ? '#ff4500' : score < 0 ? '#7193ff' : 'text.secondary',
            }}
          >
            {score}
          </Typography>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: '#7193ff', bgcolor: 'rgba(113, 147, 255, 0.1)' },
            }}
          >
            <DownvoteIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content Column */}
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          {/* Header: Category, Author, Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${categoryIcon} ${post.category}`}
              size="small"
              sx={{
                bgcolor: `${categoryColor}20`,
                color: categoryColor,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Avatar
                src={post.author.avatar}
                sx={{ width: 20, height: 20, fontSize: '0.7rem' }}
              >
                {post.author.name.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {post.author.name}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                •
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo}
              </Typography>
            </Box>
            {post.isPinned && (
              <Chip
                icon={<PinIcon sx={{ fontSize: 14 }} />}
                label="고정됨"
                size="small"
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 22,
                  '& .MuiChip-icon': { color: '#ff6b35' },
                }}
              />
            )}
          </Box>

          {/* Title */}
          <Link href={`/board/${post.id}`} style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.4,
                mb: 0.5,
                cursor: 'pointer',
                color: 'text.primary',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {post.title}
            </Typography>
          </Link>

          {/* Preview Content */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1.5,
              lineHeight: 1.6,
            }}
          >
            {post.content}
          </Typography>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
              {post.tags.slice(0, 4).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <CommentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {post.commentCount} 댓글
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ShareIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                공유
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <BookmarkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                저장
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};
