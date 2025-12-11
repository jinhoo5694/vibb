'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useTheme,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  TrendingUp as TopIcon,
  OpenInNew as OpenInNewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

type SortOption = 'hot' | 'new' | 'top';
type NewsCategory = 'all' | 'AI' | '개발' | '스타트업' | '트렌드' | '튜토리얼';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceIcon?: string;
  url: string;
  category: NewsCategory;
  createdAt: Date;
  likes: number;
  comments: number;
  imageUrl?: string;
  author?: string;
}

// Sample news data
const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
    summary: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다. 코딩 벤치마크에서 이전 버전 대비 30% 향상된 성능을 보여주며, 특히 복잡한 멀티파일 프로젝트 처리 능력이 크게 개선되었습니다.',
    source: 'Anthropic Blog',
    url: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    likes: 342,
    comments: 89,
  },
  {
    id: '2',
    title: 'GitHub Copilot, 새로운 코드 리뷰 기능 추가',
    summary: 'GitHub이 Copilot에 AI 기반 코드 리뷰 기능을 추가했습니다. PR을 자동으로 분석하고 잠재적인 버그와 보안 취약점을 식별해줍니다.',
    source: 'GitHub Blog',
    url: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 256,
    comments: 67,
  },
  {
    id: '3',
    title: 'Cursor IDE 1.0 정식 출시 - AI 네이티브 개발 환경의 새로운 기준',
    summary: 'Cursor가 드디어 1.0 버전을 정식 출시했습니다. VS Code 기반의 AI 네이티브 IDE로, Claude와 GPT-4를 모두 지원하며 실시간 코드 생성과 리팩토링 기능을 제공합니다.',
    source: 'Cursor',
    url: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 523,
    comments: 134,
  },
  {
    id: '4',
    title: 'React 19 RC 발표 - 서버 컴포넌트 정식 지원',
    summary: 'React 팀이 React 19 Release Candidate를 발표했습니다. 서버 컴포넌트가 정식으로 지원되며, use() 훅과 향상된 Suspense 기능이 포함되었습니다.',
    source: 'React Blog',
    url: '#',
    category: '개발',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    likes: 412,
    comments: 98,
  },
  {
    id: '5',
    title: '바이브 코딩이란? AI와 함께하는 새로운 개발 패러다임',
    summary: '바이브 코딩(Vibe Coding)은 AI 어시스턴트와 협업하여 코드를 작성하는 새로운 개발 방식입니다. 전통적인 코딩과의 차이점과 효과적인 활용법을 알아봅니다.',
    source: 'VIB Builders',
    url: '#',
    category: '튜토리얼',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    likes: 287,
    comments: 45,
  },
  {
    id: '6',
    title: 'OpenAI, GPT-5 개발 진행 상황 공개',
    summary: 'OpenAI CEO Sam Altman이 GPT-5 개발이 순조롭게 진행중이라고 밝혔습니다. 멀티모달 능력과 추론 성능이 크게 향상될 것으로 예상됩니다.',
    source: 'TechCrunch',
    url: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    likes: 678,
    comments: 234,
  },
  {
    id: '7',
    title: 'Vercel, AI SDK 3.0 출시 - 스트리밍 응답 개선',
    summary: 'Vercel이 AI SDK 3.0을 출시했습니다. OpenAI, Anthropic, Google AI를 통합 지원하며, 스트리밍 응답 처리가 크게 개선되었습니다.',
    source: 'Vercel Blog',
    url: '#',
    category: '개발',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 189,
    comments: 42,
  },
  {
    id: '8',
    title: 'AI 스타트업 투자 트렌드 2024: 코딩 도구에 집중',
    summary: '2024년 AI 스타트업 투자는 개발자 도구와 코딩 어시스턴트에 집중되고 있습니다. Cursor, Replit, Sourcegraph 등이 대규모 투자를 유치했습니다.',
    source: 'Forbes',
    url: '#',
    category: '스타트업',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    likes: 156,
    comments: 28,
  },
  {
    id: '9',
    title: 'MCP(Model Context Protocol) 완벽 가이드',
    summary: 'Anthropic이 발표한 MCP는 AI 모델과 외부 도구를 연결하는 표준 프로토콜입니다. 설치부터 커스텀 서버 구축까지 상세히 알아봅니다.',
    source: 'VIB Builders',
    url: '#',
    category: '튜토리얼',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    likes: 234,
    comments: 67,
  },
  {
    id: '10',
    title: '2024년 개발자 설문: AI 도구 사용률 78% 돌파',
    summary: 'Stack Overflow 개발자 설문 결과, 78%의 개발자가 AI 코딩 도구를 사용하고 있는 것으로 나타났습니다. 가장 인기 있는 도구는 GitHub Copilot과 ChatGPT입니다.',
    source: 'Stack Overflow',
    url: '#',
    category: '트렌드',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    likes: 345,
    comments: 89,
  },
];

