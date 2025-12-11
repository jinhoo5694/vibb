'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  GridView as GridIcon,
  ViewList as ListIcon,
  Star as StarIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SkillCard } from '@/components/SkillCard/SkillCard';
import { SkillCardSkeleton } from '@/components/Skeletons';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSkills, getCategories } from '@/services/supabase';
import { SkillWithCategory, Category, getLocalizedValue } from '@/types/database';

type SortOption = 'likes' | 'views' | 'name';
type ViewMode = 'grid' | 'list';

export default function SkillsExplorePage() {
  const { t, language } = useLanguage();
  const [skills, setSkills] = useState<SkillWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [skillsData, categoriesData] = await Promise.all([
          getSkills(),
          getCategories(),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1s loading
        ]);
        setSkills(skillsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const title = getLocalizedValue(skill.title_ko, skill.title_en, language as 'ko' | 'en');
    const description = getLocalizedValue(skill.sub_title_ko, skill.sub_title_en, language as 'ko' | 'en');
    const tags = skill.tags || '';

    const matchesSearch =
      searchQuery === '' ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || skill.categories === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    const titleA = getLocalizedValue(a.title_ko, a.title_en, language as 'ko' | 'en');
    const titleB = getLocalizedValue(b.title_ko, b.title_en, language as 'ko' | 'en');

    switch (sortBy) {
      case 'name':
        return titleA.localeCompare(titleB);
      case 'views':
        return (b.views_count || 0) - (a.views_count || 0);
      case 'likes':
      default:
        return (b.likes_count || 0) - (a.likes_count || 0);
    }
  });

  // Get featured skills (top 4 by likes)
  const featuredSkills = sortedSkills
    .filter((skill) => skill.likes_count > 0)
    .slice(0, 4);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              {t('explore.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t('explore.subtitle')}
            </Typography>
          </Box>

          {/* Skills Grid Skeleton */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <SkillCardSkeleton key={index} />
            ))}
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {t('explore.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t('explore.subtitle')}
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('explore.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          {/* Sort Options */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('skills.sortBy')}
            </Typography>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(e, newSort) => newSort && setSortBy(newSort)}
              size="small"
            >
              <ToggleButton value="likes">{t('skills.mostPopular')}</ToggleButton>
              <ToggleButton value="views">{t('skills.mostViewed')}</ToggleButton>
              <ToggleButton value="name">{t('skills.name')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* View Mode */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('skills.view')}
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newView) => newView && setViewMode(newView)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {t('explore.filterByCategory')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip
              label={t('explore.all')}
              onClick={() => setSelectedCategory(null)}
              color={selectedCategory === null ? 'primary' : 'default'}
              sx={{
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s',
              }}
            />
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={getLocalizedValue(category.category_name_ko, category.category_name_en, language as 'ko' | 'en')}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? 'primary' : 'default'}
                sx={{
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Featured Skills Section */}
        {featuredSkills.length > 0 && !searchQuery && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <StarIcon sx={{ color: '#f59e0b' }} />
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                {t('skills.featuredSkills')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: viewMode === 'grid' ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
                  md: viewMode === 'grid' ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)',
                  lg: viewMode === 'grid' ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)',
                },
                gap: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {featuredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} linkPrefix="/skills" />
              ))}
            </Box>
          </Box>
        )}

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            {t('skills.allSkills')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('explore.showing')} {sortedSkills.length} {sortedSkills.length !== 1 ? t('explore.skills') : t('explore.skill')}
            {selectedCategory && categories.find(c => c.id === selectedCategory) &&
              ` ${t('explore.in')} ${getLocalizedValue(
                categories.find(c => c.id === selectedCategory)!.category_name_ko,
                categories.find(c => c.id === selectedCategory)!.category_name_en,
                language as 'ko' | 'en'
              )}`
            }
            {searchQuery && ` ${t('explore.matching')} "${searchQuery}"`}
          </Typography>
        </Box>

        {/* Skills Grid/List */}
        {sortedSkills.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: viewMode === 'grid' ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
                md: viewMode === 'grid' ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)',
                lg: viewMode === 'grid' ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)',
              },
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {sortedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} linkPrefix="/skills" />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              {t('explore.noResults')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('explore.tryAdjusting')}
            </Typography>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
}
