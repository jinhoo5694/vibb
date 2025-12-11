'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Grid, Paper, Button, Chip } from '@mui/material';
import {
  Forum as ForumIcon,
  MenuBook as GuideIcon,
  Explore as ExploreIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function PromptPage() {
  const theme = useTheme();
  const { language } = useLanguage();

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          background:
            theme.palette.mode === 'dark'
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
                  fontSize: { xs: '4rem', md: '5rem' },
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
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {language === 'ko' ? '프롬프트' : 'Prompts'}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {language === 'ko'
                  ? 'AI와의 대화를 더 효과적으로. 검증된 프롬프트 템플릿과 작성 노하우를 공유하세요.'
                  : 'Make conversations with AI more effective. Share proven prompt templates and writing know-how.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/prompt/board"
                  variant="contained"
                  size="large"
                  startIcon={<ForumIcon />}
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
                  {language === 'ko' ? '커뮤니티' : 'Community'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<GuideIcon />}
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { borderColor: '#d97706', bgcolor: 'rgba(245, 158, 11, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '가이드' : 'Guide'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { borderColor: '#d97706', bgcolor: 'rgba(245, 158, 11, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '템플릿 탐색' : 'Explore Templates'}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
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
                    bgcolor: theme.palette.mode === 'dark' ? '#2d1f0f' : '#fffbeb',
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
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? '프롬프트 커뮤니티에 참여하세요' : 'Join the Prompt Community'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? '효과적인 프롬프트 작성법을 공유하고, 다른 사용자들의 노하우를 배워보세요'
                : 'Share effective prompt writing techniques and learn from other users'}
            </Typography>
            <Button
              component={Link}
              href="/prompt/board"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' },
                borderRadius: 2,
                px: 6,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {language === 'ko' ? '커뮤니티 바로가기' : 'Go to Community'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
