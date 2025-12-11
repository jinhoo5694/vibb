'use client';

import { Box, Container, Typography, useTheme, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Forum as ForumIcon,
  MenuBook as GuideIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { FeatureBoxes } from '@/components/Dashboard/FeatureBoxes';
import { SearchBar } from '@/components/Dashboard/SearchBar';
import { CategorySections } from '@/components/Dashboard/CategorySection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SkillsHome() {
  const theme = useTheme();
  const { language } = useLanguage();

  return (
    <>
      <Header />

      {/* Claude Skills Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '45vh', md: '50vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d1f1a 100%)'
              : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Background orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 107, 53, 0.1)'
                : 'rgba(255, 107, 53, 0.15)'
            } 0%, transparent 70%)`,
            top: '10%',
            right: '10%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 200, 87, 0.1)'
                : 'rgba(255, 200, 87, 0.15)'
            } 0%, transparent 70%)`,
            bottom: '20%',
            left: '10%',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                🎯
              </Typography>
              <Chip
                label="Claude AI Skills"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Claude Skills
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: 700,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {language === 'ko'
                  ? 'Claude AI의 능력을 확장하는 전문 스킬 패키지. 검증된 스킬을 발견하고 활용하세요.'
                  : 'Expert skill packages that extend Claude AI capabilities. Discover and use verified skills.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/skills/explore"
                  variant="contained"
                  size="large"
                  startIcon={<ExploreIcon />}
                  sx={{
                    bgcolor: '#ff6b35',
                    '&:hover': { bgcolor: '#e55a2b' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '스킬 탐색' : 'Explore Skills'}
                </Button>
                <Button
                  component={Link}
                  href="/skills/board"
                  variant="outlined"
                  size="large"
                  startIcon={<ForumIcon />}
                  sx={{
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': { borderColor: '#e55a2b', bgcolor: 'rgba(255, 107, 53, 0.05)' },
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
                  component={Link}
                  href="/skills/guide"
                  variant="outlined"
                  size="large"
                  startIcon={<GuideIcon />}
                  sx={{
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': { borderColor: '#e55a2b', bgcolor: 'rgba(255, 107, 53, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '가이드' : 'Guide'}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Feature Boxes Section - What is Claude Skills, How to use, Why use */}
      <FeatureBoxes />

      {/* Search Bar Section */}
      <SearchBar />

      {/* Category Sections with Skills */}
      <CategorySections />

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
