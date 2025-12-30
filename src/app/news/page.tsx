'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  Paper,
  Pagination,
  useMediaQuery,
  Alert,
  Button,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  TrendingUp as TopIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as TimeIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { NewsListTable } from '@/components/News/NewsListTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  NewsItem,
  NewsCategory,
  categoryColors,
  categoryIcons,
} from '@/types/news';
import {
  getNews,
  getPopularNews,
  getUserBookmarks,
  toggleBookmark,
  SortOption,
} from '@/services/newsService';
import { getUserProfile } from '@/services/supabase';
import { isDebugMode } from '@/lib/debug';

// Sample news data (used only in debug mode)
const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
    content: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다. 코딩 벤치마크에서 이전 버전 대비 30% 향상된 성능을 보여주며, 특히 복잡한 멀티파일 프로젝트 처리 능력이 크게 개선되었습니다.',
    source: 'Anthropic Blog',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    upvoteCount: 342,
    downvoteCount: 12,
    commentCount: 89,
    viewCount: 2850,
    status: 'published',
  },
  {
    id: '2',
    title: 'GitHub Copilot, 새로운 코드 리뷰 기능 추가',
    content: 'GitHub이 Copilot에 AI 기반 코드 리뷰 기능을 추가했습니다. PR을 자동으로 분석하고 잠재적인 버그와 보안 취약점을 식별해줍니다.',
    source: 'GitHub Blog',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    upvoteCount: 256,
    downvoteCount: 8,
    commentCount: 67,
    viewCount: 1920,
    status: 'published',
  },
  {
    id: '3',
    title: 'Cursor IDE 1.0 정식 출시 - AI 네이티브 개발 환경의 새로운 기준',
    content: 'Cursor가 드디어 1.0 버전을 정식 출시했습니다. VS Code 기반의 AI 네이티브 IDE로, Claude와 GPT-4를 모두 지원하며 실시간 코드 생성과 리팩토링 기능을 제공합니다.',
    source: 'Cursor',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    upvoteCount: 523,
    downvoteCount: 15,
    commentCount: 134,
    viewCount: 4210,
    status: 'published',
  },
  {
    id: '4',
    title: 'React 19 RC 발표 - 서버 컴포넌트 정식 지원',
    content: 'React 팀이 React 19 Release Candidate를 발표했습니다. 서버 컴포넌트가 정식으로 지원되며, use() 훅과 향상된 Suspense 기능이 포함되었습니다.',
    source: 'React Blog',
    sourceUrl: '#',
    category: '개발',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    upvoteCount: 412,
    downvoteCount: 10,
    commentCount: 98,
    viewCount: 3540,
    status: 'published',
  },
  {
    id: '5',
    title: '바이브 코딩이란? AI와 함께하는 새로운 개발 패러다임',
    content: '바이브 코딩(Vibe Coding)은 AI 어시스턴트와 협업하여 코드를 작성하는 새로운 개발 방식입니다. 전통적인 코딩과의 차이점과 효과적인 활용법을 알아봅니다.',
    source: 'VIB Builders',
    sourceUrl: '#',
    category: '튜토리얼',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    upvoteCount: 287,
    downvoteCount: 5,
    commentCount: 45,
    viewCount: 1650,
    status: 'published',
  },
  {
    id: '6',
    title: 'OpenAI, GPT-5 개발 진행 상황 공개',
    content: 'OpenAI CEO Sam Altman이 GPT-5 개발이 순조롭게 진행중이라고 밝혔습니다. 멀티모달 능력과 추론 성능이 크게 향상될 것으로 예상됩니다.',
    source: 'TechCrunch',
    sourceUrl: '#',
    category: 'AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    upvoteCount: 678,
    downvoteCount: 20,
    commentCount: 234,
    viewCount: 5890,
    status: 'published',
  },
  {
    id: '7',
    title: 'Vercel, AI SDK 3.0 출시 - 스트리밍 응답 개선',
    content: 'Vercel이 AI SDK 3.0을 출시했습니다. OpenAI, Anthropic, Google AI를 통합 지원하며, 스트리밍 응답 처리가 크게 개선되었습니다.',
    source: 'Vercel Blog',
    sourceUrl: '#',
    category: '개발',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    upvoteCount: 189,
    downvoteCount: 3,
    commentCount: 42,
    viewCount: 1280,
    status: 'published',
  },
  {
    id: '8',
    title: 'AI 스타트업 투자 트렌드 2024: 코딩 도구에 집중',
    content: '2024년 AI 스타트업 투자는 개발자 도구와 코딩 어시스턴트에 집중되고 있습니다. Cursor, Replit, Sourcegraph 등이 대규모 투자를 유치했습니다.',
    source: 'Forbes',
    sourceUrl: '#',
    category: '스타트업',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    upvoteCount: 156,
    downvoteCount: 7,
    commentCount: 28,
    viewCount: 980,
    status: 'published',
  },
  {
    id: '9',
    title: 'MCP(Model Context Protocol) 완벽 가이드',
    content: 'Anthropic이 발표한 MCP는 AI 모델과 외부 도구를 연결하는 표준 프로토콜입니다. 설치부터 커스텀 서버 구축까지 상세히 알아봅니다.',
    source: 'VIB Builders',
    sourceUrl: '#',
    category: '튜토리얼',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    upvoteCount: 234,
    downvoteCount: 4,
    commentCount: 67,
    viewCount: 2100,
    status: 'published',
  },
  {
    id: '10',
    title: '2024년 개발자 설문: AI 도구 사용률 78% 돌파',
    content: 'Stack Overflow 개발자 설문 결과, 78%의 개발자가 AI 코딩 도구를 사용하고 있는 것으로 나타났습니다. 가장 인기 있는 도구는 GitHub Copilot과 ChatGPT입니다.',
    source: 'Stack Overflow',
    sourceUrl: '#',
    category: '트렌드',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    upvoteCount: 345,
    downvoteCount: 9,
    commentCount: 89,
    viewCount: 3120,
    status: 'published',
  },
];

