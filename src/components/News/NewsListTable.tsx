'use client';

import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  OpenInNew as OpenInNewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import { NewsItem, NewsCategory } from '@/types/news';

interface NewsListTableProps {
  news: NewsItem[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
  categoryColors: Record<NewsCategory | 'all', string>;
}

// Single row component for a news item
const NewsRow: React.FC<{
  item: NewsItem;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  categoryColors: Record<NewsCategory | 'all', string>;
}> = ({ item, isBookmarked, onToggleBookmark, categoryColors }) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      // Today - show time
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      // Older - show date
      return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '.').replace('.', '');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on bookmark button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      onClick={handleClick}
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
      <Box sx={{ width: { xs: 50, sm: 70 }, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <Chip
          label={item.category.length > 3 ? item.category.slice(0, 3) : item.category}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 600,
            bgcolor: `${categoryColors[item.category]}15`,
            color: categoryColors[item.category],
            '& .MuiChip-label': {
              px: 0.75,
            },
          }}
        />
      </Box>

      {/* Title + Comment Count - Flex grow */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 0.5, pr: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.primary',
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            '&:hover': {
              color: '#ff6b35',
            },
          }}
        >
          {item.title}
        </Typography>
        {item.commentCount > 0 && (
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
            [{item.commentCount}]
          </Typography>
        )}
        <OpenInNewIcon sx={{ fontSize: 12, color: 'text.disabled', flexShrink: 0, ml: 0.5 }} />
      </Box>

      {/* Source */}
      <Typography
        variant="caption"
        sx={{
          width: { xs: 60, sm: 90 },
          flexShrink: 0,
          color: 'text.secondary',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '0.75rem',
        }}
      >
        {item.source}
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
        {formatDate(item.createdAt)}
      </Typography>

      {/* Likes - Hidden on mobile */}
      {!isMobile && (
        <Typography
          variant="caption"
          sx={{
            width: 50,
            flexShrink: 0,
            color: item.upvoteCount > 100 ? '#ff6b35' : item.upvoteCount > 30 ? 'text.secondary' : 'text.disabled',
            fontWeight: item.upvoteCount > 100 ? 700 : 500,
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          {item.upvoteCount > 0 ? item.upvoteCount : '-'}
        </Typography>
      )}

      {/* Bookmark */}
      <Box sx={{ width: 35, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          sx={{
            p: 0.5,
            color: isBookmarked ? '#ff6b35' : 'text.disabled',
          }}
        >
          {isBookmarked ? <BookmarkIcon sx={{ fontSize: 16 }} /> : <BookmarkBorderIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

// Table header component
const TableHeader: React.FC = () => {
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
        {language === 'ko' ? '분류' : 'Cat.'}
      </Typography>

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
        {language === 'ko' ? '출처' : 'Source'}
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
        {language === 'ko' ? '날짜' : 'Date'}
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
          {language === 'ko' ? '추천' : 'Likes'}
        </Typography>
      )}

      <Typography
        variant="caption"
        sx={{
          width: 35,
          flexShrink: 0,
          color: 'text.secondary',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {language === 'ko' ? '저장' : 'Save'}
      </Typography>
    </Box>
  );
};

export const NewsListTable: React.FC<NewsListTableProps> = ({
  news,
  bookmarkedIds,
  onToggleBookmark,
  categoryColors,
}) => {
  const theme = useTheme();
  const { language } = useLanguage();

  if (news.length === 0) {
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
          {language === 'ko' ? '뉴스가 없습니다' : 'No news found'}
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
      <TableHeader />
      {news.map((item) => (
        <NewsRow
          key={item.id}
          item={item}
          isBookmarked={bookmarkedIds.has(item.id)}
          onToggleBookmark={() => onToggleBookmark(item.id)}
          categoryColors={categoryColors}
        />
      ))}
    </Box>
  );
};
