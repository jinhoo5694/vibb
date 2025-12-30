'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Grid,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Forum as ForumIcon,
  MenuBook as GuideIcon,
  Explore as ExploreIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Create as CreateIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  ContentCopy as CopyIcon,
  NewReleases as NewIcon,
  TrendingUp as TrendingIcon,
  Whatshot as HotIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPrompts, Prompt } from '@/services/supabase';

const features = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    titleKo: '프롬프트 엔지니어링',
    titleEn: 'Prompt Engineering',
    descriptionKo: 'AI와 효과적으로 소통하기 위한 프롬프트 작성 기법을 배워보세요',
    descriptionEn: 'Learn prompt writing techniques for effective communication with AI',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
    titleKo: '템플릿 라이브러리',
    titleEn: 'Template Library',
    descriptionKo: '검증된 프롬프트 템플릿을 활용하여 더 나은 결과를 얻으세요',
    descriptionEn: 'Use proven prompt templates to get better results',
  },
  {
    icon: <CreateIcon sx={{ fontSize: 40 }} />,
    titleKo: '커스텀 프롬프트',
    titleEn: 'Custom Prompts',
    descriptionKo: '나만의 프롬프트를 만들고 커뮤니티와 공유하세요',
    descriptionEn: 'Create your own prompts and share with the community',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PromptHubPage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [tabValue, setTabValue] = useState(0);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'new' | 'popular' | 'top'>('new');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch prompts when switching to Explore tab or changing sort/search
  useEffect(() => {
    if (tabValue === 1) {
      fetchPrompts();
    }
  }, [tabValue, sortBy]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const fetchedPrompts = await getPrompts({
        limit: 50,
        sortBy,
        searchQuery: searchQuery.trim() || undefined,
      });
      setPrompts(fetchedPrompts);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (tabValue === 1) {
      fetchPrompts();
    }
  };

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background:
            isDark
              ? 'linear-gradient(135deg, #2d1f0f 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4rem' },
                  mb: 2,
                }}
              >
                💬
              </Typography>
              <Chip
                label="Prompt Engineering"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {language === 'ko' ? '프롬프트 허브' : 'Prompt Hub'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {language === 'ko'
                  ? 'AI와의 대화를 더 효과적으로. 검증된 프롬프트 템플릿을 공유하고 발견하세요.'
                  : 'Make conversations with AI more effective. Share and discover proven prompt templates.'}
              </Typography>

              {user && (
                <Button
                  component={Link}
                  href="/prompt/new"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: '#f59e0b',
                    '&:hover': { bgcolor: '#d97706' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '프롬프트 등록하기' : 'Submit a Prompt'}
                </Button>
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Tabs Section */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              color: '#f59e0b',
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#f59e0b',
            },
          }}
        >
          <Tab
            icon={<GuideIcon />}
            iconPosition="start"
            label={language === 'ko' ? '시작하기' : 'Get Started'}
          />
          <Tab
            icon={<ExploreIcon />}
            iconPosition="start"
            label={language === 'ko' ? '탐색하기' : 'Explore'}
          />
        </Tabs>

        {/* Get Started Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Features Section */}
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 3,
                      bgcolor: isDark ? '#2d1f0f' : '#fffbeb',
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        borderColor: '#f59e0b',
                      },
                    }}
                  >
                    <Box sx={{ color: '#f59e0b', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {language === 'ko' ? feature.titleKo : feature.titleEn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {language === 'ko' ? feature.descriptionKo : feature.descriptionEn}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* CTA Section */}
          <Box
            sx={{
              mt: 6,
              py: 4,
              px: 4,
              borderRadius: 3,
              background: isDark
                ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)'
                : 'linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? '커뮤니티에서 더 많은 프롬프트를 탐색하세요' : 'Explore more prompts from the community'}
            </Typography>
            <Button
              onClick={() => setTabValue(1)}
              variant="contained"
              size="large"
              startIcon={<ExploreIcon />}
              sx={{
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' },
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {language === 'ko' ? '프롬프트 탐색하기' : 'Explore Prompts'}
            </Button>
          </Box>
        </TabPanel>

        {/* Explore Tab */}
        <TabPanel value={tabValue} index={1}>
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder={language === 'ko' ? '프롬프트 검색...' : 'Search prompts...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(_, newSort) => newSort && setSortBy(newSort)}
              size="small"
            >
              <ToggleButton value="new">
                <NewIcon sx={{ mr: 0.5, fontSize: 18 }} />
                {language === 'ko' ? '최신' : 'New'}
              </ToggleButton>
              <ToggleButton value="popular">
                <TrendingIcon sx={{ mr: 0.5, fontSize: 18 }} />
                {language === 'ko' ? '인기' : 'Popular'}
              </ToggleButton>
              <ToggleButton value="top">
                <HotIcon sx={{ mr: 0.5, fontSize: 18 }} />
                {language === 'ko' ? '추천' : 'Top'}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Prompt Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
                  <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : prompts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <ExploreIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {language === 'ko' ? '등록된 프롬프트가 없습니다.' : 'No prompts found.'}
              </Typography>
              {user && (
                <Button
                  component={Link}
                  href="/prompt/new"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { borderColor: '#d97706', bgcolor: 'rgba(245, 158, 11, 0.05)' },
                  }}
                >
                  {language === 'ko' ? '첫 번째 프롬프트 등록하기' : 'Submit the first prompt'}
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {prompts.map((prompt) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prompt.id}>
                  <Card
                    component={Link}
                    href={`/prompt/${prompt.id}`}
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': {
                        borderColor: '#f59e0b',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                        {prompt.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {prompt.description || prompt.promptText.substring(0, 100)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {prompt.tags?.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                              color: '#f59e0b',
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {prompt.upvotes}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ViewIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {prompt.viewCount}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
                          {prompt.author.name}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopyPrompt(prompt);
                        }}
                        sx={{
                          ml: 'auto',
                          color: copiedId === prompt.id ? 'success.main' : 'text.secondary',
                        }}
                      >
                        <CopyIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
