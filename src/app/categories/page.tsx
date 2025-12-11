'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
} from '@mui/material';
import {
  Code as CodeIcon,
  Palette as PaletteIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  Chat as ChatIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SkillCard } from '@/components/SkillCard/SkillCard';
import { CategoryCardSkeleton, SkillCardSkeleton } from '@/components/Skeletons';
import { getCategories, getSkillsByCategory } from '@/services/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, SkillWithCategory, getLocalizedValue } from '@/types/database';

const categoryIcons: Record<string, React.ReactNode> = {
  Dev: <CodeIcon fontSize="large" />,
  Creative: <PaletteIcon fontSize="large" />,
  Design: <PaletteIcon fontSize="large" />,
  Office: <DescriptionIcon fontSize="large" />,
  Productivity: <TrendingUpIcon fontSize="large" />,
  Communication: <ChatIcon fontSize="large" />,
  Meta: <CategoryIcon fontSize="large" />,
  '개발': <CodeIcon fontSize="large" />,
  '창작': <PaletteIcon fontSize="large" />,
  '디자인': <PaletteIcon fontSize="large" />,
  '오피스': <DescriptionIcon fontSize="large" />,
  '생산성': <TrendingUpIcon fontSize="large" />,
  '커뮤니케이션': <ChatIcon fontSize="large" />,
};

const categoryColors: Record<string, string> = {
  Dev: '#3b82f6',
  Creative: '#8b5cf6',
  Design: '#ec4899',
  Office: '#6366f1',
  Productivity: '#10b981',
  Communication: '#f59e0b',
  Meta: '#06b6d4',
  '개발': '#3b82f6',
  '창작': '#8b5cf6',
  '디자인': '#ec4899',
  '오피스': '#6366f1',
  '생산성': '#10b981',
  '커뮤니케이션': '#f59e0b',
};

export default function CategoriesPage() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categorySkills, setCategorySkills] = useState<SkillWithCategory[]>([]);
  const [skillCounts, setSkillCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Fetch categories and skill counts
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [categoriesData] = await Promise.all([
          getCategories(),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1s loading
        ]);
        setCategories(categoriesData);

        // Fetch skill counts for each category
        const counts: Record<string, number> = {};
        await Promise.all(
          categoriesData.map(async (category) => {
            const skills = await getSkillsByCategory(category.id);
            counts[category.id] = skills.length;
          })
        );
        setSkillCounts(counts);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch skills when category is selected
  useEffect(() => {
    if (selectedCategory) {
      setLoadingSkills(true);
      getSkillsByCategory(selectedCategory.id)
        .then((skills) => {
          setCategorySkills(skills);
        })
        .catch((error) => {
          console.error('Error fetching category skills:', error);
        })
        .finally(() => {
          setLoadingSkills(false);
        });
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              {t('categories.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t('categories.subtitle').replace('{count}', '...')}
            </Typography>
          </Box>

          {/* Categories Grid Skeleton */}
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
            {Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {t('categories.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t('categories.subtitle').replace('{count}', categories.length.toString())}
          </Typography>
        </Box>

        {/* Categories Grid */}
        {!selectedCategory ? (
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
            {categories.map((category) => {
              const categoryName = getLocalizedValue(
                category.category_name_ko,
                category.category_name_en,
                language as 'ko' | 'en'
              );
              const skillCount = skillCounts[category.id] || 0;

              return (
                <Card
                  key={category.id}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardActionArea onClick={() => setSelectedCategory(category)}>
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            color: categoryColors[categoryName] || '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: `${categoryColors[categoryName] || '#6366f1'}20`,
                          }}
                        >
                          {categoryIcons[categoryName] || <CategoryIcon fontSize="large" />}
                        </Box>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{ fontWeight: 600, textAlign: 'center' }}
                        >
                          {categoryName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          {t('categories.skillCount').replace('{count}', skillCount.toString())}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Box>
        ) : (
          /* Selected Category View */
          <Box>
            {/* Back Button */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => setSelectedCategory(null)}
              >
                {t('categories.backToAll')}
              </Typography>
            </Box>

            {/* Category Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              {(() => {
                const categoryName = getLocalizedValue(
                  selectedCategory.category_name_ko,
                  selectedCategory.category_name_en,
                  language as 'ko' | 'en'
                );
                return (
                  <>
                    <Box
                      sx={{
                        color: categoryColors[categoryName] || '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: `${categoryColors[categoryName] || '#6366f1'}20`,
                      }}
                    >
                      {categoryIcons[categoryName] || <CategoryIcon fontSize="large" />}
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.75rem', sm: '2rem' },
                        }}
                      >
                        {categoryName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t('categories.inCategory').replace('{count}', categorySkills.length.toString())}
                      </Typography>
                    </Box>
                  </>
                );
              })()}
            </Box>

            {/* Skills Grid */}
            {loadingSkills ? (
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
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkillCardSkeleton key={index} />
                ))}
              </Box>
            ) : (
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
                {categorySkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
}
