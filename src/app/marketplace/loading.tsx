import { Box, Container, Skeleton, Grid, Paper } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function MarketplaceLoading() {
  return (
    <>
      <Header />

      {/* Hero Section Skeleton */}
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="rounded" width={180} height={32} sx={{ mx: 'auto', mb: 2, borderRadius: 4 }} />
            <Skeleton variant="text" width={300} height={60} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={500} height={30} sx={{ mx: 'auto', mb: 4 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Skeleton variant="rounded" width={160} height={48} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" width={140} height={48} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" width={120} height={48} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section Skeleton */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Explore Section Skeleton */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width={300} height={24} sx={{ mx: 'auto' }} />
          </Box>

          {/* Search bar skeleton */}
          <Skeleton variant="rounded" height={56} sx={{ mb: 3, borderRadius: 2 }} />

          {/* Grid skeleton */}
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
