'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
  alpha,
  Button,
} from '@mui/material';
import {
  MenuBook as GuideIcon,
  Construction as ConstructionIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getToolById } from '@/data/ai-tools';

export default function ToolGuidePage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const resolvedParams = use(params);
  const tool = getToolById(resolvedParams.toolId);
  const theme = useTheme();
  const { language } = useLanguage();

  if (!tool) {
    notFound();
  }

  const effectiveColor = tool.brandColor === '#000000' ? theme.palette.text.primary : tool.brandColor;

  const heroBackground =
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha(tool.brandColor, 0.2)} 0%, #1a1a1a 100%)`
      : `linear-gradient(135deg, ${alpha(tool.brandColor, 0.08)} 0%, #ffffff 100%)`;

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: heroBackground,
          py: { xs: 6, md: 8 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              component={Link}
              href={`/ai-tools/${resolvedParams.toolId}`}
              startIcon={<ArrowBackIcon />}
              sx={{
                mb: 3,
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: alpha(effectiveColor, 0.05),
                },
              }}
            >
              {tool.name} {language === 'ko' ? '페이지로 돌아가기' : 'Back to page'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(effectiveColor, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: effectiveColor,
                }}
              >
                <GuideIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                  }}
                >
                  {language === 'ko' ? '시작하기' : 'Getting Started'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {tool.name} {language === 'ko' ? '상세 가이드' : 'Detailed Guide'}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <ConstructionIcon sx={{ fontSize: 64, mb: 3, opacity: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {language === 'ko' ? '가이드 준비 중입니다' : 'Guide Coming Soon'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 400, opacity: 0.7 }}>
                {language === 'ko'
                  ? `${tool.name}의 상세한 시작 가이드를 준비하고 있습니다. 곧 만나보세요!`
                  : `We're preparing a detailed getting started guide for ${tool.name}. Stay tuned!`}
              </Typography>
              <Button
                component={Link}
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                sx={{
                  borderColor: effectiveColor,
                  color: effectiveColor,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: effectiveColor,
                    bgcolor: alpha(effectiveColor, 0.05),
                  },
                }}
              >
                {language === 'ko' ? '공식 문서 보기' : 'View Official Docs'}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
