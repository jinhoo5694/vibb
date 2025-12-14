'use client';

import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Grid, Paper, Button, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import {
  HelpOutline as HelpIcon,
  MenuBook as GuideIcon,
  Explore as ExploreIcon,
  Speed as SpeedIcon,
  Compare as CompareIcon,
  Lightbulb as LightbulbIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  Language as WebIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

type ToolCategory = 'editor' | 'cli' | 'web';

interface AITool {
  id: string;
  name: string;
  logo: string;
  descriptionKo: string;
  descriptionEn: string;
  url: string;
  category: ToolCategory;
}

const aiTools: AITool[] = [
  // Editor-based tools
  {
    id: 'cursor',
    name: 'Cursor',
    logo: 'https://cursor.sh/brand/icon.svg',
    descriptionKo: 'AI 네이티브 코드 에디터',
    descriptionEn: 'AI-native code editor',
    url: 'https://cursor.com',
    category: 'editor',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    logo: 'https://exafunction.github.io/public/images/codeium_logo.svg',
    descriptionKo: 'Codeium의 AI IDE',
    descriptionEn: 'AI IDE by Codeium',
    url: 'https://codeium.com/windsurf',
    category: 'editor',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    logo: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.svg',
    descriptionKo: 'AI 페어 프로그래머',
    descriptionEn: 'AI pair programmer',
    url: 'https://github.com/features/copilot',
    category: 'editor',
  },
  {
    id: 'zed',
    name: 'Zed',
    logo: 'https://zed.dev/img/logo-square.svg',
    descriptionKo: '초고속 AI 에디터',
    descriptionEn: 'Blazing fast AI editor',
    url: 'https://zed.dev',
    category: 'editor',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    logo: 'https://code.visualstudio.com/assets/images/code-stable.png',
    descriptionKo: 'Microsoft 코드 에디터',
    descriptionEn: 'Microsoft code editor',
    url: 'https://code.visualstudio.com',
    category: 'editor',
  },
  {
    id: 'jetbrains-ai',
    name: 'JetBrains AI',
    logo: 'https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg',
    descriptionKo: 'JetBrains AI 어시스턴트',
    descriptionEn: 'JetBrains AI Assistant',
    url: 'https://www.jetbrains.com/ai/',
    category: 'editor',
  },
  // CLI/Terminal-based tools
  {
    id: 'claude-code',
    name: 'Claude Code',
    logo: 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
    descriptionKo: 'Anthropic 공식 CLI',
    descriptionEn: 'Official Anthropic CLI',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    category: 'cli',
  },
  {
    id: 'aider',
    name: 'Aider',
    logo: 'https://aider.chat/assets/logo.svg',
    descriptionKo: 'AI 페어 프로그래밍',
    descriptionEn: 'AI pair programming',
    url: 'https://aider.chat',
    category: 'cli',
  },
  {
    id: 'github-copilot-cli',
    name: 'Copilot CLI',
    logo: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.svg',
    descriptionKo: 'GitHub Copilot CLI',
    descriptionEn: 'GitHub Copilot CLI',
    url: 'https://docs.github.com/en/copilot/github-copilot-in-the-cli',
    category: 'cli',
  },
  {
    id: 'continue',
    name: 'Continue',
    logo: 'https://continue.dev/img/logo.png',
    descriptionKo: '오픈소스 AI 어시스턴트',
    descriptionEn: 'Open-source AI assistant',
    url: 'https://continue.dev',
    category: 'cli',
  },
  {
    id: 'cline',
    name: 'Cline',
    logo: 'https://raw.githubusercontent.com/cline/cline/main/assets/icons/icon.png',
    descriptionKo: '자율 코딩 에이전트',
    descriptionEn: 'Autonomous coding agent',
    url: 'https://github.com/cline/cline',
    category: 'cli',
  },
  {
    id: 'warp',
    name: 'Warp',
    logo: 'https://www.warp.dev/favicon.svg',
    descriptionKo: 'AI 터미널',
    descriptionEn: 'AI terminal',
    url: 'https://www.warp.dev',
    category: 'cli',
  },
  // Web-based tools
  {
    id: 'v0',
    name: 'v0',
    logo: 'https://v0.dev/assets/icon.svg',
    descriptionKo: 'AI UI 생성 도구',
    descriptionEn: 'AI UI generator',
    url: 'https://v0.dev',
    category: 'web',
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    logo: 'https://bolt.new/icons/icon-512x512.png',
    descriptionKo: 'AI 풀스택 개발',
    descriptionEn: 'AI full-stack dev',
    url: 'https://bolt.new',
    category: 'web',
  },
  {
    id: 'replit',
    name: 'Replit',
    logo: 'https://replit.com/public/images/sm-tile.png',
    descriptionKo: '클라우드 AI IDE',
    descriptionEn: 'Cloud AI IDE',
    url: 'https://replit.com',
    category: 'web',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    logo: 'https://lovable.dev/icon.svg',
    descriptionKo: 'AI 앱 빌더',
    descriptionEn: 'AI app builder',
    url: 'https://lovable.dev',
    category: 'web',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    descriptionKo: 'OpenAI ChatGPT',
    descriptionEn: 'OpenAI ChatGPT',
    url: 'https://chatgpt.com',
    category: 'web',
  },
  {
    id: 'claude',
    name: 'Claude',
    logo: 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
    descriptionKo: 'Anthropic Claude',
    descriptionEn: 'Anthropic Claude',
    url: 'https://claude.ai',
    category: 'web',
  },
];

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    titleKo: '생산성 향상',
    titleEn: 'Productivity Boost',
    descriptionKo: '다양한 AI 코딩 툴을 활용하여 개발 및 작업 속도를 높이세요',
    descriptionEn: 'Use various AI tools to speed up development and work',
  },
  {
    icon: <CompareIcon sx={{ fontSize: 40 }} />,
    titleKo: '도구 비교',
    titleEn: 'Tool Comparison',
    descriptionKo: 'Cursor, Claude Code, v0 등 다양한 AI 도구들을 비교하고 선택하세요',
    descriptionEn: 'Compare and choose from various AI tools like Cursor, Claude Code, v0',
  },
  {
    icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
    titleKo: '활용 팁',
    titleEn: 'Usage Tips',
    descriptionKo: 'AI 코딩 툴들을 더 효과적으로 활용하는 방법을 배워보세요',
    descriptionEn: 'Learn how to use AI tools more effectively',
  },
];

