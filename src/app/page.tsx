'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { PostFeed } from '@/components/Feed';
import { Box, Container, Typography, useTheme, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const communityStats = [
  { label: '빌더', value: '2,847', icon: '👥' },
  { label: '게시글', value: '12,543', icon: '📝' },
  { label: '스킬', value: '156', icon: '🎯' },
  { label: 'MCP 서버', value: '89', icon: '🔌' },
];

const quickLinks = [
  { label: '시작하기 가이드', href: '/guide', icon: '📖' },
  { label: '인기 스킬', href: '/skills', icon: '⭐' },
  { label: 'MCP 서버 목록', href: '/mcp', icon: '🔌' },
  { label: '프롬프트 템플릿', href: '/prompt', icon: '💬' },
];

export default function Home() {
  const theme = useTheme();

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <Box
        sx={{
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
          py: { xs: 4, md: 6 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
                  mb: 1,
                }}
              >
                VIB Builders
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 400,
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
                  mb: 3,
                }}
              >
                바이브 코딩 커뮤니티 — AI와 함께 성장하는 빌더들의 공간
              </Typography>

              {/* Community Stats */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 4 },
                  flexWrap: 'wrap',
                }}
              >
                {communityStats.map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      textAlign: 'center',
                      px: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        fontWeight: 700,
                        color: '#fff',
                      }}
                    >
                      {stat.icon} {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f6f7f8',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Left Sidebar - Quick Links (Hidden on mobile) */}
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                  position: 'sticky',
                  top: 80,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1,
                  }}
                >
                  빠른 링크
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {quickLinks.map((link) => (
                    <Box
                      key={link.label}
                      component={Link}
                      href={link.href}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 1.5,
                        textDecoration: 'none',
                        color: 'text.primary',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: '1.2rem' }}>{link.icon}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {link.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Community Rules */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1,
                  }}
                >
                  커뮤니티 규칙
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    '서로를 존중해주세요',
                    '스팸 및 광고 금지',
                    '관련 없는 게시물 금지',
                    '건설적인 피드백 권장',
                  ].map((rule, index) => (
                    <Box
                      key={rule}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: '#fff',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          mt: 0.2,
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rule}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Main Feed */}
            <Grid size={{ xs: 12, md: 9 }}>
              <PostFeed />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
