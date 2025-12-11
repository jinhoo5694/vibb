'use client';

import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { HeroBanner } from '@/components/Layout/HeroBanner';
import { DiscoverSection } from '@/components/Layout/DiscoverSection';
import { PageNavigation } from '@/components/Layout/PageNavigation';
import { motion } from 'framer-motion';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Groups as CommunityIcon,
  TrendingUp as GrowthIcon,
  Verified as QualityIcon,
  AutoAwesome as InnovationIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BenefitsPage() {
  const theme = useTheme();
  const { t } = useLanguage();

  const benefits = [
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: t('benefits.benefit1.title'),
      description: t('benefits.benefit1.description'),
      stat: t('benefits.benefit1.stat'),
      statLabel: t('benefits.benefit1.statLabel'),
    },
    {
      icon: <QualityIcon sx={{ fontSize: 48 }} />,
      title: t('benefits.benefit2.title'),
      description: t('benefits.benefit2.description'),
      stat: t('benefits.benefit2.stat'),
      statLabel: t('benefits.benefit2.statLabel'),
    },
    {
      icon: <CommunityIcon sx={{ fontSize: 48 }} />,
      title: t('benefits.benefit3.title'),
      description: t('benefits.benefit3.description'),
      stat: t('benefits.benefit3.stat'),
      statLabel: t('benefits.benefit3.statLabel'),
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: t('benefits.benefit4.title'),
      description: t('benefits.benefit4.description'),
      stat: t('benefits.benefit4.stat'),
      statLabel: t('benefits.benefit4.statLabel'),
    },
    {
      icon: <InnovationIcon sx={{ fontSize: 48 }} />,
      title: t('benefits.benefit5.title'),
      description: t('benefits.benefit5.description'),
      stat: t('benefits.benefit5.stat'),
      statLabel: t('benefits.benefit5.statLabel'),
    },
    {
      icon: <GrowthIcon sx={{ fontSize: 48 }} />,
      title: t('benefits.benefit6.title'),
      description: t('benefits.benefit6.description'),
      stat: t('benefits.benefit6.stat'),
      statLabel: t('benefits.benefit6.statLabel'),
    },
  ];

  const testimonials = [
    {
      quote: t('benefits.testimonial1.quote'),
      author: t('benefits.testimonial1.author'),
      role: t('benefits.testimonial1.role'),
    },
    {
      quote: t('benefits.testimonial2.quote'),
      author: t('benefits.testimonial2.author'),
      role: t('benefits.testimonial2.role'),
    },
    {
      quote: t('benefits.testimonial3.quote'),
      author: t('benefits.testimonial3.author'),
      role: t('benefits.testimonial3.role'),
    },
  ];

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <HeroBanner
        title={t('benefits.hero.title')}
        subtitle={t('benefits.hero.subtitle')}
      />

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Introduction */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('benefits.intro.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {t('benefits.intro.subtitle')}
            </Typography>
          </Box>

          {/* Benefits Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
              mb: 8,
            }}
          >
            {benefits.map((benefit, index) => (
              <Box key={benefit.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[12],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {benefit.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.7, flexGrow: 1 }}
                    >
                      {benefit.description}
                    </Typography>
                    <Box
                      sx={{
                        mt: 'auto',
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {benefit.stat}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {benefit.statLabel}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Box>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 6,
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                {t('benefits.testimonials.title')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 4,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <Box key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          height: '100%',
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                            : 'linear-gradient(135deg, #FFFBF5 0%, #FFF5F7 100%)',
                          border: `1px solid ${theme.palette.divider}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            mb: 3,
                            lineHeight: 1.8,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          "{testimonial.quote}"
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Page Navigation */}
      <PageNavigation
        prevPage={{
          href: '/guide',
          label: t('features.howToUse.title'),
        }}
      />

      {/* Discover Section */}
      <DiscoverSection />

      {/* Footer */}
      <Footer />

      {/* FABs */}
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
