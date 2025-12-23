'use client';

import { Box, Container, Skeleton, Grid, useTheme } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function MarketplaceExploreLoading() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      <Header />

      {/* Hero Banner skeleton */}
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search bar skeleton */}
        <Skeleton variant="rounded" height={56} sx={{ mb: 4, borderRadius: 3 }} />

        {/* Controls skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Skeleton variant="rounded" width={200} height={40} sx={{ borderRadius: 1 }} />
        </Box>

        {/* Category filter skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
            ))}
          </Box>
        </Box>

        {/* Results count skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={150} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>

        {/* Grid skeleton */}
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
