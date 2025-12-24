'use client';

import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  useTheme,
  Chip,
  Button,
} from '@mui/material';
import {
  Extension as PluginIcon,
  Terminal as CommandIcon,
  Explore as ExploreIcon,
  GitHub as GitHubIcon,
  Forum as ForumIcon,
  MenuBook as GuideIcon,
  Hub as HubIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { useLanguage } from '@/contexts/LanguageContext';

// Feature cards data - accurate information about Claude Plugins
const features = [
  {
    icon: <PluginIcon sx={{ fontSize: 40 }} />,
    titleKo: 'Claude 플러그인이란?',
    titleEn: 'What are Claude Plugins?',
    descriptionKo: 'Claude Code의 확장 패키지입니다. 슬래시 명령어, 커스텀 에이전트, 스킬, 훅, MCP 서버 등을 포함하며, Git 저장소를 통해 배포됩니다.',
    descriptionEn: 'Extension packages for Claude Code. They contain slash commands, custom agents, skills, hooks, MCP servers, and are distributed via Git repositories.',
  },
  {
    icon: <HubIcon sx={{ fontSize: 40 }} />,
    titleKo: '마켓플레이스란?',
    titleEn: 'What is Marketplace?',
    descriptionKo: '플러그인을 탐색하고 설치할 수 있는 카탈로그입니다. marketplace.json 파일로 정의되며, 커뮤니티에서 플러그인을 공유할 수 있습니다.',
    descriptionEn: 'A catalog for discovering and installing plugins. Defined by marketplace.json files, enabling communities to share plugins.',
  },
  {
    icon: <CommandIcon sx={{ fontSize: 40 }} />,
    titleKo: '간편한 설치',
    titleEn: 'Easy Installation',
    descriptionKo: '/plugin marketplace add와 /plugin install 명령어로 간단하게 플러그인을 설치할 수 있습니다. npm처럼 버전 관리와 자동 업데이트를 지원합니다.',
    descriptionEn: 'Install plugins easily with /plugin marketplace add and /plugin install commands. Supports version management and auto-updates like npm.',
  },
];

// What plugins contain
const pluginComponents = [
  {
    icon: <CodeIcon sx={{ fontSize: 24 }} />,
    titleKo: '슬래시 명령어',
    titleEn: 'Slash Commands',
    descriptionKo: '사용자가 직접 호출하는 명령어 (/plugin-name:command)',
    descriptionEn: 'User-invoked commands (/plugin-name:command)',
  },
  {
    icon: <PluginIcon sx={{ fontSize: 24 }} />,
    titleKo: '에이전트 스킬',
    titleEn: 'Agent Skills',
    descriptionKo: 'Claude가 자동으로 인식하고 사용하는 기능',
    descriptionEn: 'Capabilities Claude automatically discovers and uses',
  },
  {
    icon: <HubIcon sx={{ fontSize: 24 }} />,
    titleKo: 'MCP 서버',
    titleEn: 'MCP Servers',
    descriptionKo: '외부 도구 및 서비스와의 통합',
    descriptionEn: 'Integration with external tools and services',
  },
  {
    icon: <GitHubIcon sx={{ fontSize: 24 }} />,
    titleKo: '훅 & 에이전트',
    titleEn: 'Hooks & Agents',
    descriptionKo: '이벤트 핸들러와 커스텀 에이전트',
    descriptionEn: 'Event handlers and custom agents',
  },
];

export default function MarketplacePage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  // Theme colors - using purple/violet for marketplace
  const themeColor = '#9333ea';
  const themeColorHover = '#7e22ce';
  const themeGradient = 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)';

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '45vh', md: '50vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)'
            : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Background orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              isDark ? 'rgba(147, 51, 234, 0.1)' : 'rgba(147, 51, 234, 0.15)'
            } 0%, transparent 70%)`,
            top: '10%',
            right: '10%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              isDark ? 'rgba(192, 132, 252, 0.1)' : 'rgba(192, 132, 252, 0.15)'
            } 0%, transparent 70%)`,
            bottom: '20%',
            left: '10%',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  mb: 2,
                }}
              >
                🧩
              </Typography>
              <Chip
                label={language === 'ko' ? 'Claude Code 플러그인' : 'Claude Code Plugins'}
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(147, 51, 234, 0.1)',
                  color: themeColor,
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: themeGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {language === 'ko' ? '플러그인 마켓플레이스' : 'Plugin Marketplace'}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: 700,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {language === 'ko'
                  ? 'Claude Code 플러그인을 탐색하고 설치하세요. 슬래시 명령어, 스킬, MCP 서버 등 다양한 확장 기능을 제공합니다.'
                  : 'Discover and install Claude Code plugins. Access slash commands, skills, MCP servers, and more extensions.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/marketplace/explore"
                  variant="contained"
                  size="large"
                  startIcon={<ExploreIcon />}
                  sx={{
                    bgcolor: themeColor,
                    '&:hover': { bgcolor: themeColorHover },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '플러그인 탐색' : 'Explore Plugins'}
                </Button>
                <Button
                  component={Link}
                  href="/board"
                  variant="outlined"
                  size="large"
                  startIcon={<ForumIcon />}
                  sx={{
                    borderColor: themeColor,
                    color: themeColor,
                    '&:hover': { borderColor: themeColorHover, bgcolor: 'rgba(147, 51, 234, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '커뮤니티' : 'Community'}
                </Button>
                <Button
                  component={Link}
                  href="/marketplace/guide"
                  variant="outlined"
                  size="large"
                  startIcon={<GuideIcon />}
                  sx={{
                    borderColor: themeColor,
                    color: themeColor,
                    '&:hover': { borderColor: themeColorHover, bgcolor: 'rgba(147, 51, 234, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '설치 가이드' : 'Install Guide'}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    bgcolor: isDark ? '#1a1a2e' : '#faf5ff',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: themeColor,
                    },
                  }}
                >
                  <Box sx={{ color: themeColor, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {language === 'ko' ? feature.titleKo : feature.titleEn}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {language === 'ko' ? feature.descriptionKo : feature.descriptionEn}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Plugin Components Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: isDark ? '#0a0a0a' : '#f8f9fa',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: themeGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? '플러그인에 포함된 것들' : 'What Plugins Contain'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {language === 'ko'
                ? '하나의 플러그인에 다양한 기능이 패키징되어 배포됩니다'
                : 'A single plugin packages multiple features for distribution'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {pluginComponents.map((component, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: isDark ? '#1a1a2e' : '#ffffff',
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: themeColor,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: `${themeColor}20`,
                        color: themeColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {component.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {language === 'ko' ? component.titleKo : component.titleEn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ko' ? component.descriptionKo : component.descriptionEn}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick Install Example */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: themeGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '빠른 설치' : 'Quick Install'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? 'Claude Code에서 두 개의 명령어로 플러그인을 설치하세요'
              : 'Install plugins with two commands in Claude Code'}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: isDark ? '#1a1a1a' : '#1e1e1e',
            border: `1px solid ${theme.palette.divider}`,
            fontFamily: 'monospace',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <Typography
            component="pre"
            sx={{
              color: '#e0e0e0',
              fontSize: '0.9rem',
              lineHeight: 2,
              m: 0,
              overflow: 'auto',
            }}
          >
            <Box component="span" sx={{ color: '#9cdcfe' }}># 1. {language === 'ko' ? '마켓플레이스 추가' : 'Add marketplace'}</Box>
            {'\n'}
            <Box component="span" sx={{ color: '#dcdcaa' }}>/plugin marketplace add</Box>
            <Box component="span" sx={{ color: '#ce9178' }}> owner/repo</Box>
            {'\n\n'}
            <Box component="span" sx={{ color: '#9cdcfe' }}># 2. {language === 'ko' ? '플러그인 설치' : 'Install plugin'}</Box>
            {'\n'}
            <Box component="span" sx={{ color: '#dcdcaa' }}>/plugin install</Box>
            <Box component="span" sx={{ color: '#ce9178' }}> plugin-name@marketplace</Box>
          </Typography>
        </Paper>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: isDark
            ? 'linear-gradient(90deg, rgba(147, 51, 234, 0.1) 0%, rgba(192, 132, 252, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(147, 51, 234, 0.05) 0%, rgba(192, 132, 252, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: themeGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? '지금 바로 시작하세요' : 'Get Started Now'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? '다양한 플러그인을 탐색하고 Claude Code의 능력을 확장하세요'
                : 'Explore plugins and extend Claude Code\'s capabilities'}
            </Typography>
            <Button
              component={Link}
              href="/marketplace/explore"
              variant="contained"
              size="large"
              sx={{
                bgcolor: themeColor,
                '&:hover': { bgcolor: themeColorHover },
                borderRadius: 2,
                px: 6,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {language === 'ko' ? '플러그인 탐색하기' : 'Explore Plugins'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
