'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { SkillCard } from '@/components/SkillCard/SkillCard';
import { SkillCardSkeleton } from '@/components/Skeletons';
import { getSkills } from '@/services/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkillWithCategory } from '@/types/database';

export const DiscoverSection: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [featuredSkills, setFeaturedSkills] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [skills] = await Promise.all([
          getSkills(),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1s loading
        ]);
        // Get top 3 skills by likes
        const featured = skills
          .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
          .slice(0, 3);
        setFeaturedSkills(featured);
      } catch (error) {
        console.error('Error fetching featured skills:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      {/* Discover Message - Thin Horizontal */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 3, md: 4 },
          mb: { xs: 4, md: 6 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 184, 77, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(255, 107, 157, 0.05) 0%, rgba(255, 184, 77, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                fontWeight: 600,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('discover.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: theme.palette.text.secondary,
                mt: 1,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              {t('discover.subtitle')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Three Skill Cards */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SkillCardSkeleton key={index} />
            ))
          ) : (
            featuredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
};
