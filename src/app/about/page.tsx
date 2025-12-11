'use client';

import { Box, Container, Typography, Paper, useTheme, Button } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { HeroBanner } from '@/components/Layout/HeroBanner';
import { DiscoverSection } from '@/components/Layout/DiscoverSection';
import { motion, useInView } from 'framer-motion';
import {
  VerifiedUser as VerifiedUserIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Description as DescriptionIcon,
  Slideshow as SlideshowIcon,
  TableChart as TableChartIcon,
  Style as StyleIcon,
  ListAlt as ListAltIcon,
  Image as ImageIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Highlight component for bold text
const Highlight = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(transparent 50%, rgba(255, 193, 7, 0.3) 50%)'
            : 'linear-gradient(transparent 50%, rgba(255, 235, 59, 0.5) 50%)',
        padding: '2px 4px',
        fontWeight: 700,
        borderRadius: '2px',
      }}
    >
      {children}
    </Box>
  );
};

// New Diagram Components - Completely redesigned
const UserAIBox = ({ children, type = 'user' }: { children: React.ReactNode; type?: 'user' | 'ai' | 'skill' }) => {
  const theme = useTheme();

  const getStyles = () => {
    switch (type) {
      case 'user':
        return {
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #424242 0%, #303030 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          border: `2px solid ${theme.palette.text.primary}`,
        };
      case 'ai':
        return {
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e3a5f 0%, #0d1f3a 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          border: `2px solid ${theme.palette.primary.main}`,
        };
      case 'skill':
        return {
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)'
            : 'linear-gradient(135deg, #ce93d8 0%, #ba68c8 100%)',
          border: `2px solid ${theme.palette.primary.main}`,
          color: theme.palette.mode === 'dark' ? '#fff' : '#4a148c',
        };
    }
  };

  return (
    <Box
      sx={{
        ...getStyles(),
        borderRadius: '20px',
        padding: { xs: '16px 24px', md: '20px 32px' },
        minWidth: { xs: '100px', md: '140px' },
        textAlign: 'center',
        boxShadow: theme.shadows[3],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '60px', md: '80px' },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1rem', md: '1.2rem' },
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

const FlowArrow = ({ label }: { label?: string }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        flex: 1,
        maxWidth: { xs: '100%', md: '180px' },
        position: 'relative',
      }}
    >
      {label && (
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: '0.65rem', md: '0.7rem' },
            backgroundColor: theme.palette.background.paper,
            padding: '3px 6px',
            borderRadius: '6px',
            border: `1px solid ${theme.palette.divider}`,
            whiteSpace: 'nowrap',
            fontWeight: 600,
            position: 'absolute',
            top: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          width: '100%',
          height: '3px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          position: 'relative',
          mt: label ? 2 : 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            right: -8,
            top: -5,
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: `10px solid ${theme.palette.secondary.main}`,
          },
        }}
      />
    </Box>
  );
};

