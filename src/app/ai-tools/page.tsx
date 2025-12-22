'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Grid, Paper, Button, Chip } from '@mui/material';
import {
  Code as CodeIcon,
  Terminal as TerminalIcon,
  Language as WebIcon,
  Speed as SpeedIcon,
  Compare as CompareIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { categoryInfo, getToolsByCategory, ToolCategory } from '@/data/ai-tools';

const categoryIcons = {
  editor: <CodeIcon sx={{ fontSize: 24 }} />,
  cli: <TerminalIcon sx={{ fontSize: 24 }} />,
  web: <WebIcon sx={{ fontSize: 24 }} />,
};

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    titleKo: '생산성 향상',
    titleEn: 'Productivity Boost',
    descriptionKo: '다양한 AI 코딩 툴을 활용하여 개발 및 작업 속도를 높이세요',
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
    descriptionKo: 'AI 코딩 툴들을 더 효과적으로 활용하는 방법을 배워보세요',
    descriptionEn: 'Learn how to use AI tools more effectively',
  },
];

const categories: ToolCategory[] = ['editor', 'cli', 'web'];

export default function AIToolsPage() {
  const theme = useTheme();
  const { language } = useLanguage();

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
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f2922 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 6,
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
                  fontSize: { xs: '3.5rem', md: '5rem' },
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
                AI {language === 'ko' ? '코딩 도구' : 'Coding Tools'}
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
                  ? '바이브 코딩의 시작, AI 코딩 도구로 빠르고 쉽게 시작해보세요.'
                  : 'Explore AI coding tools that boost productivity and check detailed information about each tool.'}
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index} sx={{ display: 'flex' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ width: '100%', display: 'flex' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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

      {/* 3-Column Category Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {categories.map((category, categoryIndex) => {
            const info = categoryInfo[category];
            const tools = getToolsByCategory(category);

            return (
              <Grid size={{ xs: 12, md: 4 }} key={category}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 3,
                      pb: 2,
                      borderBottom: `2px solid ${info.color}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: `${info.color}20`,
                        color: info.color,
                      }}
                    >
                      {categoryIcons[category]}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.3,
                        }}
                      >
                        {language === 'ko' ? info.labelKo : info.labelEn}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {language === 'ko' ? info.descriptionKo : info.descriptionEn}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tool Cards */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tools.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.05 }}
                      >
                        <Link href={`/ai-tools/${tool.id}`} style={{ textDecoration: 'none' }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8],
                                borderColor: tool.brandColor,
                                '& .tool-name': {
                                  color: tool.brandColor,
                                },
                              },
                            }}
                          >
                            <Box
                              component="img"
                              src={tool.logo}
                              alt={tool.name}
                              sx={{
                                width: 48,
                                height: 48,
                                objectFit: 'contain',
                                borderRadius: 1.5,
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                className="tool-name"
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  transition: 'color 0.2s ease',
                                  lineHeight: 1.3,
                                }}
                              >
                                {tool.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  lineHeight: 1.4,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {language === 'ko' ? tool.tagline.ko : tool.tagline.en}
                              </Typography>
                            </Box>
                          </Paper>
                        </Link>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
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
              {language === 'ko' ? 'AI 코딩 툴 커뮤니티에 참여하세요' : 'Join the AI Coding Tools Community'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? 'AI 코딩 툴 사용 경험을 공유하고, 다른 개발자들의 노하우를 배워보세요'
                : 'Share your AI tool experiences and learn from other developers'}
            </Typography>
            <Button
              component={Link}
              href="/board"
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
