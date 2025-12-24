'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ThumbUp as UpvoteIcon,
  Visibility as ViewIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import { PluginWithCategory } from '@/types/plugin';

interface PluginCardProps {
  plugin: PluginWithCategory;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin }) => {
  const { language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get localized values
  const title = plugin.title;
  const description = language === 'en' && plugin.subtitle_en
    ? plugin.subtitle_en
    : plugin.subtitle || '';

  // Category translations
  const categoryTranslations: Record<string, string> = {
    'Development': '개발',
    'LSP': '언어 서버',
    'Automation': '자동화',
    'Security': '보안',
    'Design': '디자인',
    'Utility': '유틸리티',
    'Dev Tools': '개발도구',
    'Documentation': '문서화',
    'Testing': '테스트',
    'Productivity': '생산성',
    'Analytics': '분석',
  };

  const getLocalizedCategory = (category: string | null) => {
    if (!category) return '';
    if (language === 'ko' && categoryTranslations[category]) {
      return categoryTranslations[category];
    }
    return category;
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return theme.palette.primary.main;

    const colors: Record<string, string> = {
      '개발': '#3b82f6',
      '개발도구': '#3b82f6',
      'Development': '#3b82f6',
      'Dev Tools': '#3b82f6',
      '언어 서버': '#06b6d4',
      'LSP': '#06b6d4',
      '문서화': '#8b5cf6',
      'Documentation': '#8b5cf6',
      '테스트': '#ec4899',
      'Testing': '#ec4899',
      '생산성': '#10b981',
      'Productivity': '#10b981',
      '분석': '#f59e0b',
      'Analytics': '#f59e0b',
      '자동화': '#6366f1',
      'Automation': '#6366f1',
      '보안': '#ef4444',
      'Security': '#ef4444',
      '디자인': '#f472b6',
      'Design': '#f472b6',
      '유틸리티': '#a855f7',
      'Utility': '#a855f7',
    };
    return colors[category] || theme.palette.primary.main;
  };

  return (
    <Link href={`/marketplace/plugin/${plugin.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: getCategoryColor(plugin.category),
                mr: 2,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                fontSize: isMobile ? '1.25rem' : '1.5rem',
              }}
            >
              {plugin.icon || title.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                component="h3"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </Typography>
              {plugin.version && (
                <Typography variant="caption" color="text.disabled">
                  v{plugin.version}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {plugin.category && (
              <Chip
                label={getLocalizedCategory(plugin.category)}
                size="small"
                sx={{
                  bgcolor: getCategoryColor(plugin.category) + '20',
                  color: getCategoryColor(plugin.category),
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            )}
            {plugin.license_type && (
              <Chip
                label={plugin.license_type}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <UpvoteIcon fontSize="small" sx={{ color: '#9333ea', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                {(plugin.upvote_count || 0).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon fontSize="small" sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                {(plugin.comments_count || 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ViewIcon fontSize="small" sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />
            <Typography variant="caption" color="text.secondary">
              {(plugin.view_count || 0).toLocaleString()}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </Link>
  );
};
