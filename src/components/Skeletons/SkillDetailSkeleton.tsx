'use client';

import React from 'react';
import { Box, Container, Skeleton, Paper } from '@mui/material';

export const SkillDetailSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Title Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Skeleton variant="rounded" width={100} height={100} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" height={48} />
        </Box>
      </Box>

      {/* Info Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={100} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={120} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
          </Box>
        </Box>
      </Paper>

      {/* Description */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="rounded" width={100} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
        </Box>
      </Box>

      {/* Content Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" sx={{ mb: 4 }} />

        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="85%" />
      </Paper>

      {/* Like Button */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 1 }} />
          <Skeleton variant="text" width={60} sx={{ mx: 'auto' }} />
        </Box>
      </Paper>
    </Container>
  );
};
