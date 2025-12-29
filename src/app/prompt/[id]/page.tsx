'use client';

import { use, useState, useEffect, useRef } from 'react';
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
  Snackbar,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbDown as ThumbDownIcon,
  ThumbDownOutlined as ThumbDownOutlinedIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  ChatBubbleOutline as CommentIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { CommentSection } from '@/components/Comments/CommentSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPromptById, Prompt, toggleVote, getUserVote, toggleBookmark, hasUserBookmarked } from '@/services/supabase';
import { supabase } from '@/services/supabase';

export default function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const viewCountedRef = useRef(false);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch prompt data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const promptData = await getPromptById(id);
        if (promptData) {
          setPrompt(promptData);
          setUpvotes(promptData.upvotes);
          setDownvotes(promptData.downvotes);

          // Increment view count
          if (!viewCountedRef.current) {
            viewCountedRef.current = true;
            await supabase.rpc('increment_view_count', { content_id: id });
          }
        }
      } catch (error) {
        console.error('Error fetching prompt:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Check user's vote and bookmark status
  useEffect(() => {
    async function checkUserStatus() {
      if (user?.id) {
        const [vote, isBookmarked] = await Promise.all([
          getUserVote(user.id, id),
          hasUserBookmarked(user.id, id),
        ]);
        setUserVote(vote);
        setBookmarked(isBookmarked);
      }
    }
    checkUserStatus();
  }, [user?.id, id]);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      setSnackbarMessage(language === 'ko' ? '로그인이 필요합니다' : 'Please sign in');
      setSnackbarOpen(true);
      return;
    }

    try {
      const result = await toggleVote(user.id, id, voteType);
      setUserVote(result.voted);
      setUpvotes(result.upvoteCount);
      setDownvotes(result.downvoteCount);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      setSnackbarMessage(language === 'ko' ? '로그인이 필요합니다' : 'Please sign in');
      setSnackbarOpen(true);
      return;
    }

    try {
      const result = await toggleBookmark(user.id, id);
      setBookmarked(result.bookmarked);
      setSnackbarMessage(
        result.bookmarked
          ? (language === 'ko' ? '북마크에 추가되었습니다' : 'Added to bookmarks')
          : (language === 'ko' ? '북마크에서 제거되었습니다' : 'Removed from bookmarks')
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleCopyPrompt = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setSnackbarMessage(language === 'ko' ? '프롬프트가 복사되었습니다' : 'Prompt copied');
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: prompt?.title,
        text: prompt?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage(language === 'ko' ? '링크가 복사되었습니다' : 'Link copied');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Skeleton variant="text" width={100} height={40} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 4 }} />
          <Skeleton variant="rounded" height={300} />
        </Container>
        <Footer />
      </>
    );
  }

  if (!prompt) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {language === 'ko' ? '프롬프트를 찾을 수 없습니다' : 'Prompt not found'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/prompt/hub')}
            sx={{
              mt: 3,
              bgcolor: '#f59e0b',
              '&:hover': { bgcolor: '#d97706' },
            }}
          >
            {language === 'ko' ? '프롬프트 허브로' : 'Back to Prompt Hub'}
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
            onClick={() => router.push('/prompt/hub')}
            sx={{
              mb: 3,
              color: 'text.secondary',
              '&:hover': { color: '#f59e0b' },
            }}
          >
            {language === 'ko' ? '프롬프트 허브' : 'Prompt Hub'}
          </Button>
        </motion.div>

        {/* Main Content */}
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
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Chip
                  label="Prompt"
                  sx={{
                    mb: 1,
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.3,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {prompt.title}
                </Typography>
              </Box>
            </Box>

            {/* Author & Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {language === 'ko' ? '작성자:' : 'By:'} {prompt.author.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ViewIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">
                  {prompt.viewCount.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">
                  {prompt.commentCount}
                </Typography>
              </Box>
            </Box>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {prompt.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Description */}
            {prompt.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {prompt.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Prompt Text */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {language === 'ko' ? '프롬프트' : 'Prompt'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                  onClick={handleCopyPrompt}
                  sx={{
                    borderColor: copied ? 'success.main' : '#f59e0b',
                    color: copied ? 'success.main' : '#f59e0b',
                    '&:hover': {
                      borderColor: copied ? 'success.dark' : '#d97706',
                      bgcolor: copied ? 'rgba(46, 125, 50, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                    },
                  }}
                >
                  {copied ? (language === 'ko' ? '복사됨' : 'Copied') : (language === 'ko' ? '복사' : 'Copy')}
                </Button>
              </Box>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {prompt.promptText}
              </Paper>
            </Box>

            {/* Variables */}
            {prompt.variables && prompt.variables.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {language === 'ko' ? '변수' : 'Variables'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {prompt.variables.map((variable) => (
                    <Chip
                      key={variable}
                      label={`{{${variable}}}`}
                      sx={{
                        fontFamily: 'monospace',
                        bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              {/* Vote Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={language === 'ko' ? '추천' : 'Upvote'}>
                  <IconButton
                    onClick={() => handleVote('upvote')}
                    sx={{
                      color: userVote === 'upvote' ? 'success.main' : 'text.secondary',
                      '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.1)' },
                    }}
                  >
                    {userVote === 'upvote' ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
                  {upvotes}
                </Typography>
                <Tooltip title={language === 'ko' ? '비추천' : 'Downvote'}>
                  <IconButton
                    onClick={() => handleVote('downvote')}
                    sx={{
                      color: userVote === 'downvote' ? 'error.main' : 'text.secondary',
                      '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' },
                    }}
                  >
                    {userVote === 'downvote' ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 24, textAlign: 'center' }}>
                  {downvotes}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              {/* Bookmark */}
              <Button
                variant="outlined"
                startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleToggleBookmark}
                sx={{
                  borderColor: bookmarked ? '#f59e0b' : theme.palette.divider,
                  color: bookmarked ? '#f59e0b' : 'text.secondary',
                  '&:hover': {
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                  },
                }}
              >
                {bookmarked
                  ? (language === 'ko' ? '북마크됨' : 'Bookmarked')
                  : (language === 'ko' ? '북마크' : 'Bookmark')}
              </Button>

              {/* Share */}
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                  },
                }}
              >
                {language === 'ko' ? '공유' : 'Share'}
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? '#1a1a1a' : '#fff',
            }}
          >
            <CommentSection contentId={id} />
          </Paper>
        </motion.div>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#f59e0b',
            color: '#fff',
            fontWeight: 500,
            borderRadius: 2,
          },
        }}
      />

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
