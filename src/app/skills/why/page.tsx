'use client';

import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { HeroBanner } from '@/components/Layout/HeroBanner';
import { PageNavigation } from '@/components/Layout/PageNavigation';
import { motion } from 'framer-motion';
import {
  Speed as SpeedIcon,
  Psychology as ExpertiseIcon,
  Tune as CustomizeIcon,
  Code as NoCodeIcon,
  Verified as VerifiedIcon,
  Repeat as ConsistencyIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WhyPage() {
  const theme = useTheme();
  const { language, t } = useLanguage();

  const benefits = [
    {
      icon: <ExpertiseIcon sx={{ fontSize: 48 }} />,
      title: language === 'ko' ? '즉각적인 전문성' : 'Instant Expertise',
      description: language === 'ko'
        ? '복잡한 분야를 직접 배우지 않아도 전문가 수준의 결과물을 얻을 수 있어요. 스킬이 이미 그 분야의 지식을 담고 있거든요.'
        : 'Get expert-level results without learning complex fields yourself. Skills already contain the domain knowledge you need.',
    },
    {
      icon: <ConsistencyIcon sx={{ fontSize: 48 }} />,
      title: language === 'ko' ? '일관된 품질' : 'Consistent Quality',
      description: language === 'ko'
        ? '매번 같은 높은 품질의 결과물을 기대할 수 있어요. 스킬은 검증된 방법론과 베스트 프랙티스를 따르니까요.'
        : 'Expect the same high-quality results every time. Skills follow proven methodologies and best practices.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: language === 'ko' ? '시간 절약' : 'Save Time',
      description: language === 'ko'
        ? '복잡한 작업도 빠르게 처리할 수 있어요. 프롬프트를 고민하고 수정하는 시간을 크게 줄여줍니다.'
        : 'Handle complex tasks quickly. Drastically reduce the time spent crafting and refining prompts.',
    },
    {
      icon: <CustomizeIcon sx={{ fontSize: 48 }} />,
      title: language === 'ko' ? '맞춤형 솔루션' : 'Tailored Solutions',
      description: language === 'ko'
        ? '특정 업무나 상황에 최적화된 스킬을 선택할 수 있어요. 범용 AI보다 더 정확한 결과를 얻을 수 있죠.'
        : 'Choose skills optimized for specific tasks or situations. Get more accurate results than generic AI responses.',
    },
    {
      icon: <NoCodeIcon sx={{ fontSize: 48 }} />,
      title: language === 'ko' ? '코딩 불필요' : 'No Coding Required',
      description: language === 'ko'
        ? '프로그래밍 지식 없이도 AI의 강력한 기능을 활용할 수 있어요. 스킬 파일만 업로드하면 끝이에요.'
        : 'Leverage powerful AI capabilities without programming knowledge. Just upload the skill file and you\'re ready.',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
      title: language === 'ko' ? '커뮤니티 검증' : 'Community Verified',
      description: language === 'ko'
        ? '다른 사용자들이 테스트하고 평가한 스킬을 안심하고 사용할 수 있어요. 리뷰와 평점을 확인해보세요.'
        : 'Use skills that have been tested and rated by other users with confidence. Check reviews and ratings.',
    },
  ];

  const useCases = [
    {
      title: language === 'ko' ? '문서 작성' : 'Document Writing',
      description: language === 'ko'
        ? '보고서, 제안서, 이메일 등 다양한 문서를 전문가처럼 작성할 수 있어요.'
        : 'Write reports, proposals, emails and more like a professional.',
    },
    {
      title: language === 'ko' ? '데이터 분석' : 'Data Analysis',
      description: language === 'ko'
        ? '복잡한 데이터를 이해하기 쉽게 정리하고 인사이트를 도출해요.'
        : 'Organize complex data clearly and derive meaningful insights.',
    },
    {
      title: language === 'ko' ? '콘텐츠 제작' : 'Content Creation',
      description: language === 'ko'
        ? '블로그, SNS, 마케팅 콘텐츠를 효과적으로 만들어요.'
        : 'Create effective blog posts, social media, and marketing content.',
    },
    {
      title: language === 'ko' ? '번역 및 교정' : 'Translation & Editing',
      description: language === 'ko'
        ? '자연스러운 번역과 문법 교정으로 글의 품질을 높여요.'
        : 'Improve writing quality with natural translation and grammar correction.',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <HeroBanner
        title={language === 'ko' ? '왜 클로드 스킬을 사용해야 할까요?' : 'Why Use Claude Skills?'}
        subtitle={language === 'ko'
          ? 'AI를 더 스마트하게 활용하는 방법'
          : 'A smarter way to leverage AI'}
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
              {language === 'ko' ? '클로드 스킬의 장점' : 'Benefits of Claude Skills'}
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
              {language === 'ko'
                ? '클로드 스킬을 사용하면 AI와의 대화가 더 효율적이고 생산적으로 바뀝니다. 전문가의 지식을 담은 스킬로 더 나은 결과를 얻어보세요.'
                : 'Using Claude Skills makes your AI conversations more efficient and productive. Get better results with skills that contain expert knowledge.'}
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
                      sx={{ lineHeight: 1.7, flexGrow: 1 }}
                    >
                      {benefit.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Box>

          {/* Use Cases Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  textAlign: 'center',
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                {language === 'ko' ? '이런 곳에 활용해보세요' : 'Use Cases'}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                          : 'linear-gradient(135deg, #FFFBF5 0%, #FFF5F7 100%)',
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        {useCase.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {useCase.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                color: '#fff',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                {language === 'ko' ? '지금 바로 시작해보세요' : 'Get Started Now'}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.8,
                  opacity: 0.95,
                }}
              >
                {language === 'ko'
                  ? '수백 개의 검증된 스킬이 여러분을 기다리고 있어요. 원하는 스킬을 찾아 클로드에 추가하면 바로 사용할 수 있습니다.'
                  : 'Hundreds of verified skills are waiting for you. Find the skill you need, add it to Claude, and start using it right away.'}
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {/* Page Navigation */}
      <PageNavigation
        prevPage={{
          href: '/skills/how',
          label: t('features.howToUse.title'),
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
