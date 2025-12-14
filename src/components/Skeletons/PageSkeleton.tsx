'use client';

import React from 'react';
import { Box, Container, Skeleton, Paper } from '@mui/material';
import { SkillCardSkeleton } from './SkillCardSkeleton';

// Hero section skeleton
export const HeroSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: { xs: '45vh', md: '50vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="rounded" width={120} height={28} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="60%" height={56} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto', mb: 4 }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Skeleton variant="rounded" width={140} height={48} />
            <Skeleton variant="rounded" width={140} height={48} />
            <Skeleton variant="rounded" width={140} height={48} sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Skills grid skeleton
export const SkillsGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkillCardSkeleton key={index} />
      ))}
    </Box>
  );
};

// Page header skeleton
export const PageHeaderSkeleton: React.FC = () => {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Skeleton variant="text" width="40%" height={48} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="60%" height={28} sx={{ mx: 'auto' }} />
    </Box>
  );
};

// Search bar skeleton
export const SearchBarSkeleton: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="rounded" height={56} sx={{ borderRadius: 3 }} />
    </Box>
  );
};

// Filter controls skeleton
export const FilterControlsSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Skeleton variant="text" width={60} height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Box>
      </Box>
      <Box>
        <Skeleton variant="text" width={40} height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={40} height={36} />
          <Skeleton variant="rounded" width={40} height={36} />
        </Box>
      </Box>
    </Box>
  );
};

// Category chips skeleton
export const CategoryChipsSkeleton: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
        ))}
      </Box>
    </Box>
  );
};

// Board/list skeleton
export const BoardListSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: index < count - 1 ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: '50%' }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={24} />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Skeleton variant="rounded" width={50} height={20} />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="text" width={40} height={20} />
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

// News page skeleton
export const NewsPageSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <PageHeaderSkeleton />
      <SearchBarSkeleton />
      <FilterControlsSkeleton />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <BoardListSkeleton count={10} />
        </Box>
        <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="text" width={100} height={28} sx={{ mb: 2 }} />
            {Array.from({ length: 5 }).map((_, index) => (
              <Box key={index} sx={{ py: 1.5, borderBottom: index < 4 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="60%" height={16} sx={{ mt: 0.5 }} />
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

// Explore page skeleton (skills with filters)
export const ExplorePageSkeleton: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeaderSkeleton />
      <SearchBarSkeleton />
      <FilterControlsSkeleton />
      <CategoryChipsSkeleton />
      <SkillsGridSkeleton count={8} />
    </Container>
  );
};

// Hub page skeleton (with hero)
export const HubPageSkeleton: React.FC = () => {
  return (
    <>
      <HeroSkeleton />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Feature boxes */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 6,
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
            </Paper>
          ))}
        </Box>
        <SearchBarSkeleton />
        <SkillsGridSkeleton count={6} />
      </Container>
    </>
  );
};

// Board page skeleton
export const BoardPageSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <PageHeaderSkeleton />
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" width={80} height={36} />
        ))}
      </Box>
      <BoardListSkeleton count={15} />
    </Container>
  );
};

// Generic page loading skeleton
export const GenericPageSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <PageHeaderSkeleton />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="100%" height={16} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

// Home page skeleton
export const HomePageSkeleton: React.FC = () => {
  return (
    <>
      {/* Hero Banner Skeleton */}
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Skeleton variant="text" width="40%" height={48} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="60%" height={28} sx={{ mx: 'auto', mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap' }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Box key={index} sx={{ textAlign: 'center', px: 2 }}>
                  <Skeleton variant="text" width={80} height={40} sx={{ mx: 'auto' }} />
                  <Skeleton variant="text" width={50} height={20} sx={{ mx: 'auto' }} />
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Skeleton */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tab Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={80} height={28} />
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Content Area */}
        <BoardListSkeleton count={5} />
      </Container>
    </>
  );
};
