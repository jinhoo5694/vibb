'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Container, useTheme, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';

export const FeatureBoxes: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      title: t('features.whatIs.title'),
      description: t('features.whatIs.description'),
      icon: <LightbulbIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
      href: '/about',
    },
    {
      title: t('features.howToUse.title'),
      description: t('features.howToUse.description'),
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #ffc857 0%, #6BCF7F 100%)',
      href: '/guide',
    },
    {
      title: t('features.whyUse.title'),
      description: t('features.whyUse.description'),
      icon: <RocketIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #6BCF7F 0%, #FF85A6 100%)',
      href: '/benefits',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 3, md: 4 },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Link href={feature.href} style={{ textDecoration: 'none' }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  aspectRatio: '3 / 2',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: { xs: 3, md: 4 },
                  position: 'relative',
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                    '& .icon-container': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  },
                }}
              >
              {/* Background gradient on hover */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: feature.gradient,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  '.MuiPaper-root:hover &': {
                    opacity: theme.palette.mode === 'dark' ? 0.1 : 0.05,
                  },
                }}
              />

              {/* Icon */}
              <Box
                className="icon-container"
                sx={{
                  mb: 3,
                  background: feature.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {feature.icon}
              </Box>

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: 'relative',
                  zIndex: 1,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                {feature.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  lineHeight: 1.7,
                  position: 'relative',
                  zIndex: 1,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                {feature.description}
              </Typography>
            </Paper>
            </Link>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
};
