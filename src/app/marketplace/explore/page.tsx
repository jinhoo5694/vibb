'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  SortByAlpha as AlphaIcon,
  Extension as PluginIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { PageNavigation } from '@/components/Layout/PageNavigation';
import { PluginCard } from '@/components/PluginCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPlugins, searchPlugins } from '@/services/supabase';
import { PluginWithCategory } from '@/types/plugin';

type SortType = 'popular' | 'newest' | 'name';

// Plugin categories for filtering
const categories = [
  { id: 'all', labelKo: '전체', labelEn: 'All' },
  { id: 'Development', labelKo: '개발', labelEn: 'Development' },
  { id: 'LSP', labelKo: '언어 서버', labelEn: 'LSP' },
  { id: 'Automation', labelKo: '자동화', labelEn: 'Automation' },
  { id: 'Security', labelKo: '보안', labelEn: 'Security' },
  { id: 'Design', labelKo: '디자인', labelEn: 'Design' },
  { id: 'Utility', labelKo: '유틸리티', labelEn: 'Utility' },
];

export default function MarketplaceExplorePage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  // Plugin state
  const [plugins, setPlugins] = useState<PluginWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Theme colors
  const themeColor = '#9333ea';
  const themeGradient = 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)';

  // Fetch plugins on mount
  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlugins();
      setPlugins(data);
    } catch (err) {
      console.error('Error fetching plugins:', err);
      setError(language === 'ko' ? '플러그인을 불러오는데 실패했습니다.' : 'Failed to load plugins.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPlugins();
      return;
    }
    setLoading(true);
    try {
      const results = await searchPlugins(searchQuery);
      setPlugins(results);
    } catch (err) {
      console.error('Error searching plugins:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort plugins
  const displayedPlugins = useMemo(() => {
    let filtered = [...plugins];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return filtered;
  }, [plugins, sortBy, selectedCategory]);

  // Get featured plugins (top 4 by upvotes)
  const featuredPlugins = useMemo(() => {
    return [...plugins]
      .filter(p => (p.upvote_count || 0) > 0)
      .sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0))
      .slice(0, 4);
  }, [plugins]);

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 4, md: 6 },
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)'
            : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                textAlign: 'center',
                background: themeGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
              }}
            >
              {language === 'ko' ? '플러그인 탐색' : 'Explore Plugins'}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                textAlign: 'center',
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {language === 'ko'
                ? '다양한 플러그인을 검색하고 찾아보세요'
                : 'Search and discover various plugins'}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={language === 'ko' ? '플러그인 검색...' : 'Search plugins...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
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
              {language === 'ko' ? '정렬' : 'Sort by'}
            </Typography>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(_, value) => value && setSortBy(value)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  px: 2,
                  whiteSpace: 'nowrap',
                },
                '& .Mui-selected': {
                  bgcolor: `${themeColor}20 !important`,
                  color: `${themeColor} !important`,
                },
              }}
            >
              <ToggleButton value="popular">
                <HotIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {language === 'ko' ? '인기순' : 'Popular'}
              </ToggleButton>
              <ToggleButton value="newest">
                <NewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {language === 'ko' ? '최신순' : 'Newest'}
              </ToggleButton>
              <ToggleButton value="name">
                <AlphaIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {language === 'ko' ? '이름순' : 'Name'}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {language === 'ko' ? '카테고리별 필터' : 'Filter by Category'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={language === 'ko' ? category.labelKo : category.labelEn}
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  fontWeight: 500,
                  cursor: 'pointer',
                  bgcolor: selectedCategory === category.id ? `${themeColor}20` : undefined,
                  color: selectedCategory === category.id ? themeColor : undefined,
                  borderColor: selectedCategory === category.id ? themeColor : undefined,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    bgcolor: selectedCategory === category.id ? `${themeColor}30` : undefined,
                  },
                  transition: 'all 0.2s',
                }}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>

        {/* Featured Plugins Section */}
        {featuredPlugins.length > 0 && !searchQuery && selectedCategory === 'all' && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <StarIcon sx={{ color: themeColor }} />
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                {language === 'ko' ? '인기 플러그인' : 'Featured Plugins'}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {featuredPlugins.map((plugin) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={plugin.id}>
                  <PluginCard plugin={plugin} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            {language === 'ko' ? '모든 플러그인' : 'All Plugins'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? `${displayedPlugins.length}개의 플러그인`
              : `Showing ${displayedPlugins.length} plugins`}
            {selectedCategory !== 'all' && ` ${language === 'ko' ? '- ' : 'in '}${categories.find(c => c.id === selectedCategory)?.[language === 'ko' ? 'labelKo' : 'labelEn']}`}
            {searchQuery && ` ${language === 'ko' ? '검색: ' : 'matching '}"${searchQuery}"`}
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: themeColor }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Plugin Grid */}
        {!loading && !error && (
          <Grid container spacing={3}>
            {displayedPlugins.map((plugin) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={plugin.id}>
                <PluginCard plugin={plugin} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && !error && displayedPlugins.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PluginIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {language === 'ko' ? '플러그인이 없습니다' : 'No plugins found'}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {language === 'ko' ? '다른 검색어를 시도해보세요' : 'Try a different search term'}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Page Navigation */}
      <PageNavigation
        prevPage={{
          href: '/marketplace',
          label: language === 'ko' ? '마켓플레이스 홈' : 'Marketplace Home',
        }}
        nextPage={{
          href: '/marketplace/guide',
          label: language === 'ko' ? '설치 가이드' : 'Installation Guide',
        }}
      />

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
