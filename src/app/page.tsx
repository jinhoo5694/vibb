'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Paper, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Forum as ForumIcon,
  RocketLaunch as RocketIcon,
  Share as ShareIcon,
  Announcement as AnnouncementIcon,
  Whatshot as HotIcon,
  AutoAwesome as SkillsIcon,
  Extension as McpIcon,
  ChatBubbleOutline as PromptIcon,
  Build as ToolsIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { InteractiveHeroBackground } from '@/components/InteractiveHeroBackground';

type TabType = 'communicate' | 'start' | 'share';

const tabs = [
  { id: 'communicate' as TabType, label: '소통해요', icon: <ForumIcon />, color: '#ff6b35' },
  { id: 'start' as TabType, label: '시작해요', icon: <RocketIcon />, color: '#4CAF50' },
  { id: 'share' as TabType, label: '나눠요', icon: <ShareIcon />, color: '#2196F3' },
];

// Sample notices data
const notices = [
  { id: 1, title: 'VIB Builders 커뮤니티 오픈!', date: '2024-12-10', isNew: true },
  { id: 2, title: '커뮤니티 이용 가이드 안내', date: '2024-12-09', isNew: true },
  { id: 3, title: '스킬 공유 이벤트 진행중', date: '2024-12-08', isNew: false },
];

// Sample popular posts data
const popularPosts = [
  { id: 1, title: 'Claude Code로 풀스택 앱 만들기', author: '코딩마스터', likes: 234, comments: 45, category: '스킬' },
  { id: 2, title: 'MCP 서버 설정 완벽 가이드', author: '테크빌더', likes: 189, comments: 32, category: 'MCP' },
  { id: 3, title: '효율적인 프롬프트 작성법', author: 'AI연구가', likes: 156, comments: 28, category: '프롬프트' },
  { id: 4, title: 'Cursor vs Claude Code 비교', author: '개발자K', likes: 145, comments: 67, category: 'AI 코딩 툴' },
  { id: 5, title: '바이브 코딩 입문자를 위한 팁', author: '뉴비헬퍼', likes: 123, comments: 21, category: '커뮤니티' },
];

// AI Tools for '시작해요' section
const aiTools = [
  {
    id: 'claude-code',
    title: 'Claude Code',
    description: 'Anthropic의 공식 AI 코딩 도구. 터미널에서 직접 Claude와 대화하며 코딩하세요.',
    icon: '🤖',
    color: '#ff6b35',
    href: '/ai-tools',
  },
  {
    id: 'cursor',
    title: 'Cursor',
    description: 'AI 기반 코드 에디터. VS Code 기반으로 친숙하고 강력한 AI 기능을 제공합니다.',
    icon: '📝',
    color: '#00D1FF',
    href: '/ai-tools',
  },
  {
    id: 'windsurf',
    title: 'Windsurf',
    description: 'Codeium의 AI IDE. 빠른 자동완성과 코드 생성으로 생산성을 높여줍니다.',
    icon: '🏄',
    color: '#6366F1',
    href: '/ai-tools',
  },
  {
    id: 'github-copilot',
    title: 'GitHub Copilot',
    description: 'GitHub과 OpenAI가 만든 AI 페어 프로그래머. 실시간 코드 제안을 받아보세요.',
    icon: '🚀',
    color: '#238636',
    href: '/ai-tools',
  },
];

// Resources for '나눠요' section
const shareResources = [
  {
    id: 'prompt',
    title: '프롬프트',
    description: '효과적인 AI 프롬프트 템플릿과 가이드를 공유하고 발견하세요.',
    icon: <PromptIcon sx={{ fontSize: 40 }} />,
    color: '#9C27B0',
    href: '/prompt',
    stats: '1,234개의 프롬프트',
  },
  {
    id: 'mcp',
    title: 'MCP 서버',
    description: 'Model Context Protocol 서버를 탐색하고 Claude의 기능을 확장하세요.',
    icon: <McpIcon sx={{ fontSize: 40 }} />,
    color: '#FF9800',
    href: '/mcp',
    stats: '89개의 서버',
  },
  {
    id: 'skills',
    title: '스킬',
    description: 'Claude Code 스킬을 공유하고 다른 빌더들의 스킬을 사용해보세요.',
    icon: <SkillsIcon sx={{ fontSize: 40 }} />,
    color: '#E91E63',
    href: '/skills',
    stats: '156개의 스킬',
  },
];

// Typing animation component
const TypewriterText = ({
  text,
  isDarkMode,
  onComplete,
}: {
  text: string;
  isDarkMode: boolean;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const onCompleteCalledRef = { current: false };
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        if (!onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          onComplete?.();
        }
      }
    }, 80);

    return () => clearInterval(typingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Box component="span" sx={{ display: 'inline' }}>
      {displayedText}
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: '3px',
          height: '1em',
          bgcolor: isDarkMode ? '#ff6b35' : '#ff6b35',
          ml: 0.5,
          verticalAlign: 'text-bottom',
          opacity: showCursor ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      />
    </Box>
  );
};

