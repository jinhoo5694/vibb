'use client';

import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Pagination,
} from '@mui/material';
import {
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { NewsItem, categoryColors, categoryIcons } from '@/types/news';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsNavigationListProps {
  newsList: NewsItem[];
  currentNewsId: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const NewsNavigationList: React.FC<NewsNavigationListProps> = ({
  newsList,
  currentNewsId,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const theme = useTheme();
  const { language } = useLanguage();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1.5,
          px: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#141414' : '#f8f9fa',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            width: 70,
            flexShrink: 0,
            color: 'text.secondary',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          {language === 'ko' ? '분류' : 'Cat.'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            flex: 1,
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {language === 'ko' ? '제목' : 'Title'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            width: 80,
            flexShrink: 0,
            color: 'text.secondary',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '0.75rem',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {language === 'ko' ? '출처' : 'Source'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            width: 60,
            flexShrink: 0,
            color: 'text.secondary',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          {language === 'ko' ? '날짜' : 'Date'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            width: 45,
            flexShrink: 0,
            color: 'text.secondary',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '0.75rem',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {language === 'ko' ? '조회' : 'View'}
        </Typography>
      </Box>

      {/* News List */}
      {newsList.map((news) => {
        const isCurrentNews = news.id === currentNewsId;
        const categoryColor = categoryColors[news.category];
        const categoryIcon = categoryIcons[news.category];
        const timeAgo = formatDistanceToNow(news.createdAt, { addSuffix: false, locale: ko });

        return (
          <Link
            key={news.id}
            href={`/news/${news.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                px: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                bgcolor: isCurrentNews
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(255, 107, 53, 0.15)'
                    : 'rgba(255, 107, 53, 0.08)'
                  : 'transparent',
                '&:hover': {
                  bgcolor: isCurrentNews
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 107, 53, 0.2)'
                      : 'rgba(255, 107, 53, 0.12)'
                    : theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(0,0,0,0.02)',
                },
                minHeight: 40,
              }}
            >
              {/* Category */}
              <Box sx={{ width: 70, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <Chip
                  label={`${categoryIcon} ${news.category}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: `${categoryColor}15`,
                    color: categoryColor,
                    '& .MuiChip-label': {
                      px: 0.75,
                    },
                  }}
                />
              </Box>

              {/* Title + Comment Count */}
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 0.5, pr: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrentNews ? 700 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isCurrentNews ? '#ff6b35' : 'text.primary',
                    fontSize: '0.85rem',
                    '&:hover': {
                      color: '#ff6b35',
                    },
                  }}
                >
                  {news.title}
                </Typography>
                {news.commentCount > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ff6b35',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      flexShrink: 0,
                    }}
                  >
                    [{news.commentCount}]
                  </Typography>
                )}
              </Box>

              {/* Source */}
              <Typography
                variant="caption"
                sx={{
                  width: 80,
                  flexShrink: 0,
                  color: 'text.secondary',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {news.source}
              </Typography>

              {/* Date */}
              <Typography
                variant="caption"
                sx={{
                  width: 60,
                  flexShrink: 0,
                  color: 'text.disabled',
                  textAlign: 'center',
                  fontSize: '0.7rem',
                }}
              >
                {timeAgo}
              </Typography>

              {/* View Count */}
              <Typography
                variant="caption"
                sx={{
                  width: 45,
                  flexShrink: 0,
                  color: 'text.disabled',
                  textAlign: 'center',
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {news.viewCount || 0}
              </Typography>
            </Box>
          </Link>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.mode === 'dark' ? '#141414' : '#f8f9fa',
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.8rem',
              },
              '& .Mui-selected': {
                bgcolor: '#ff6b35 !important',
                color: '#fff',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
