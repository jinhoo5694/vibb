'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewsCategory, NewsItem, categoryIcons } from '@/types/news';
import { getNewsById, updateNews, CreateNewsInput } from '@/services/newsService';
import { getUserProfile } from '@/services/supabase';
import { isDebugMode } from '@/lib/debug';

const categories: NewsCategory[] = ['AI', '개발', '스타트업', '트렌드', '튜토리얼'];

// Sample news data for debug mode
const sampleNewsDetail: NewsItem = {
  id: '1',
  title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
  summary: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다.',
  source: 'Anthropic Blog',
  sourceUrl: 'https://www.anthropic.com/news',
  category: 'AI',
  createdAt: new Date(),
  upvoteCount: 342,
  downvoteCount: 12,
  commentCount: 89,
  viewCount: 2850,
  status: 'published',
};

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState<NewsCategory>('AI');

  // Fetch news data
  useEffect(() => {
    async function fetchNews() {
      setLoadingNews(true);

      if (isDebugMode()) {
        const data = { ...sampleNewsDetail, id };
        setNews(data);
        setTitle(data.title);
        setSummary(data.summary);
        setSource(data.source);
        setSourceUrl(data.sourceUrl);
        setCategory(data.category);
        setLoadingNews(false);
        return;
      }

      try {
        const newsData = await getNewsById(id);
        if (newsData) {
          setNews(newsData);
          setTitle(newsData.title);
          setSummary(newsData.summary);
          setSource(newsData.source);
          setSourceUrl(newsData.sourceUrl);
          setCategory(newsData.category);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoadingNews(false);
      }
    }
    fetchNews();
  }, [id]);

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (authLoading) return;

      if (!user?.id) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingAdmin(false);
      }
    }
    checkAdmin();
  }, [user?.id, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !summary.trim() || !source.trim()) {
      setError(language === 'ko' ? '필수 항목을 모두 입력해주세요' : 'Please fill in all required fields');
      return;
    }

    if (!user) return;

    setSaving(true);
    try {
      const input: CreateNewsInput = {
        title: title.trim(),
        summary: summary.trim(),
        source: source.trim(),
        sourceUrl: sourceUrl.trim() || '#',
        category,
        authorId: user.id,
      };

      const success = await updateNews(id, input);
      if (success) {
        router.push(`/news/${id}`);
      } else {
        setError(language === 'ko' ? '뉴스 수정에 실패했습니다' : 'Failed to update news');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      setError(language === 'ko' ? '뉴스 수정에 실패했습니다' : 'Failed to update news');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (authLoading || checkingAdmin || loadingNews) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Skeleton variant="text" width={100} height={40} sx={{ mb: 3 }} />
          <Skeleton variant="text" width="40%" height={50} sx={{ mb: 4 }} />
          <Skeleton variant="rounded" height={400} />
        </Container>
        <Footer />
      </>
    );
  }

  // Not authorized
  if (!user || !isAdmin) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {language === 'ko' ? '접근 권한이 없습니다' : 'Access Denied'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {language === 'ko'
              ? '관리자만 뉴스를 수정할 수 있습니다'
              : 'Only admins can edit news'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/news')}
            sx={{
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

  // News not found
  if (!news) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
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
            onClick={() => router.push(`/news/${id}`)}
            sx={{
              mb: 3,
              color: 'text.secondary',
              '&:hover': { color: '#ff6b35' },
            }}
          >
            {language === 'ko' ? '뒤로 가기' : 'Go Back'}
          </Button>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 4,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '뉴스 수정' : 'Edit News'}
          </Typography>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? '#1a1a1a' : '#fff',
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label={language === 'ko' ? '제목 *' : 'Title *'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
              disabled={saving}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>{language === 'ko' ? '카테고리' : 'Category'}</InputLabel>
              <Select
                value={category}
                label={language === 'ko' ? '카테고리' : 'Category'}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                disabled={saving}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{categoryIcons[cat]}</span>
                      <span>{cat}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={language === 'ko' ? '출처 *' : 'Source *'}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={language === 'ko' ? '예: Anthropic Blog' : 'e.g., Anthropic Blog'}
              sx={{ mb: 3 }}
              disabled={saving}
            />

            <TextField
              fullWidth
              label={language === 'ko' ? '출처 URL' : 'Source URL'}
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              sx={{ mb: 3 }}
              disabled={saving}
            />

            <TextField
              fullWidth
              label={language === 'ko' ? '내용 *' : 'Content *'}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              multiline
              rows={10}
              sx={{ mb: 4 }}
              disabled={saving}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.push(`/news/${id}`)}
                disabled={saving}
                sx={{
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                }}
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={saving}
                sx={{
                  bgcolor: '#ff6b35',
                  '&:hover': { bgcolor: '#e55a2b' },
                  px: 4,
                }}
              >
                {saving
                  ? (language === 'ko' ? '저장 중...' : 'Saving...')
                  : (language === 'ko' ? '저장' : 'Save')}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
