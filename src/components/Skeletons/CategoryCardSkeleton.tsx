'use client';

import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};
