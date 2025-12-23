import { Box, Container, Skeleton, Grid, Paper } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function PluginDetailLoading() {
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          pt: { xs: 10, sm: 12 },
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Back button skeleton */}
          <Skeleton variant="text" width={120} height={40} sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Header card skeleton */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Skeleton variant="circular" width={64} height={64} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={24} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="100%" height={24} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={24} />
              </Paper>

              {/* Content sections skeleton */}
              {[1, 2].map((i) => (
                <Paper key={i} elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="100%" height={24} />
                  <Skeleton variant="text" width="90%" height={24} />
                  <Skeleton variant="text" width="70%" height={24} />
                </Paper>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <Skeleton variant="rounded" width="50%" height={40} />
                  <Skeleton variant="rounded" width="50%" height={40} />
                </Box>
                <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={40} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
