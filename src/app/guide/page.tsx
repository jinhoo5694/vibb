'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, useTheme, ToggleButtonGroup, ToggleButton, Alert, Button, Link, Card, CardActionArea, CardContent } from '@mui/material';
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { HeroBanner } from '@/components/Layout/HeroBanner';
import { PageNavigation } from '@/components/Layout/PageNavigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSkills } from '@/services/supabase';
import { SkillWithCategory } from '@/types/database';
import NextLink from 'next/link';

type GuideType = 'claudeAI' | 'claudeCode' | 'claudeAPI' | 'claudeAgenticSDK';

export default function GuidePage() {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const [selectedGuide, setSelectedGuide] = useState<GuideType>('claudeAI');
  const [featuredSkills, setFeaturedSkills] = useState<SkillWithCategory[]>([]);

  useEffect(() => {
    async function fetchFeaturedSkills() {
      try {
        const skills = await getSkills();
        const featured = skills
          .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
          .slice(0, 6);
        setFeaturedSkills(featured);
      } catch (error) {
        console.error('Error fetching featured skills:', error);
      }
    }
    fetchFeaturedSkills();
  }, []);

  const handleGuideChange = (_event: React.MouseEvent<HTMLElement>, newGuide: GuideType | null) => {
    if (newGuide !== null) {
      setSelectedGuide(newGuide);
    }
  };

  const guideOptions: { value: GuideType; labelKey: string; subtitleKey: string; descriptionKey: string }[] = [
    { value: 'claudeAI', labelKey: 'guide.toggle.claudeAI', subtitleKey: 'guide.toggle.claudeAI.subtitle', descriptionKey: 'guide.toggle.claudeAI.description' },
    { value: 'claudeCode', labelKey: 'guide.toggle.claudeCode', subtitleKey: 'guide.toggle.claudeCode.subtitle', descriptionKey: 'guide.toggle.claudeCode.description' },
    { value: 'claudeAPI', labelKey: 'guide.toggle.claudeAPI', subtitleKey: 'guide.toggle.claudeAPI.subtitle', descriptionKey: 'guide.toggle.claudeAPI.description' },
    { value: 'claudeAgenticSDK', labelKey: 'guide.toggle.claudeAgenticSDK', subtitleKey: 'guide.toggle.claudeAgenticSDK.subtitle', descriptionKey: 'guide.toggle.claudeAgenticSDK.description' },
  ];

  const selectedOption = guideOptions.find(opt => opt.value === selectedGuide);

  // Last edit dates for each guide type
  const lastEditDates: Record<GuideType, string> = {
    claudeAI: '2024.11.23',
    claudeCode: '2024.11.23',
    claudeAPI: '2024.11.23',
    claudeAgenticSDK: '2024.11.23',
  };

  // Handle request fix - scroll to inquiry FAB
  const handleRequestFix = () => {
    // Find and click the inquiry FAB
    const inquiryFab = document.querySelector('[aria-label="inquiry"]') as HTMLButtonElement;
    if (inquiryFab) {
      inquiryFab.click();
    }
  };


  return (
    <>
      <Header />

      {/* Hero Banner */}
      <HeroBanner
        title={t('guide.hero.title')}
        subtitle={t('guide.hero.subtitle')}
      />

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Introduction */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('guide.intro.title')}
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
              {t('guide.intro.subtitle')}
            </Typography>
          </Box>

          {/* Guide Type Toggle */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 3,
                },
              }}
            >
              <ToggleButtonGroup
                value={selectedGuide}
                exclusive
                onChange={handleGuideChange}
                aria-label="guide type"
                sx={{
                  flexWrap: 'nowrap',
                  '& .MuiToggleButton-root': {
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: 1.5,
                    borderColor: theme.palette.divider,
                    minWidth: { xs: 'auto', sm: 'auto' },
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff8a5c 0%, #ffd477 100%)',
                      },
                    },
                  },
                }}
              >
                {guideOptions.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          lineHeight: 1.2,
                        }}
                      >
                        {t(option.labelKey)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: '0.65rem', md: '0.75rem' },
                          opacity: 0.8,
                          display: 'block',
                        }}
                      >
                        {t(option.subtitleKey)}
                      </Typography>
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {/* Selected Option Description */}
            {selectedOption && (
              <motion.div
                key={selectedGuide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 0.5,
                    }}
                  >
                    {t(selectedOption.subtitleKey)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {t(selectedOption.descriptionKey)}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>

          {/* Guide Content based on selection */}
          {selectedGuide === 'claudeAI' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ mb: 8 }}>
                {/* Title */}
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                  }}
                >
                  {t('guide.content.claudeAI.title')}
                </Typography>

                {/* Last Edit Date and Request Fix Button */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('guide.content.lastEdit')}: {lastEditDates.claudeAI}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={handleRequestFix}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: 'rgba(255, 107, 53, 0.08)',
                      },
                    }}
                  >
                    {t('guide.content.requestFix')}
                  </Button>
                </Box>

                {/* Alert */}
                <Alert
                  severity="warning"
                  sx={{
                    mb: 4,
                    '& .MuiAlert-message': {
                      fontWeight: 500,
                    },
                  }}
                >
                  {language === 'en' && t('guide.content.claudeAI.alert.before')}
                  <Link
                    href="https://claude.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'inherit',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      '&:hover': {
                        textDecoration: 'none',
                      },
                    }}
                  >
                    claude.ai
                  </Link>
                  {t('guide.content.claudeAI.alert.after')}
                </Alert>

                {/* Select Skills Section */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {t('guide.content.claudeAI.selectSkills')}
                </Typography>

                {/* Select Skills content */}
                <Box sx={{ mb: 4 }}>
                  {/* Find Skill h4 */}
                  <Typography
                    variant="h6"
                    component="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                    }}
                  >
                    {t('guide.content.claudeAI.findSkill')}
                  </Typography>

                  {/* Featured Skills List */}
                  {featuredSkills.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': {
                          height: 6,
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: theme.palette.action.hover,
                          borderRadius: 3,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 3,
                        },
                      }}
                    >
                      {featuredSkills.map((skill) => (
                        <Card
                          key={skill.id}
                          sx={{
                            minWidth: 200,
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme.shadows[4],
                            },
                          }}
                        >
                          <CardActionArea
                            component={NextLink}
                            href={`/skill/${skill.id}`}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  mb: 0.5,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {language === 'ko' ? skill.title_ko : (skill.title_en || skill.title_ko)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {language === 'ko' ? skill.sub_title_ko : (skill.sub_title_en || skill.sub_title_ko)}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {/* Find Skill content */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      {t('guide.content.claudeAI.findSkillDesc1')}
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        sx={{
                          pointerEvents: 'none',
                          textTransform: 'none',
                        }}
                      >
                        {t('skillDetail.download')}
                      </Button>
                      {t('guide.content.claudeAI.findSkillDesc2')}
                    </Typography>
                  </Box>

                  {/* Add Skill h4 */}
                  <Typography
                    variant="h6"
                    component="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                    }}
                  >
                    {t('guide.content.claudeAI.addSkill')}
                  </Typography>

                  {/* Add Skill content */}
                  <Box
                    component="ol"
                    sx={{
                      pl: 3,
                      m: 0,
                      listStyleType: 'decimal',
                      '& li': {
                        display: 'list-item',
                      },
                    }}
                  >
                    {/* Step 1 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Link
                        href="https://claude.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        claude.ai
                      </Link>
                      {language === 'ko' ? '에 접속해 주세요.' : ' - Go to the website.'}
                    </Typography>

                    {/* Step 2 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep2')}
                    </Typography>

                    {/* Screenshot for Step 2 */}
                    <Box
                      sx={{
                        ml: -3,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src="/screenshots/guide/1.png"
                        alt="Select profile"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          height: 'auto',
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    </Box>

                    {/* Step 3 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep3')}
                    </Typography>

                    {/* Screenshot for Step 3 */}
                    <Box
                      sx={{
                        ml: -3,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src="/screenshots/guide/2.png"
                        alt="Select settings"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          height: 'auto',
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    </Box>

                    {/* Step 4 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep4')}
                    </Typography>

                    {/* Screenshot for Step 4 */}
                    <Box
                      sx={{
                        ml: -3,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src="/screenshots/guide/3.png"
                        alt="Select features tab"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          height: 'auto',
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    </Box>

                    {/* Step 5 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep5')}
                    </Typography>

                    {/* Step 6 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep6')}
                    </Typography>

                    {/* Screenshot for Step 6 */}
                    <Box
                      sx={{
                        ml: -3,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src="/screenshots/guide/4.png"
                        alt="Upload skill button"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          height: 'auto',
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    </Box>

                    {/* Step 7 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep7')}
                    </Typography>

                    {/* Screenshot for Step 7 */}
                    <Box
                      sx={{
                        ml: -3,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src="/screenshots/guide/5.png"
                        alt="Add downloaded skill"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          height: 'auto',
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    </Box>

                    {/* Step 8 */}
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {t('guide.content.claudeAI.addSkillStep8')}
                    </Typography>

                    {/* Alert for Step 8 */}
                    <Box
                      sx={{
                        ml: -3,
                        mb: 2,
                      }}
                    >
                      <Alert
                        severity="info"
                        sx={{
                          '& .MuiAlert-message': {
                            fontWeight: 500,
                          },
                        }}
                      >
                        {t('guide.content.claudeAI.addSkillAlert')}
                      </Alert>
                    </Box>
                  </Box>
                </Box>

                {/* FAQ Section */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {t('guide.content.claudeAI.faq')}
                </Typography>

                {/* FAQ content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* FAQ 1 */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      border: `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}40)`,
                          color: theme.palette.primary.main,
                          flexShrink: 0,
                        }}
                      >
                        <HelpOutlineIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {t('guide.content.claudeAI.faq1Q')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        color: theme.palette.text.secondary,
                        pl: 7,
                      }}
                    >
                      {t('guide.content.claudeAI.faq1A')}
                    </Typography>
                  </Paper>

                  {/* FAQ 2 */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      border: `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}40)`,
                          color: theme.palette.primary.main,
                          flexShrink: 0,
                        }}
                      >
                        <HelpOutlineIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {t('guide.content.claudeAI.faq2Q')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        color: theme.palette.text.secondary,
                        pl: 7,
                      }}
                    >
                      {t('guide.content.claudeAI.faq2A')}
                    </Typography>
                  </Paper>

                  {/* FAQ 3 */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      border: `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}40)`,
                          color: theme.palette.primary.main,
                          flexShrink: 0,
                        }}
                      >
                        <HelpOutlineIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {t('guide.content.claudeAI.faq3Q')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        color: theme.palette.text.secondary,
                        pl: 7,
                      }}
                    >
                      {t('guide.content.claudeAI.faq3A')}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Claude Code Content */}
          {selectedGuide === 'claudeCode' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ mb: 8, textAlign: 'center', py: 8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  TBD
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Claude API Content */}
          {selectedGuide === 'claudeAPI' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ mb: 8, textAlign: 'center', py: 8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  TBD
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Claude Agentic SDK Content */}
          {selectedGuide === 'claudeAgenticSDK' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ mb: 8, textAlign: 'center', py: 8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  TBD
                </Typography>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Page Navigation */}
      <PageNavigation
        prevPage={{
          href: '/about',
          label: t('features.whatIs.title'),
        }}
        nextPage={{
          href: '/benefits',
          label: t('features.whyUse.title'),
        }}
      />

      {/* Footer */}
      <Footer />

      {/* FABs */}
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
