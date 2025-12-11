'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { SkillCard } from '@/components/SkillCard/SkillCard';
import { SkillCardSkeleton } from '@/components/Skeletons';
import { getCategories, getSkillsByCategory } from '@/services/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, SkillWithCategory, getLocalizedValue } from '@/types/database';

export const CategorySections: React.FC = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, SkillWithCategory[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [categoriesData] = await Promise.all([
          getCategories(),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1s loading
        ]);
        setCategories(categoriesData);

        // Fetch skills for each category
        const skillsMap: Record<string, SkillWithCategory[]> = {};
        await Promise.all(
          categoriesData.map(async (category) => {
            const skills = await getSkillsByCategory(category.id);
            skillsMap[category.id] = skills.slice(0, 4); // Only show first 4
          })
        );
        setSkillsByCategory(skillsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Show 2 category sections with skeleton cards */}
        {Array.from({ length: 2 }).map((_, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: { xs: 6, md: 8 } }}>
            {/* Category Title Skeleton */}
            <Skeleton
              variant="text"
              width={200}
              height={48}
              sx={{ mb: 3 }}
            />

            {/* Skill Cards Grid Skeleton */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {Array.from({ length: 4 }).map((_, skillIndex) => (
                <SkillCardSkeleton key={skillIndex} />
              ))}
            </Box>
          </Box>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {categories.map((category, categoryIndex) => {
        const categorySkills = skillsByCategory[category.id] || [];
        const categoryName = getLocalizedValue(
          category.category_name_ko,
          category.category_name_en,
          language as 'ko' | 'en'
        );

        // Skip if no skills in this category
        if (categorySkills.length === 0) return null;

        return (
          <Box key={category.id} sx={{ mb: { xs: 6, md: 8 } }}>
            {/* Category Title */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {categoryName}
              </Typography>
            </motion.div>

            {/* Skill Cards Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {categorySkills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: skillIndex * 0.1 }}
                >
                  <SkillCard skill={skill} linkPrefix="/skills" />
                </motion.div>
              ))}
            </Box>
          </Box>
        );
      })}
    </Container>
  );
};
