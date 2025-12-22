import { Header } from '@/components/Layout/Header';
import { Box, Container, Skeleton, Paper } from '@mui/material';

export default function Loading() {
  return (
    <>
      <Header />

      {/* Breadcrumb Skeleton */}
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width={40} />
          <Skeleton variant="text" width={20} />
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={20} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Container>

      {/* Hero Section Skeleton */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 4 }}>
            <Skeleton variant="rounded" width={120} height={120} sx={{ borderRadius: 3 }} />
            <Box sx={{ flex: 1, width: '100%' }}>
              <Skeleton variant="rounded" width={120} height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 3 }} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="90%" height={24} sx={{ mb: 4 }} />
              <Skeleton variant="rounded" width={200} height={48} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content Sections Skeleton */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Paper
              key={i}
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width={200} height={32} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={280} sx={{ mt: 1 }} />
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </>
  );
}