const BeforeDiagram = () => {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        py: 3,
      }}
    >
      {/* User Request */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.85rem', md: '0.95rem' },
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          💬 "{t('about.diagram.request')}"
        </Typography>
      </Box>

      {/* Flow */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 2, md: 2 },
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <UserAIBox type="user">{t('about.diagram.user')}</UserAIBox>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, maxWidth: 180 }}>
          <FlowArrow />
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <Box
            sx={{
              width: '3px',
              height: '40px',
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
        </Box>

        <UserAIBox type="ai">{t('about.diagram.ai')}</UserAIBox>
      </Box>

      {/* Results - Negative */}
      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: '12px',
          background: theme.palette.mode === 'dark'
            ? 'rgba(211, 47, 47, 0.1)'
            : 'rgba(244, 67, 54, 0.05)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.3)' : 'rgba(244, 67, 54, 0.2)'}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: theme.palette.error.main }}>
          ❌ 문제점
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            t('about.diagram.result.tracking'),
            t('about.diagram.result.different'),
            t('about.diagram.result.history'),
          ].map((text, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <CloseIcon sx={{ fontSize: 18, color: theme.palette.error.main, mt: 0.3 }} />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const AfterDiagram = () => {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        py: 3,
      }}
    >
      {/* User Request */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.85rem', md: '0.95rem' },
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          💬 "{t('about.diagram.request')}"
        </Typography>
      </Box>

      {/* Flow */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 2, md: 2 },
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <UserAIBox type="user">{t('about.diagram.user')}</UserAIBox>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, maxWidth: 140 }}>
          <FlowArrow />
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <Box
            sx={{
              width: '3px',
              height: '40px',
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
        </Box>

        <UserAIBox type="ai">{t('about.diagram.ai')}</UserAIBox>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, maxWidth: 180, position: 'relative' }}>
          <FlowArrow label={t('about.diagram.skillRef')} />
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%', py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              backgroundColor: theme.palette.background.paper,
              padding: '4px 8px',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              fontWeight: 600,
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            {t('about.diagram.skillRef')}
          </Typography>
          <Box
            sx={{
              width: '3px',
              height: '30px',
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
        </Box>

        <UserAIBox type="skill">{t('about.diagram.skill')}</UserAIBox>
      </Box>

      {/* Results - Positive */}
      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: '12px',
          background: theme.palette.mode === 'dark'
            ? 'rgba(46, 125, 50, 0.1)'
            : 'rgba(76, 175, 80, 0.05)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: theme.palette.success.main }}>
          ✅ 개선사항
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            t('about.diagram.result.simple'),
            t('about.diagram.result.unified'),
          ].map((text, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <CheckIcon sx={{ fontSize: 18, color: theme.palette.success.main, mt: 0.3 }} />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Section component with scroll animation
const AnimatedSection = ({ children, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function AboutPage() {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const router = useRouter();

  const hubFeatures = [
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
      title: t('about.hub.feature1.title'),
      description: t('about.hub.feature1.description'),
    },
    {
      icon: <CategoryIcon sx={{ fontSize: 48 }} />,
      title: t('about.hub.feature2.title'),
      description: t('about.hub.feature2.description'),
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      title: t('about.hub.feature3.title'),
      description: t('about.hub.feature3.description'),
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 48 }} />,
      title: t('about.hub.feature4.title'),
      description: t('about.hub.feature4.description'),
    },
  ];

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <HeroBanner
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
      />

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {/* What is Claude Skill */}
        <AnimatedSection>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 2,
              }}
            >
              {language === 'ko' ? (
                <>클로드 스킬은 클로드 AI의 능력을 <Highlight>특정 작업에 맞게 확장</Highlight>하는 <Highlight>전문 지식 패키지</Highlight>에요.</>
              ) : (
                <>Claude Skills are <Highlight>expert knowledge packages</Highlight> that extend Claude AI's capabilities for <Highlight>specific tasks</Highlight>.</>
              )}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
              }}
            >
              {language === 'ko' ? (
                <>마치 <Highlight>스마트폰에 앱을 설치</Highlight>하듯이, 클로드에 스킬을 추가하면 <Highlight>더욱 전문적이고 정확한 작업</Highlight>을 수행할 수 있게 돼요.</>
              ) : (
                <>Just like <Highlight>installing apps on your smartphone</Highlight>, adding skills to Claude enables <Highlight>more professional and accurate task execution</Highlight>.</>
              )}
            </Typography>
          </Box>
        </AnimatedSection>

        {/* Why Claude Skill */}
        <AnimatedSection delay={0.2}>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('about.why.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              {t('about.why.intro')}
            </Typography>

            {/* Example Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 4,
              }}
            >
              {[
                {
                  icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
                  title: language === 'ko' ? '워드 문서를 만들 때' : 'Creating Word documents',
                  text: language === 'ko'
                    ? '어떤 형식으로 만들어야 할까요? 글꼴은? 여백은? 말투는?'
                    : 'What format should be used? Which fonts? Margins? Tone?',
                  color: theme.palette.mode === 'dark' ? '#1976d2' : '#2196f3',
                },
                {
                  icon: <SlideshowIcon sx={{ fontSize: 40 }} />,
                  title: language === 'ko' ? '프레젠테이션을 제작할 때' : 'Making presentations',
                  text: language === 'ko'
                    ? '슬라이드 레이아웃은 어떻게 구성해야 할까요? 회사 로고는 어디에 넣나요?'
                    : 'How should slide layouts be structured? Where should the company logo go?',
                  color: theme.palette.mode === 'dark' ? '#7b1fa2' : '#9c27b0',
                },
                {
                  icon: <TableChartIcon sx={{ fontSize: 40 }} />,
                  title: language === 'ko' ? '스프레드시트(엑셀)를 다룰 때' : 'Working with spreadsheets',
                  text: language === 'ko'
                    ? '수식은 어떻게 처리하고, 데이터는 어떻게 정리해야 할까요?'
                    : 'How to handle formulas, and organize data?',
                  color: theme.palette.mode === 'dark' ? '#388e3c' : '#4caf50',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      border: `2px solid transparent`,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8],
                        borderColor: item.color,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: item.color,
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        color: item.color,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: { xs: '0.875rem', md: '0.9rem' },
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
              }}
            >
              {language === 'ko' ? (
                <>클로드 스킬은 전문가들의 <Highlight>노하우와 모범 사례</Highlight>를 담은 설명서에요. 클로드는 스킬을 읽고, 마치 <Highlight>그 분야의 전문가처럼 작업을 수행</Highlight>할 수 있어요.</>
              ) : (
                <>Claude Skills are manuals containing <Highlight>expert know-how and best practices</Highlight>. Claude reads the skill and <Highlight>performs tasks like an expert in that field</Highlight>.</>
              )}
            </Typography>
          </Box>
        </AnimatedSection>

        {/* Real Example */}
        <AnimatedSection delay={0.3}>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('about.example.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 2,
              }}
            >
              {language === 'ko' ? (
                <><Highlight>문서 작성 스킬</Highlight>을 예로 들어볼까요?</>
              ) : (
                <>Let's take a <Highlight>document writing skill</Highlight> as an example.</>
              )}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              {t('about.example.withoutSkill')}
            </Typography>

            {/* Feature Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                mb: 3,
              }}
            >
              {[
                {
                  icon: <StyleIcon sx={{ fontSize: 32 }} />,
                  text: t('about.example.feature1'),
                  color: theme.palette.mode === 'dark' ? '#e91e63' : '#f06292',
                },
                {
                  icon: <ListAltIcon sx={{ fontSize: 32 }} />,
                  text: t('about.example.feature2'),
                  color: theme.palette.mode === 'dark' ? '#9c27b0' : '#ba68c8',
                },
                {
                  icon: <ImageIcon sx={{ fontSize: 32 }} />,
                  text: t('about.example.feature3'),
                  color: theme.palette.mode === 'dark' ? '#2196f3' : '#64b5f6',
                },
                {
                  icon: <HistoryIcon sx={{ fontSize: 32 }} />,
                  text: t('about.example.feature4'),
                  color: theme.palette.mode === 'dark' ? '#00bcd4' : '#4dd0e1',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: '12px',
                      border: `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        borderColor: item.color,
                        transform: 'translateX(8px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              {language === 'ko' ? (
                <>이 모든 것을 <Highlight>높은 품질과 정확성</Highlight>으로 처리할 수 있습니다.</>
              ) : (
                <>All of this can be handled with <Highlight>high quality and accuracy</Highlight>.</>
              )}
            </Typography>

            {/* Before Diagram */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 3,
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #2d1f1f 0%, #1a1212 100%)'
                    : 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
                borderRadius: '16px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                {t('about.example.before')}
              </Typography>
              <BeforeDiagram />
            </Paper>

            {/* After Diagram */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a2d1f 0%, #0d1a12 100%)'
                    : 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                borderRadius: '16px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                {t('about.example.after')}
              </Typography>
              <AfterDiagram />
            </Paper>
          </Box>
        </AnimatedSection>

        {/* Anyone Can Create */}
        <AnimatedSection delay={0.4}>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('about.create.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
              }}
            >
              {language === 'ko' ? (
                <>클로드 스킬은 <Highlight>어떻게 일을 해야 하는지에 대한 설명서</Highlight>에요.</>
              ) : (
                <>Claude Skills are <Highlight>manuals on how to do the work</Highlight>.</>
              )}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              {language === 'ko' ? (
                <>클로드 스킬의 가장 큰 장점은 <Highlight>누구나 만들 수 있다</Highlight>는 점입니다. 특정 분야의 전문가라면, <Highlight>자신의 지식을 스킬로 만들어 다른 사람들과 공유</Highlight>할 수 있습니다. 디자이너, 마케터, 교사, 연구자 등 각자의 전문성을 담은 스킬을 만들 수 있어요.</>
              ) : (
                <>The greatest advantage of Claude Skills is that <Highlight>anyone can create them</Highlight>. If you're an expert in a specific field, you can <Highlight>turn your knowledge into a skill and share it with others</Highlight>. Designers, marketers, teachers, researchers - everyone can create skills with their expertise.</>
              )}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/guide')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('features.howToUse.title')}
              </Button>
            </Box>
          </Box>
        </AnimatedSection>

        {/* Divider */}
        <Box
          sx={{
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.divider} 50%, transparent 100%)`,
            mb: 8,
          }}
        />

        {/* Hub Title */}
        <AnimatedSection delay={0.5}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {t('about.hub.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 4,
                color: theme.palette.text.secondary,
              }}
            >
              {language === 'ko' ? (
                <>클로드 스킬이 많아지면 <Highlight>어떤 스킬이 좋은지, 신뢰할 수 있는지</Highlight> 알기 어려워져요. 검증되지 않은 스킬을 사용하면 원하는 결과를 얻지 못하거나, 오히려 작업이 더 복잡해질 수 있어요.</>
              ) : (
                <>As Claude Skills multiply, it becomes difficult to know <Highlight>which skills are good and trustworthy</Highlight>. Using unverified skills may not give you the results you want, or may even make your work more complicated.</>
              )}
            </Typography>
          </Box>
        </AnimatedSection>

        {/* Hub Solution */}
        <AnimatedSection delay={0.6}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                textAlign: 'center',
              }}
            >
              {t('about.hub.solution')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                textAlign: 'center',
                color: theme.palette.text.secondary,
              }}
            >
              {language === 'ko' ? (
                <>클로드 허브는 커뮤니티가 함께 만드는 <Highlight>검증된 스킬 라이브러리</Highlight>에요.</>
              ) : (
                <>Claude Hub is a <Highlight>verified skill library built together by the community</Highlight>.</>
              )}
            </Typography>
          </Box>
        </AnimatedSection>

        {/* Hub Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              gap: 3,
              mb: 8,
            }}
          >
            {hubFeatures.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {feature.icon}
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* For Everyone CTA */}
        <AnimatedSection delay={0.7}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: '16px',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('about.forEveryone.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 3,
                opacity: 0.95,
              }}
            >
              {language === 'ko' ? (
                <>클로드 허브는 개발자뿐만 아니라, <Box component="span" sx={{ background: 'rgba(255, 255, 255, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>일반 사용자를 위한 공간</Box>이에요. 복잡한 기술 지식 없이도 필요한 스킬을 찾고, <Box component="span" sx={{ background: 'rgba(255, 255, 255, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>클로드의 능력을 최대한 활용</Box>할 수 있도록 도와드릴게요.</>
              ) : (
                <>Claude Hub is a space not only for developers but also for <Box component="span" sx={{ background: 'rgba(255, 255, 255, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>general users</Box>. We help you find the skills you need and <Box component="span" sx={{ background: 'rgba(255, 255, 255, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>make the most of Claude's capabilities</Box> without complex technical knowledge.</>
              )}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              {t('about.forEveryone.cta')}
            </Typography>
          </Paper>
        </AnimatedSection>
      </Container>

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
