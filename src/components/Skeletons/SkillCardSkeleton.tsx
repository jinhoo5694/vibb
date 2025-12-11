'use client';

import React from 'react';
import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

export const SkillCardSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="60%" height={32} />
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width={80} height={24} />
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={60} />
      </CardActions>
    </Card>
  );
};
