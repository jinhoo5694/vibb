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
  Code as CodeIcon,
  Storage as StorageIcon,
  Hub as HubIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: <HubIcon sx={{ fontSize: 40 }} />,
    titleKo: 'MCP란?',
    titleEn: 'What is MCP?',
    descriptionKo: 'Model Context Protocol은 AI와 외부 도구/서비스를 연결하는 표준 프로토콜입니다',
    descriptionEn: 'Model Context Protocol is a standard protocol for connecting AI with external tools and services',
  },
  {
    icon: <StorageIcon sx={{ fontSize: 40 }} />,
    titleKo: '다양한 통합',
    titleEn: 'Various Integrations',
    descriptionKo: 'GitHub, Notion, Slack 등 다양한 서비스와 연동하여 AI의 능력을 확장하세요',
    descriptionEn: 'Extend AI capabilities by integrating with GitHub, Notion, Slack, and more',
  },
  {
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    titleKo: '쉬운 구축',
    titleEn: 'Easy Setup',
    descriptionKo: '단 몇 줄의 설정으로 MCP 서버를 구축하고 Claude와 연동할 수 있습니다',
    descriptionEn: 'Build and connect MCP servers to Claude with just a few lines of configuration',
  },
];

export default function MCPPage() {
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
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
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
                🔌
              </Typography>
              <Chip
                label="Model Context Protocol"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                MCP
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
                  ? 'AI와 외부 세계를 연결하는 강력한 도구. MCP 서버를 구축하고 경험을 공유하세요.'
                  : 'Powerful tools connecting AI with the external world. Build MCP servers and share your experiences.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/mcp/board"
                  variant="contained"
                  size="large"
                  startIcon={<ForumIcon />}
                  sx={{
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' },
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
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(59, 130, 246, 0.05)' },
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
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(59, 130, 246, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '서버 탐색' : 'Explore Servers'}
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
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8fafc',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <Box sx={{ color: '#3b82f6', mb: 2 }}>
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
            ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? 'MCP 커뮤니티에 참여하세요' : 'Join the MCP Community'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? 'MCP 서버 구축 경험을 공유하고, 다른 개발자들과 함께 성장하세요'
                : 'Share your MCP server building experiences and grow together with other developers'}
            </Typography>
            <Button
              component={Link}
              href="/mcp/board"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#3b82f6',
                '&:hover': { bgcolor: '#2563eb' },
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
