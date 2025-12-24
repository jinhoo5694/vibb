'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MainCategory,
  SubCategoryTag,
  mainCategoryConfig,
  subCategoryColors,
} from '@/types/post';

interface TagSelectorProps {
  selectedTags: SubCategoryTag[];
  onTagsChange: (tags: SubCategoryTag[]) => void;
  showHeader?: boolean;
  headerText?: string;
  compact?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  showHeader = true,
  headerText,
  compact = false,
}) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  const [expandedCategories, setExpandedCategories] = useState<MainCategory[]>([]);

  // Toggle category expansion
  const toggleCategory = (category: MainCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Toggle tag selection
  const toggleTag = (tag: SubCategoryTag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  // Remove tag
  const removeTag = (tag: SubCategoryTag) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  // Get parent category of a tag
  const getTagCategory = (tag: SubCategoryTag): MainCategory | null => {
    for (const [category, config] of Object.entries(mainCategoryConfig)) {
      if (config.subCategories.includes(tag)) {
        return category as MainCategory;
      }
    }
    return null;
  };

  return (
    <Box
      sx={{
        p: compact ? 1 : 1.5,
        borderRadius: 1.5,
        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {showHeader && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TagIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.disabled">
            {headerText || (language === 'ko'
              ? '태그를 선택하면 더 많은 사람들이 글을 발견할 수 있어요'
              : 'Add tags to help others discover your post')}
          </Typography>
        </Box>
      )}

      {/* Category rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {(Object.keys(mainCategoryConfig) as MainCategory[]).map((category) => {
          const config = mainCategoryConfig[category];
          const isExpanded = expandedCategories.includes(category);
          const categoryTags = config.subCategories;
          const selectedInCategory = selectedTags.filter((t) =>
            categoryTags.includes(t)
          );

          return (
            <Box key={category}>
              <Box
                onClick={() => toggleCategory(category)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: compact ? 0.5 : 0.75,
                  px: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  },
                }}
              >
                <Typography sx={{ fontSize: compact ? '0.85rem' : '0.9rem', width: 20, textAlign: 'center' }}>
                  {config.icon}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.primary', flex: 1, fontSize: compact ? '0.8rem' : '0.875rem' }}
                >
                  {category}
                </Typography>
                {selectedInCategory.length > 0 && (
                  <Chip
                    label={selectedInCategory.length}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.7rem',
                      bgcolor: config.color,
                      color: '#fff',
                    }}
                  />
                )}
                {isExpanded ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                )}
              </Box>

              <Collapse in={isExpanded}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'wrap',
                    py: 0.75,
                    pl: 3.5,
                  }}
                >
                  {categoryTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    const tagColor = subCategoryColors[tag];

                    return (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => toggleTag(tag)}
                        sx={{
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: compact ? '0.7rem' : '0.75rem',
                          height: compact ? 22 : 24,
                          bgcolor: isSelected ? tagColor : 'transparent',
                          color: isSelected ? '#fff' : 'text.secondary',
                          borderColor: isSelected ? tagColor : theme.palette.divider,
                          '&:hover': {
                            bgcolor: isSelected ? tagColor : `${tagColor}20`,
                            borderColor: tagColor,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', mb: 0.75 }}
          >
            {language === 'ko' ? '선택된 태그' : 'Selected tags'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {selectedTags.map((tag) => {
              const tagColor = subCategoryColors[tag];
              const category = getTagCategory(tag);
              const categoryIcon = category ? mainCategoryConfig[category].icon : '';

              return (
                <Chip
                  key={tag}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontSize: '0.75rem' }}>{categoryIcon}</span>
                      <span>{tag}</span>
                    </Box>
                  }
                  size="small"
                  onDelete={() => removeTag(tag)}
                  deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontWeight: 600,
                    fontSize: compact ? '0.7rem' : '0.75rem',
                    height: compact ? 22 : 24,
                    bgcolor: tagColor,
                    color: '#fff',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: '#fff' },
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};
