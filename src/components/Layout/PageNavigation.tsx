'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, useTheme } from '@mui/material';
import {
  ArrowBack as PrevIcon,
  ArrowForward as NextIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageNavigationProps {
  prevPage?: {
    href: string;
    label: string;
  };
  nextPage?: {
    href: string;
    label: string;
  };
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ prevPage, nextPage }) => {
  const theme = useTheme();
  const { t } = useLanguage();

  if (!prevPage && !nextPage) return null;

  return (
    <Box
      sx={{
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.02)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: prevPage && nextPage ? 'space-between' : prevPage ? 'flex-start' : 'flex-end',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
          }}
        >
          {prevPage && (
            <Button
              component={Link}
              href={prevPage.href}
              startIcon={<PrevIcon />}
              variant="outlined"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                order: { xs: 2, sm: 1 },
              }}
            >
              {prevPage.label}
            </Button>
          )}
          {nextPage && (
            <Button
              component={Link}
              href={nextPage.href}
              endIcon={<NextIcon />}
              variant="contained"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                order: { xs: 1, sm: 2 },
              }}
            >
              {nextPage.label}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