const categoryColors: Record<NewsCategory, string> = {
  'all': '#ff6b35',
  'AI': '#8b5cf6',
  '개발': '#3b82f6',
  '스타트업': '#10b981',
  '트렌드': '#f59e0b',
  '튜토리얼': '#ec4899',
};

const categoryIcons: Record<NewsCategory, string> = {
  'all': '🏠',
  'AI': '🤖',
  '개발': '💻',
  '스타트업': '🚀',
  '트렌드': '📈',
  '튜토리얼': '📚',
};

export default function NewsPage() {
  const theme = useTheme();
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const categories: NewsCategory[] = ['all', 'AI', '개발', '스타트업', '트렌드', '튜토리얼'];

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, newSort: SortOption | null) => {
    if (newSort) {
      setSortBy(newSort);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredNews = useMemo(() => {
    let filtered = sampleNews;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(query) ||
        news.summary.toLowerCase().includes(query) ||
        news.source.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'hot':
        return [...filtered].sort((a, b) => {
          const now = Date.now();
          const hoursA = (now - a.createdAt.getTime()) / (1000 * 60 * 60) + 2;
          const hoursB = (now - b.createdAt.getTime()) / (1000 * 60 * 60) + 2;
          const scoreA = a.likes / Math.pow(hoursA, 1.5);
          const scoreB = b.likes / Math.pow(hoursB, 1.5);
          return scoreB - scoreA;
        });
      case 'new':
        return [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'top':
        return [...filtered].sort((a, b) => b.likes - a.likes);
      default:
        return filtered;
    }
  }, [selectedCategory, searchQuery, sortBy]);

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: language === 'ko' ? ko : undefined });
  };

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '뉴스' : 'News'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? 'AI와 개발 관련 최신 소식을 확인하세요'
              : 'Stay updated with the latest AI and development news'}
          </Typography>
        </Box>

        {/* Controls Bar */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {/* Top Row: Search + Add Button */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder={language === 'ko' ? '검색...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#222' : '#fafafa',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#ff6b35',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderRadius: 1.5,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: '#e55a2b',
                },
              }}
            >
              {language === 'ko' ? '뉴스 제보' : 'Submit'}
            </Button>
          </Box>

          {/* Bottom Row: Sort + Categories */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Sort Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                {language === 'ko' ? '정렬' : 'Sort'}
              </Typography>
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={handleSortChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.25,
                    gap: 0.5,
                    fontSize: '0.8rem',
                    borderColor: theme.palette.divider,
                    '&.Mui-selected': {
                      bgcolor: '#ff6b35',
                      color: '#fff',
                      borderColor: '#ff6b35',
                      '&:hover': {
                        bgcolor: '#e55a2b',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="hot">
                  <HotIcon sx={{ fontSize: 14 }} />
                  {language === 'ko' ? '인기' : 'Hot'}
                </ToggleButton>
                <ToggleButton value="new">
                  <NewIcon sx={{ fontSize: 14 }} />
                  {language === 'ko' ? '최신' : 'New'}
                </ToggleButton>
                <ToggleButton value="top">
                  <TopIcon sx={{ fontSize: 14 }} />
                  {language === 'ko' ? '추천' : 'Top'}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Category Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                {language === 'ko' ? '필터' : 'Filter'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {categories.map((category) => {
                  const color = categoryColors[category];
                  const icon = categoryIcons[category];
                  const isSelected = selectedCategory === category;
                  const label = category === 'all' ? (language === 'ko' ? '전체' : 'All') : category;

                  return (
                    <Chip
                      key={category}
                      label={`${icon} ${label}`}
                      size="small"
                      onClick={() => setSelectedCategory(category)}
                      sx={{
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: '0.75rem',
                        height: 26,
                        bgcolor: isSelected ? color : 'transparent',
                        color: isSelected ? '#fff' : 'text.secondary',
                        border: `1px solid ${isSelected ? color : theme.palette.divider}`,
                        '&:hover': {
                          bgcolor: isSelected ? color : `${color}20`,
                          borderColor: color,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* News List */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
          }}
        >
          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {filteredNews.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredNews.map((news) => (
                  <Paper
                    key={news.id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Category & Source */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={`${categoryIcons[news.category]} ${news.category}`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              bgcolor: `${categoryColors[news.category]}20`,
                              color: categoryColors[news.category],
                              fontWeight: 600,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {news.source}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getTimeAgo(news.createdAt)}
                          </Typography>
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          component="a"
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            mb: 1,
                            display: 'block',
                            textDecoration: 'none',
                            color: 'text.primary',
                            '&:hover': {
                              color: '#ff6b35',
                            },
                          }}
                        >
                          {news.title}
                        </Typography>

                        {/* Summary */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.6,
                          }}
                        >
                          {news.summary}
                        </Typography>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <ThumbUpIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{news.likes}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CommentIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{news.comments}</Typography>
                          </Box>
                          <Box sx={{ flex: 1 }} />
                          <IconButton
                            size="small"
                            onClick={() => toggleBookmark(news.id)}
                            sx={{ color: bookmarkedIds.has(news.id) ? '#ff6b35' : 'text.secondary' }}
                          >
                            {bookmarkedIds.has(news.id) ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                          </IconButton>
                          <IconButton
                            size="small"
                            component="a"
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: 'text.secondary' }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ko'
                    ? (searchQuery ? '검색 결과가 없습니다' : '뉴스가 없습니다')
                    : (searchQuery ? 'No results found' : 'No news yet')}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {language === 'ko'
                    ? (searchQuery ? '다른 검색어를 입력해보세요' : '곧 새로운 소식이 올라옵니다!')
                    : (searchQuery ? 'Try a different search term' : 'New updates coming soon!')}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: '100%', lg: 320 },
              flexShrink: 0,
              order: { xs: -1, lg: 0 },
              position: { lg: 'sticky' },
              top: { lg: 100 },
              alignSelf: 'flex-start',
            }}
          >
            {/* Trending News */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8fafc',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <HotIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
                  {language === 'ko' ? '실시간 인기' : 'Trending'}
                </Typography>
              </Box>
              <Box>
                {sampleNews
                  .sort((a, b) => b.likes - a.likes)
                  .slice(0, 5)
                  .map((news, index) => (
                    <Box
                      key={news.id}
                      component="a"
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 2,
                        textDecoration: 'none',
                        color: 'text.primary',
                        borderBottom: index < 4 ? `1px solid ${theme.palette.divider}` : 'none',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: index < 3 ? '#ff6b35' : 'text.secondary',
                          minWidth: 20,
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {news.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {news.source}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            • {news.likes} likes
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Paper>

            {/* Newsletter Signup */}
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff8f5',
                display: { xs: 'none', lg: 'block' },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {language === 'ko' ? '뉴스레터 구독' : 'Subscribe to Newsletter'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {language === 'ko'
                  ? '매주 핫한 AI/개발 소식을 이메일로 받아보세요'
                  : 'Get weekly hot AI/dev news in your inbox'}
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder={language === 'ko' ? '이메일 주소' : 'Email address'}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#ff6b35',
                  '&:hover': { bgcolor: '#e55a2b' },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1.5,
                }}
              >
                {language === 'ko' ? '구독하기' : 'Subscribe'}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
