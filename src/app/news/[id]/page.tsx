'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Paper,
  useTheme,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ChatBubbleOutline as CommentIcon,
  Visibility as ViewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  OpenInNew as OpenInNewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewsItem, categoryColors, categoryIcons } from '@/types/news';
import {
  getNewsById,
  deleteNews,
  toggleBookmark,
  isBookmarked as checkBookmarked,
  incrementViewCount,
} from '@/services/newsService';
import { getUserProfile } from '@/services/supabase';
import { isDebugMode } from '@/lib/debug';

// Sample news data for debug mode
const sampleNewsDetail: NewsItem = {
  id: '1',
  title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
  summary: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다. 코딩 벤치마크에서 이전 버전 대비 30% 향상된 성능을 보여주며, 특히 복잡한 멀티파일 프로젝트 처리 능력이 크게 개선되었습니다.\n\nClaude 3.5 Sonnet은 코드 생성, 디버깅, 리팩토링 등 다양한 프로그래밍 작업에서 뛰어난 성능을 보여주고 있습니다. 특히 컨텍스트 윈도우가 200K 토큰으로 확장되어 대규모 코드베이스를 한 번에 분석할 수 있게 되었습니다.\n\n이번 업데이트의 주요 개선 사항:\n\n1. 코드 생성 정확도 향상 - 더 정확하고 효율적인 코드 생성\n2. 멀티파일 프로젝트 지원 - 여러 파일에 걸친 변경사항 추적 및 적용\n3. 에러 디버깅 능력 향상 - 복잡한 버그를 더 빠르게 식별하고 수정\n4. 리팩토링 제안 - 코드 품질 개선을 위한 더 나은 제안\n\nAnthropic은 앞으로도 지속적인 업데이트를 통해 개발자들의 생산성 향상을 지원할 계획이라고 밝혔습니다.',
  source: 'Anthropic Blog',
  sourceUrl: 'https://www.anthropic.com/news',
  category: 'AI',
  createdAt: new Date(Date.now() - 1000 * 60 * 30),
  upvoteCount: 342,
  downvoteCount: 12,
  commentCount: 89,
  viewCount: 2850,
  status: 'published',
};

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch news and user data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      if (isDebugMode()) {
        // In debug mode, use sample data
        setNews({ ...sampleNewsDetail, id });
        setLoading(false);
        return;
      }

      try {
        const newsData = await getNewsById(id);
        if (newsData) {
          setNews(newsData);
          incrementViewCount(id);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Check user admin status and bookmark
  useEffect(() => {
    async function checkUserData() {
      if (user?.id) {
        const [profile, isBookmarkedResult] = await Promise.all([
          getUserProfile(user.id),
          checkBookmarked(user.id, id),
        ]);
        setIsAdmin(profile?.role === 'admin');
        setBookmarked(isBookmarkedResult);
      } else {
        setIsAdmin(false);
        setBookmarked(false);
      }
    }
    checkUserData();
  }, [user?.id, id]);

  const handleToggleBookmark = async () => {
    if (!user?.id) return;
    try {
      const result = await toggleBookmark(id);
      setBookmarked(result.action === 'added');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.summary?.slice(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage(language === 'ko' ? '링크가 복사되었습니다' : 'Link copied');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const success = await deleteNews(id);
      if (success) {
        setSnackbarMessage(language === 'ko' ? '뉴스가 삭제되었습니다' : 'News deleted');
        setSnackbarOpen(true);
        setTimeout(() => {
          router.push('/news');
        }, 1000);
      } else {
        setSnackbarMessage(language === 'ko' ? '삭제에 실패했습니다' : 'Failed to delete');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      setSnackbarMessage(language === 'ko' ? '삭제에 실패했습니다' : 'Failed to delete');
      setSnackbarOpen(true);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const timeAgo = news
    ? (() => {
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
      })()
    : '';

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Skeleton variant="text" width={100} height={40} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 4 }} />
          <Skeleton variant="rounded" height={200} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={400} />
        </Container>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {language === 'ko' ? '뉴스를 찾을 수 없습니다' : 'News not found'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/news')}
            sx={{
              mt: 3,
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e55a2b' },
            }}
          >
            {language === 'ko' ? '뉴스 목록으로' : 'Back to News'}
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/news')}
            sx={{
              mb: 3,
              color: 'text.secondary',
              '&:hover': { color: '#ff6b35' },
            }}
          >
            {language === 'ko' ? '뉴스 목록' : 'Back to News'}
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? '#1a1a1a' : '#fff',
              mb: 3,
            }}
          >
            {/* Category and Admin Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip
                label={`${categoryIcons[news.category]} ${news.category}`}
                sx={{
                  fontWeight: 600,
                  bgcolor: `${categoryColors[news.category]}15`,
                  color: categoryColors[news.category],
                }}
              />
              {isAdmin && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={language === 'ko' ? '수정' : 'Edit'}>
                    <IconButton
                      onClick={() => router.push(`/news/${id}/edit`)}
                      sx={{
                        color: '#ff6b35',
                        '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.1)' },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={language === 'ko' ? '삭제' : 'Delete'}>
                    <IconButton
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': { bgcolor: `${theme.palette.error.main}15` },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.3,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              {news.title}
            </Typography>

            {/* Meta Info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon sx={{ fontSize: 16 }} />
                {timeAgo}
              </Typography>
              <Typography variant="body2" sx={{ color: categoryColors[news.category], fontWeight: 600 }}>
                {news.source}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ViewIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">
                  {news.viewCount.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Chip
                icon={<ThumbUpIcon sx={{ fontSize: 16 }} />}
                label={news.upvoteCount.toLocaleString()}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                icon={<ThumbDownIcon sx={{ fontSize: 16 }} />}
                label={news.downvoteCount.toLocaleString()}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<CommentIcon sx={{ fontSize: 16 }} />}
                label={`${news.commentCount.toLocaleString()} ${language === 'ko' ? '댓글' : 'comments'}`}
                variant="outlined"
                size="small"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Content */}
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                color: 'text.primary',
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              {news.summary}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleToggleBookmark}
                sx={{
                  borderColor: bookmarked ? '#ff6b35' : theme.palette.divider,
                  color: bookmarked ? '#ff6b35' : 'text.secondary',
                  '&:hover': {
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                  },
                }}
              >
                {bookmarked
                  ? (language === 'ko' ? '북마크됨' : 'Bookmarked')
                  : (language === 'ko' ? '북마크' : 'Bookmark')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                  },
                }}
              >
                {language === 'ko' ? '공유' : 'Share'}
              </Button>
              {news.sourceUrl && news.sourceUrl !== '#' && (
                <Button
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: '#ff6b35',
                    '&:hover': { bgcolor: '#e55a2b' },
                  }}
                >
                  {language === 'ko' ? '원문 보기' : 'View Original'}
                </Button>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          {language === 'ko' ? '뉴스 삭제' : 'Delete News'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko'
              ? '정말로 이 뉴스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
              : 'Are you sure you want to delete this news? This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting
              ? (language === 'ko' ? '삭제 중...' : 'Deleting...')
              : (language === 'ko' ? '삭제' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#ff6b35',
            color: '#fff',
            fontWeight: 500,
            borderRadius: 2,
            minWidth: 'auto',
          },
        }}
      />

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
