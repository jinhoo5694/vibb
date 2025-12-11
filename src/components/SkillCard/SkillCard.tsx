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
  Favorite as LikeIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkillWithCategory, getLocalizedValue, parseTags } from '@/types/database';

interface SkillCardProps {
  skill: SkillWithCategory;
  linkPrefix?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, linkPrefix = '' }) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get localized values
  const title = getLocalizedValue(skill.title_ko, skill.title_en, language as 'ko' | 'en');
  const description = getLocalizedValue(skill.sub_title_ko, skill.sub_title_en, language as 'ko' | 'en');
  const categoryName = skill.category
    ? getLocalizedValue(skill.category.category_name_ko, skill.category.category_name_en, language as 'ko' | 'en')
    : '';

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Dev: '#3b82f6',
      Creative: '#8b5cf6',
      Design: '#ec4899',
      Productivity: '#10b981',
      Communication: '#f59e0b',
      Office: '#6366f1',
      '개발': '#3b82f6',
      '창작': '#8b5cf6',
      '디자인': '#ec4899',
      '생산성': '#10b981',
      '커뮤니케이션': '#f59e0b',
      '오피스': '#6366f1',
    };
    return colors[category] || theme.palette.primary.main;
  };

  return (
    <Link href={`${linkPrefix}/skill/${skill.id}`} style={{ textDecoration: 'none' }}>
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
                bgcolor: theme.palette.primary.main,
                mr: 2,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
              }}
            >
              {skill.icon || title.charAt(0)}
            </Avatar>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="h3"
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categoryName && (
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  bgcolor: getCategoryColor(categoryName) + '20',
                  color: getCategoryColor(categoryName),
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LikeIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
            <Typography variant="caption" color="text.secondary">
              {(skill.likes_count || 0).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ViewIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
            <Typography variant="caption" color="text.secondary">
              {(skill.views_count || 0).toLocaleString()}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </Link>
  );
};