// Generate gradient based on category
const getCategoryGradient = (category: NewsCategory, isDark: boolean) => {
  const gradients: Record<NewsCategory, string> = {
    'AI': isDark
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '개발': isDark
      ? 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    '스타트업': isDark
      ? 'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #0f766e 100%)'
      : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    '트렌드': isDark
      ? 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #a16207 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '튜토리얼': isDark
      ? 'linear-gradient(135deg, #4a1942 0%, #831843 50%, #9d174d 100%)'
      : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  };
  return gradients[category];
};

// Trending News Card Component - Compact version for featured section
const TrendingNewsCard: React.FC<{
  news: NewsItem;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  index: number;
}> = ({ news, isBookmarked, onToggleBookmark, index }) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  const timeAgo = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - news.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (language === 'ko') {
      if (days > 0) return `${days}일 전`;
      if (hours > 0) return `${hours}시간 전`;
      return `${minutes}분 전`;
    } else {
      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      return `${minutes}m ago`;
    }
  }, [news.createdAt, language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <Paper
        component={NextLink}
        href={`/news/${news.id}`}
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 160,
          textDecoration: 'none',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          background: getCategoryGradient(news.category, isDark),
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: isDark
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        {/* Overlay Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip
              label={`${categoryIcons[news.category]} ${news.category}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
            <Chip
              label={`#${index + 1}`}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.6rem',
                bgcolor: '#ff6b35',
                color: '#fff',
                fontWeight: 700,
                '& .MuiChip-label': { px: 0.5 },
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              lineHeight: 1.35,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {news.title}
          </Typography>

          {/* Footer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem' }}>
                {news.source}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <ThumbUpIcon sx={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem' }}>
                  {news.upvoteCount}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleBookmark();
              }}
              sx={{
                p: 0.25,
                color: isBookmarked ? '#ff6b35' : 'rgba(255,255,255,0.8)',
              }}
            >
              {isBookmarked ? <BookmarkIcon sx={{ fontSize: 14 }} /> : <BookmarkBorderIcon sx={{ fontSize: 14 }} />}
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Compact News Card Component - For multi-column grid
const CompactNewsCard: React.FC<{
  news: NewsItem;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  index: number;
  isAdmin?: boolean;
}> = ({ news, isBookmarked, onToggleBookmark, index, isAdmin }) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  const timeAgo = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - news.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (language === 'ko') {
      if (days > 0) return `${days}일 전`;
      if (hours > 0) return `${hours}시간 전`;
      return `${minutes}분 전`;
    } else {
      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      return `${minutes}m ago`;
    }
  }, [news.createdAt, language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      style={{ height: '100%' }}
    >
      <Paper
        component={NextLink}
        href={`/news/${news.id}`}
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textDecoration: 'none',
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? '#1a1a1a' : '#fff',
          transition: 'all 0.15s',
          '&:hover': {
            borderColor: categoryColors[news.category],
            bgcolor: isDark ? '#222' : '#fafafa',
            transform: 'translateY(-2px)',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            '& .news-title': {
              color: categoryColors[news.category],
            },
          },
        }}
      >
        {/* Category Color Bar */}
        <Box
          sx={{
            height: 3,
            bgcolor: categoryColors[news.category],
          }}
        />

        {/* Content */}
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', height: 130 }}>
          {/* Category + Source Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexShrink: 0 }}>
            <Chip
              label={`${categoryIcons[news.category]} ${news.category}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: `${categoryColors[news.category]}15`,
                color: categoryColors[news.category],
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              {news.source}
            </Typography>
          </Box>

          {/* Title - Fixed height area */}
          <Box sx={{ flex: 1, minHeight: 0, mb: 0.75 }}>
            <Typography
              className="news-title"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: 1.4,
                color: 'text.primary',
                transition: 'color 0.15s',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {news.title}
            </Typography>
          </Box>

          {/* Footer: Meta Info + Bookmark */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                {timeAgo}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <ThumbUpIcon sx={{ fontSize: 11, color: news.upvoteCount > 100 ? '#ff6b35' : 'text.disabled' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    color: news.upvoteCount > 100 ? '#ff6b35' : 'text.disabled',
                    fontWeight: news.upvoteCount > 100 ? 600 : 400,
                  }}
                >
                  {news.upvoteCount}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <CommentIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                  {news.commentCount}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isAdmin && (
                <Tooltip title={language === 'ko' ? '수정' : 'Edit'}>
                  <IconButton
                    component={NextLink}
                    href={`/news/${news.id}/edit`}
                    size="small"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                    }}
                    sx={{
                      p: 0.25,
                      color: '#ff6b35',
                      '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.1)' },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleBookmark();
                }}
                sx={{
                  p: 0.25,
                  color: isBookmarked ? '#ff6b35' : 'text.disabled',
                }}
              >
                {isBookmarked ? <BookmarkIcon sx={{ fontSize: 16 }} /> : <BookmarkBorderIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Section Header Component
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ icon, title, subtitle, action }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,107,53,0.15)' : 'rgba(255,107,53,0.1)',
            color: '#ff6b35',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action}
    </Box>
  );
};

