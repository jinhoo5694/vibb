'use client';

import { Box, Container, Skeleton, Paper, useTheme } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function MarketplaceGuideLoading() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      <Header />

      {/* Hero skeleton */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 4, md: 6 },
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)'
            : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={500} height={30} sx={{ mx: 'auto' }} />
        </Container>
      </Box>

      {/* Prerequisites Alert skeleton */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        <Skeleton variant="rounded" height={80} sx={{ mb: 4, borderRadius: 1 }} />
      </Container>

      {/* Content skeleton */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />

        {[1, 2, 3, 4].map((i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 3,
              bgcolor: isDark ? '#1a1a2e' : '#faf5ff',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 3 }}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="rounded" height={50} sx={{ borderRadius: 2 }} />
          </Paper>
        ))}

        {/* Plugin Structure skeleton */}
        <Box sx={{ mb: 8 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width={400} height={24} sx={{ mb: 4 }} />
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
        </Box>

        {/* CTA skeleton */}
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={350} height={24} sx={{ mx: 'auto', mb: 4 }} />
          <Skeleton variant="rounded" width={200} height={48} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Box>
      </Container>

      <Footer />
    </>
  );
}
