'use client';

import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 4, md: 6 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #FFFBF5 0%, #FFF5F7 100%)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: subtitle ? 2 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                textAlign: 'center',
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};
