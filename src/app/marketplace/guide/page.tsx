'use client';

import { Box, Container, Typography, Paper, useTheme, Button, Alert, IconButton, Snackbar } from '@mui/material';
import {
  Add as AddIcon,
  Download as InstallIcon,
  PlayArrow as UseIcon,
  Settings as ConfigIcon,
  GitHub as GitHubIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { PageNavigation } from '@/components/Layout/PageNavigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import NextLink from 'next/link';
import { useState } from 'react';

// Installation steps
const steps = [
  {
    icon: <AddIcon sx={{ fontSize: 32 }} />,
    titleKo: '1. 마켓플레이스 추가',
    titleEn: '1. Add Marketplace',
    descriptionKo: 'Claude Code에서 마켓플레이스를 추가합니다. GitHub 저장소 또는 Git URL을 사용할 수 있습니다.',
    descriptionEn: 'Add a marketplace to Claude Code. You can use a GitHub repository or Git URL.',
    command: '/plugin marketplace add owner/repo',
    commandAlt: '/plugin marketplace add https://github.com/owner/repo',
  },
  {
    icon: <InstallIcon sx={{ fontSize: 32 }} />,
    titleKo: '2. 플러그인 설치',
    titleEn: '2. Install Plugin',
    descriptionKo: '마켓플레이스에서 원하는 플러그인을 설치합니다. @marketplace 접미사로 출처를 지정할 수 있습니다.',
    descriptionEn: 'Install the desired plugin from the marketplace. Use @marketplace suffix to specify the source.',
    command: '/plugin install plugin-name@marketplace-name',
    commandAlt: '/plugin install plugin-name',
  },
  {
    icon: <UseIcon sx={{ fontSize: 32 }} />,
    titleKo: '3. 플러그인 사용',
    titleEn: '3. Use Plugin',
    descriptionKo: '설치된 플러그인의 슬래시 명령어를 사용합니다. 플러그인 이름이 네임스페이스로 사용됩니다.',
    descriptionEn: 'Use the slash commands from installed plugins. The plugin name is used as a namespace.',
    command: '/plugin-name:command',
    commandAlt: '/plugin-name:help',
  },
  {
    icon: <ConfigIcon sx={{ fontSize: 32 }} />,
    titleKo: '4. 플러그인 관리',
    titleEn: '4. Manage Plugins',
    descriptionKo: '설치된 플러그인 목록 확인, 업데이트, 제거 등을 할 수 있습니다.',
    descriptionEn: 'View installed plugins, update, or remove them.',
    command: '/plugin list',
    commandAlt: '/plugin update plugin-name',
  },
];

// Plugin structure example
const pluginStructure = `my-plugin/
├── .claude-plugin/
│   └── plugin.json        # 플러그인 매니페스트 (필수)
├── commands/              # 슬래시 명령어
│   └── hello.md
├── agents/                # 커스텀 에이전트
├── skills/                # 에이전트 스킬
│   └── SKILL.md
├── hooks/
│   └── hooks.json         # 이벤트 핸들러
└── .mcp.json              # MCP 서버 설정`;

export default function MarketplaceGuidePage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const isDark = theme.palette.mode === 'dark';
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Theme colors
  const themeColor = '#9333ea';
  const themeGradient = 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)';

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setSnackbarOpen(true);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 4, md: 6 },
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)'
            : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
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
                background: themeGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
              }}
            >
              {language === 'ko' ? '설치 가이드' : 'Installation Guide'}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                textAlign: 'center',
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {language === 'ko'
                ? 'Claude Code에서 플러그인을 설치하고 사용하는 방법을 알아보세요'
                : 'Learn how to install and use plugins in Claude Code'}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Prerequisites Alert */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        <Alert
          severity="info"
          sx={{
            mb: 4,
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {language === 'ko' ? '필수 조건' : 'Prerequisites'}
          </Typography>
          <Typography variant="body2">
            {language === 'ko'
              ? 'Claude Code가 설치되어 있어야 합니다. 플러그인은 Git 저장소를 통해 배포되므로 Git이 설치되어 있어야 합니다.'
              : 'Claude Code must be installed. Plugins are distributed via Git repositories, so Git must be installed.'}
          </Typography>
        </Alert>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Installation Steps */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              background: themeGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '설치 방법' : 'Installation Steps'}
          </Typography>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: isDark ? '#1a1a2e' : '#faf5ff',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: themeColor,
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: `${themeColor}20`,
                      color: themeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {language === 'ko' ? step.titleKo : step.titleEn}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {language === 'ko' ? step.descriptionKo : step.descriptionEn}
                    </Typography>
                  </Box>
                </Box>

                {/* Command examples */}
                <Box sx={{ pl: { xs: 0, md: 9 } }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: isDark ? '#0a0a0a' : '#1e1e1e',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography
                      component="code"
                      sx={{
                        color: '#dcdcaa',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                      }}
                    >
                      {step.command}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(step.command, index)}
                      sx={{ color: '#9cdcfe' }}
                    >
                      {copiedIndex === index ? <CheckIcon sx={{ color: '#4ade80' }} /> : <CopyIcon fontSize="small" />}
                    </IconButton>
                  </Paper>
                  {step.commandAlt && (
                    <Typography variant="caption" color="text.disabled" sx={{ pl: 1 }}>
                      {language === 'ko' ? '또는: ' : 'or: '}
                      <code style={{ fontFamily: 'monospace' }}>{step.commandAlt}</code>
                    </Typography>
                  )}
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Plugin Structure */}
        <Box sx={{ mb: 8 }}>
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
            {language === 'ko' ? '플러그인 구조' : 'Plugin Structure'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {language === 'ko'
              ? '플러그인은 다음과 같은 디렉토리 구조로 구성됩니다:'
              : 'Plugins are organized with the following directory structure:'}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: isDark ? '#0a0a0a' : '#1e1e1e',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              component="pre"
              sx={{
                color: '#e0e0e0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 1.8,
                m: 0,
                overflow: 'auto',
              }}
            >
              {pluginStructure}
            </Typography>
          </Paper>
        </Box>

        {/* Official Marketplace */}
        <Box sx={{ mb: 8 }}>
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
            {language === 'ko' ? '공식 마켓플레이스' : 'Official Marketplace'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {language === 'ko'
              ? 'Anthropic에서 관리하는 공식 플러그인 마켓플레이스를 사용할 수 있습니다:'
              : 'You can use the official plugin marketplace maintained by Anthropic:'}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: isDark ? '#1a1a2e' : '#faf5ff',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <GitHubIcon sx={{ color: themeColor }} />
            <Typography
              component="a"
              href="https://github.com/anthropics/claude-plugins-official"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: themeColor,
                fontFamily: 'monospace',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              github.com/anthropics/claude-plugins-official
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Paper
              sx={{
                p: 1.5,
                bgcolor: isDark ? '#0a0a0a' : '#1e1e1e',
                borderRadius: 1,
              }}
            >
              <Typography
                component="code"
                sx={{
                  color: '#dcdcaa',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              >
                /plugin marketplace add anthropics/claude-plugins-official
              </Typography>
            </Paper>
          </Paper>
        </Box>

        {/* CTA Section */}
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
            {language === 'ko' ? '준비되셨나요?' : 'Ready to Start?'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {language === 'ko'
              ? '커뮤니티에서 공유된 플러그인을 탐색해보세요'
              : 'Explore plugins shared by the community'}
          </Typography>
          <Button
            component={NextLink}
            href="/marketplace/explore"
            variant="contained"
            size="large"
            sx={{
              bgcolor: themeColor,
              '&:hover': { bgcolor: '#7e22ce' },
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

      {/* Page Navigation */}
      <PageNavigation
        prevPage={{
          href: '/marketplace',
          label: language === 'ko' ? '마켓플레이스 홈' : 'Marketplace Home',
        }}
        nextPage={{
          href: '/marketplace/explore',
          label: language === 'ko' ? '플러그인 탐색' : 'Explore Plugins',
        }}
      />

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={language === 'ko' ? '클립보드에 복사되었습니다' : 'Copied to clipboard'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#9333ea',
            color: '#fff',
            fontWeight: 500,
            borderRadius: 2,
            minWidth: 'auto',
          },
        }}
      />
    </>
  );
}