export default function AIToolsPage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('editor');

  const handleCategoryChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: ToolCategory | null,
  ) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const filteredTools = aiTools.filter(tool => tool.category === selectedCategory);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f2922 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '4rem', md: '5rem' },
                  mb: 2,
                }}
              >
                🛠️
              </Typography>
              <Chip
                label="AI Development Tools"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI {language === 'ko' ? '코딩 툴' : 'Coding Tools'}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {language === 'ko'
                  ? '생산성을 높여주는 AI 코딩 툴들. 경험과 팁을 공유하고 함께 성장하세요.'
                  : 'AI tools that boost productivity. Share experiences and tips, grow together.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
                <Button
                  component={Link}
                  href="#what-is"
                  variant="contained"
                  size="large"
                  startIcon={<HelpIcon />}
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? 'AI 코딩 툴이란?' : 'What is AI Coding Tools?'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<GuideIcon />}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '가이드' : 'Guide'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.05)' },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {language === 'ko' ? '도구 탐색' : 'Explore Tools'}
                </Button>
              </Box>

              {/* Category Toggle */}
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={handleCategoryChange}
                aria-label="tool category"
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                  borderRadius: 3,
                  p: 0.5,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: 2.5,
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    color: 'text.secondary',
                    gap: 1,
                    '&.Mui-selected': {
                      bgcolor: '#10b981',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#059669',
                      },
                    },
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    },
                  },
                }}
              >
                <ToggleButton value="editor">
                  <CodeIcon sx={{ fontSize: 20 }} />
                  {language === 'ko' ? '에디터 기반' : 'Editor-based'}
                </ToggleButton>
                <ToggleButton value="cli">
                  <TerminalIcon sx={{ fontSize: 20 }} />
                  {language === 'ko' ? 'CLI/터미널 기반' : 'CLI/Terminal'}
                </ToggleButton>
                <ToggleButton value="web">
                  <WebIcon sx={{ fontSize: 20 }} />
                  {language === 'ko' ? '웹 기반' : 'Web-based'}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Tool Cards Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: -4 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
              }}
            >
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Paper
                    component="a"
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    elevation={0}
                    sx={{
                      width: { xs: 140, sm: 150 },
                      height: { xs: 140, sm: 150 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      p: 2,
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: theme.shadows[8],
                        borderColor: '#10b981',
                        '& .tool-logo': {
                          transform: 'scale(1.15)',
                        },
                        '& .tool-name': {
                          color: '#10b981',
                        },
                      },
                    }}
                  >
                    <Box
                      className="tool-logo"
                      component="img"
                      src={tool.logo}
                      alt={tool.name}
                      sx={{
                        width: 48,
                        height: 48,
                        objectFit: 'contain',
                        mb: 1.5,
                        transition: 'transform 0.2s ease',
                        borderRadius: 1,
                      }}
                    />
                    <Typography
                      className="tool-name"
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        textAlign: 'center',
                        color: 'text.primary',
                        transition: 'color 0.2s ease',
                        lineHeight: 1.2,
                      }}
                    >
                      {tool.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        mt: 0.5,
                        fontSize: '0.7rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {language === 'ko' ? tool.descriptionKo : tool.descriptionEn}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Container>

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
                    bgcolor: theme.palette.mode === 'dark' ? '#0f2922' : '#ecfdf5',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: '#10b981',
                    },
                  }}
                >
                  <Box sx={{ color: '#10b981', mb: 2 }}>
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

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)',
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
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? 'AI 코딩 툴 커뮤니티에 참여하세요' : 'Join the AI Coding Tools Community'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? 'AI 코딩 툴 사용 경험을 공유하고, 다른 개발자들의 노하우를 배워보세요'
                : 'Share your AI tool experiences and learn from other developers'}
            </Typography>
            <Button
              component={Link}
              href="/board"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                borderRadius: 2,
                px: 6,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {language === 'ko' ? '커뮤니티 바로가기' : 'Go to Community'}
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