export default function Home() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('communicate');

  const renderCommunicateContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Notices Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AnnouncementIcon sx={{ color: '#ff6b35' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            공지사항
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {notices.map((notice) => (
            <Box
              key={notice.id}
              component={Link}
              href={`/board/${notice.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                textDecoration: 'none',
                color: 'text.primary',
                bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f8f9fa',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? '#303030' : '#f0f0f0',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {notice.isNew && (
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      bgcolor: '#ff6b35',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      height: 20,
                    }}
                  />
                )}
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {notice.title}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {notice.date}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Popular Posts Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HotIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              인기 게시글
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/board"
            endIcon={<ArrowIcon />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            더보기
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {popularPosts.map((post, index) => (
            <Box
              key={post.id}
              component={Link}
              href={`/board/${post.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                textDecoration: 'none',
                color: 'text.primary',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: index < 3 ? '#ff6b35' : 'text.secondary',
                  minWidth: 24,
                }}
              >
                {index + 1}
              </Typography>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {post.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: theme.palette.mode === 'dark' ? '#333' : '#eee',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {post.author}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                <Typography variant="caption">❤️ {post.likes}</Typography>
                <Typography variant="caption">💬 {post.comments}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );

  const renderStartContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ToolsIcon sx={{ color: '#4CAF50' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            AI 코딩 도구로 시작하기
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          바이브 코딩을 시작하기 위한 다양한 AI 도구들을 알아보세요.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {aiTools.map((tool) => (
            <Paper
              key={tool.id}
              component={Link}
              href={tool.href}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f8f9fa',
                textDecoration: 'none',
                color: 'text.primary',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${tool.color}20`,
                  borderColor: tool.color,
                },
              }}
            >
              <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>{tool.icon}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {tool.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {tool.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            component={Link}
            href="/ai-tools"
            variant="contained"
            endIcon={<ArrowIcon />}
            sx={{
              bgcolor: '#4CAF50',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#43A047',
              },
            }}
          >
            모든 AI 도구 보기
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  const renderShareContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {shareResources.map((resource) => (
        <Paper
          key={resource.id}
          component={Link}
          href={resource.href}
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            textDecoration: 'none',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateX(8px)',
              borderColor: resource.color,
              boxShadow: `0 4px 20px ${resource.color}15`,
            },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              bgcolor: `${resource.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: resource.color,
              flexShrink: 0,
            }}
          >
            {resource.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {resource.title}
              </Typography>
              <Chip
                label={resource.stats}
                size="small"
                sx={{
                  bgcolor: `${resource.color}20`,
                  color: resource.color,
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {resource.description}
            </Typography>
          </Box>
          <ArrowIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
        </Paper>
      ))}
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'communicate':
        return renderCommunicateContent();
      case 'start':
        return renderStartContent();
      case 'share':
        return renderShareContent();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      {/* Hero Banner with Interactive Background */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 200, md: 280 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <InteractiveHeroBackground isDarkMode={theme.palette.mode === 'dark'} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#2d3436',
                  mb: 1,
                  textShadow: theme.palette.mode === 'dark'
                    ? '0 2px 20px rgba(0,0,0,0.5)'
                    : '0 2px 20px rgba(255,255,255,0.8)',
                }}
              >
                <TypewriterText
                  text="Vibe Builders, ViBB"
                  isDarkMode={theme.palette.mode === 'dark'}
                />
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 500,
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.85)' : '#555',
                  textShadow: theme.palette.mode === 'dark'
                    ? '0 1px 10px rgba(0,0,0,0.3)'
                    : '0 1px 10px rgba(255,255,255,0.5)',
                }}
              >
                바이브 코딩 커뮤니티 — AI와 함께 성장하는 빌더들의 공간
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f6f7f8',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Tab Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 4,
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Paper
                  key={tab.id}
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  elevation={0}
                  onClick={() => setActiveTab(tab.id)}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    cursor: 'pointer',
                    border: `2px solid ${isActive ? tab.color : theme.palette.divider}`,
                    bgcolor: isActive
                      ? theme.palette.mode === 'dark'
                        ? `${tab.color}15`
                        : `${tab.color}10`
                      : theme.palette.mode === 'dark'
                      ? '#1a1a1a'
                      : '#ffffff',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      borderColor: tab.color,
                      bgcolor:
                        theme.palette.mode === 'dark' ? `${tab.color}10` : `${tab.color}05`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: isActive ? tab.color : 'text.secondary',
                      transition: 'color 0.3s',
                    }}
                  >
                    {tab.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: isActive ? tab.color : 'text.primary',
                      transition: 'color 0.3s',
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Paper>
              );
            })}
          </Box>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