export default function NewsPage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const newsPerPage = 15; // More items per page since rows are compact

  const categories: (NewsCategory | 'all')[] = ['all', 'AI', '개발', '스타트업', '트렌드', '튜토리얼'];

  // Fetch news
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);

      if (isDebugMode()) {
        setNews(sortSampleNews(sampleNews, sortBy, selectedCategory, searchQuery));
        setUsingSampleData(true);
        setLoading(false);
        return;
      }

      try {
        const fetchedNews = await getNews({ sortBy, category: selectedCategory, searchQuery });

        // If no real news data, fall back to sample data for UI preview
        if (fetchedNews.length === 0) {
          setNews(sortSampleNews(sampleNews, sortBy, selectedCategory, searchQuery));
          setUsingSampleData(true);
        } else {
          setNews(fetchedNews);
          setUsingSampleData(false);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        // On error, also fall back to sample data
        setNews(sortSampleNews(sampleNews, sortBy, selectedCategory, searchQuery));
        setUsingSampleData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [sortBy, selectedCategory, searchQuery]);

  // Fetch user bookmarks and check admin status
  useEffect(() => {
    async function fetchUserData() {
      if (user?.id) {
        const [bookmarks, profile] = await Promise.all([
          getUserBookmarks(user.id),
          getUserProfile(user.id),
        ]);
        setBookmarkedIds(bookmarks);
        setIsAdmin(profile?.role === 'admin');
      } else {
        setBookmarkedIds(new Set());
        setIsAdmin(false);
      }
    }
    fetchUserData();
  }, [user?.id]);

  function sortSampleNews(
    data: NewsItem[],
    sort: SortOption,
    category: NewsCategory | 'all',
    query: string
  ): NewsItem[] {
    let filtered = data;
    if (category !== 'all') {
      filtered = filtered.filter((n) => n.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'hot':
        return [...filtered].sort((a, b) => b.viewCount - a.viewCount);
      case 'top':
        return [...filtered].sort((a, b) => b.upvoteCount - a.upvoteCount);
      case 'new':
      default:
        return [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  const handleToggleBookmark = async (id: string) => {
    if (!user?.id) return;
    try {
      const result = await toggleBookmark(id);
      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        if (result.action === 'added') {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Get featured/trending news (top 3 items) - only show if we have more than 3 items
  const showTrending = news.length > 3 && selectedCategory === 'all' && !searchQuery && currentPage === 1;
  const trendingNews = showTrending ? news.slice(0, 3) : [];

  // Get remaining news for grid (skip top 3 only when showing trending section)
  const gridNews = showTrending ? news.slice(3) : news;

  // Pagination
  const totalPages = Math.ceil(gridNews.length / newsPerPage);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * newsPerPage;
    return gridNews.slice(startIndex, startIndex + newsPerPage);
  }, [gridNews, currentPage, newsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedCategory, searchQuery]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          background: isDark
            ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
            : 'linear-gradient(180deg, #fff5f0 0%, #ffffff 100%)',
          pt: { xs: 4, md: 6 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          {/* Page Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1.5,
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {language === 'ko' ? 'AI & 개발 뉴스' : 'AI & Dev News'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              {language === 'ko'
                ? '바이브 코딩을 위한 최신 AI, 개발 소식을 한눈에'
                : 'Latest AI and development news for vibe coding'}
            </Typography>
            {isAdmin && (
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={NextLink}
                  href="/news/new"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: '#ff6b35',
                    '&:hover': { bgcolor: '#e55a2b' },
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {language === 'ko' ? '뉴스 추가' : 'Add News'}
                </Button>
              </Box>
            )}
          </Box>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            <TextField
              fullWidth
              size="medium"
              placeholder={language === 'ko' ? '뉴스 검색...' : 'Search news...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 3px ${categoryColors['all']}30`,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Category Pills */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const color = categoryColors[category];
              const label = category === 'all' ? (language === 'ko' ? '전체' : 'All') : category;
              const icon = categoryIcons[category];

              return (
                <Chip
                  key={category}
                  label={`${icon} ${label}`}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    px: 1,
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    bgcolor: isSelected ? color : 'transparent',
                    color: isSelected ? '#fff' : 'text.secondary',
                    border: `1.5px solid ${isSelected ? color : theme.palette.divider}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isSelected ? color : `${color}20`,
                      borderColor: color,
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              );
            })}
          </Box>

          {/* Sort Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {[
              { value: 'new', label: language === 'ko' ? '최신순' : 'Latest', icon: <NewIcon sx={{ fontSize: 16 }} /> },
              { value: 'hot', label: language === 'ko' ? '인기순' : 'Popular', icon: <HotIcon sx={{ fontSize: 16 }} /> },
              { value: 'top', label: language === 'ko' ? '추천순' : 'Top Rated', icon: <TopIcon sx={{ fontSize: 16 }} /> },
            ].map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'contained' : 'outlined'}
                size="small"
                startIcon={option.icon}
                onClick={() => setSortBy(option.value as SortOption)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  ...(sortBy === option.value
                    ? {
                        bgcolor: '#ff6b35',
                        '&:hover': { bgcolor: '#e55a2b' },
                      }
                    : {
                        borderColor: theme.palette.divider,
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: '#ff6b35',
                          color: '#ff6b35',
                          bgcolor: 'transparent',
                        },
                      }),
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Sample data notice */}
        {usingSampleData && !loading && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {language === 'ko'
              ? '📰 현재 등록된 뉴스가 없어 샘플 데이터를 표시하고 있습니다. 곧 새로운 소식이 업데이트됩니다!'
              : '📰 No news available yet. Showing sample data. New updates coming soon!'}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box>
            {/* Featured section skeleton */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
                mb: 4,
              }}
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
            {/* News grid skeleton */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
        )}

        {!loading && news.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {language === 'ko' ? '뉴스가 없습니다' : 'No news found'}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {language === 'ko' ? '다른 검색어나 카테고리를 시도해보세요' : 'Try a different search or category'}
            </Typography>
          </Box>
        )}

        {!loading && news.length > 0 && (
          <>
            {/* Trending News Section */}
            {showTrending && trendingNews.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <SectionHeader
                  icon={<HotIcon />}
                  title={language === 'ko' ? '실시간 트렌딩' : 'Trending Now'}
                  subtitle={language === 'ko' ? '지금 가장 주목받는 소식' : 'Top stories right now'}
                />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {trendingNews.map((item, index) => (
                    <TrendingNewsCard
                      key={item.id}
                      news={item}
                      isBookmarked={bookmarkedIds.has(item.id)}
                      onToggleBookmark={() => handleToggleBookmark(item.id)}
                      index={index}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* News List */}
            <Box sx={{ mb: 4 }}>
              <SectionHeader
                icon={<NewIcon />}
                title={
                  selectedCategory === 'all'
                    ? (language === 'ko' ? '모든 뉴스' : 'All News')
                    : `${categoryIcons[selectedCategory]} ${selectedCategory}`
                }
                subtitle={`${news.length}${language === 'ko' ? '개의 뉴스' : ' articles'}`}
              />

              <NewsListTable
                news={paginatedNews}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                isAdmin={isAdmin}
              />
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 500,
                      '&.Mui-selected': {
                        bgcolor: '#ff6b35',
                        color: '#fff',
                        '&:hover': { bgcolor: '#e55a2b' },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
