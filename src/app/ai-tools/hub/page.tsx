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
  Speed as SpeedIcon,
  Compare as CompareIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    titleKo: '생산성 향상',
    titleEn: 'Productivity Boost',
    descriptionKo: '다양한 AI 도구를 활용하여 개발 및 작업 속도를 높이세요',
    descriptionEn: 'Use various AI tools to speed up development and work',
  },
  {
    icon: <CompareIcon sx={{ fontSize: 40 }} />,
    titleKo: '도구 비교',
    titleEn: 'Tool Comparison',
    descriptionKo: 'Cursor, Claude Code, v0 등 다양한 AI 도구들을 비교하고 선택하세요',
    descriptionEn: 'Compare and choose from various AI tools like Cursor, Claude Code, v0',
  },
  {
    icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
    titleKo: '활용 팁',
    titleEn: 'Usage Tips',
    descriptionKo: 'AI 도구들을 더 효과적으로 활용하는 방법을 배워보세요',
    descriptionEn: 'Learn how to use AI tools more effectively',
  },
];

export default function AIToolsPage() {
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
              ? 'linear-gradient(135deg, #0f2922 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
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
                🛠️
              </Typography>
              <Chip
                label="AI Development Tools"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI {language === 'ko' ? '도구' : 'Tools'}
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
                  ? '생산성을 높여주는 AI 도구들. 경험과 팁을 공유하고 함께 성장하세요.'
                  : 'AI tools that boost productivity. Share experiences and tips, grow together.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/ai-tools/board"
                  variant="contained"
                  size="large"
                  startIcon={<ForumIcon />}
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
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
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.05)' },
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
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '도구 탐색' : 'Explore Tools'}
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
                    bgcolor: theme.palette.mode === 'dark' ? '#0f2922' : '#ecfdf5',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: '#10b981',
                    },
                  }}
                >
                  <Box sx={{ color: '#10b981', mb: 2 }}>
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
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)',
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
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? 'AI 도구 커뮤니티에 참여하세요' : 'Join the AI Tools Community'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? 'AI 도구 사용 경험을 공유하고, 다른 개발자들의 노하우를 배워보세요'
                : 'Share your AI tool experiences and learn from other developers'}
            </Typography>
            <Button
              component={Link}
              href="/ai-tools/board"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
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
