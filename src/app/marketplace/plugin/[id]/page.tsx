'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Avatar,
  Grid,
  useTheme,
  CircularProgress,
  Alert,
  Divider,
  Rating,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ThumbUp as UpvoteIcon,
  ThumbDown as DownvoteIcon,
  Visibility as ViewIcon,
  ChatBubbleOutline as CommentIcon,
  GitHub as GitHubIcon,
  MenuBook as DocsIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Flag as ReportIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { CommentSection } from '@/components/Comments/CommentSection';
import { ReportDialog } from '@/components/Community/ReportDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPluginById,
  getPluginContents,
  getPluginLicense,
  incrementPluginViewCount,
  getPluginAverageRating,
  toggleVote,
  getUserVote,
  toggleBookmark,
  hasUserBookmarked,
} from '@/services/supabase';
import { PluginWithCategory, PluginContent, PluginLicense } from '@/types/plugin';

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const pluginId = params.id as string;

  // Category translations
  const categoryTranslations: Record<string, string> = {
    'Development': '개발',
    'LSP': '언어 서버',
    'Automation': '자동화',
    'Security': '보안',
    'Design': '디자인',
    'Utility': '유틸리티',
  };

  const getLocalizedCategory = (category: string | null) => {
    if (!category) return '';
    if (language === 'ko' && categoryTranslations[category]) {
      return categoryTranslations[category];
    }
    return category;
  };

  // State
  const [plugin, setPlugin] = useState<PluginWithCategory | null>(null);
  const [contents, setContents] = useState<PluginContent[]>([]);
  const [license, setLicense] = useState<PluginLicense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  // User interaction state
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [copiedInstall, setCopiedInstall] = useState(false);

  // Toast notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Report dialog
  const [reportOpen, setReportOpen] = useState(false);

  // Copy to clipboard with toast notification
  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(successMessage || (language === 'ko' ? '클립보드에 복사되었습니다' : 'Copied to clipboard'));
      setSnackbarOpen(true);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Fetch plugin data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [pluginData, contentsData, licenseData, rating] = await Promise.all([
          getPluginById(pluginId),
          getPluginContents(pluginId),
          getPluginLicense(pluginId),
          getPluginAverageRating(pluginId),
        ]);

        if (!pluginData) {
          setError(language === 'ko' ? '플러그인을 찾을 수 없습니다.' : 'Plugin not found.');
          return;
        }

        setPlugin(pluginData);
        setContents(contentsData);
        setLicense(licenseData);
        setAverageRating(rating);
        setUpvoteCount(pluginData.upvote_count || 0);
        setDownvoteCount(pluginData.downvote_count || 0);

        // Increment view count
        incrementPluginViewCount(pluginId);

        // Fetch user-specific data
        if (user) {
          const [vote, bookmarked] = await Promise.all([
            getUserVote(user.id, pluginId),
            hasUserBookmarked(user.id, pluginId),
          ]);
          setUserVote(vote);
          setIsBookmarked(bookmarked);
        }
      } catch (err) {
        console.error('Error fetching plugin:', err);
        setError(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pluginId, user, language]);

  // Handle vote
  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert(language === 'ko' ? '로그인이 필요합니다.' : 'Please sign in.');
      return;
    }

    try {
      const result = await toggleVote(user.id, pluginId, voteType);
      setUserVote(result.voted);
      setUpvoteCount(result.upvoteCount);
      setDownvoteCount(result.downvoteCount);
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  // Handle bookmark
  const handleBookmark = async () => {
    if (!user) {
      alert(language === 'ko' ? '로그인이 필요합니다.' : 'Please sign in.');
      return;
    }

    try {
      const result = await toggleBookmark(user.id, pluginId);
      setIsBookmarked(result.action === 'added');
    } catch (err) {
      console.error('Error bookmarking:', err);
    }
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: plugin?.title || 'Plugin',
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setSnackbarMessage(language === 'ko' ? '링크가 복사되었습니다' : 'Link copied to clipboard');
      setSnackbarOpen(true);
    }
  };

  // Copy install command
  const handleCopyInstall = async () => {
    const installCmd = plugin?.install_command || `/plugin install ${plugin?.title.toLowerCase().replace(/\s+/g, '-')}`;
    await copyToClipboard(
      installCmd,
      language === 'ko' ? '설치 명령어가 복사되었습니다' : 'Install command copied'
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#9333ea' }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (error || !plugin) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 12 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/marketplace')}
            sx={{ mt: 2 }}
          >
            {language === 'ko' ? '마켓플레이스로 돌아가기' : 'Back to Marketplace'}
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          pt: { xs: 10, sm: 12 },
          pb: 8,
          bgcolor: isDark ? '#121212' : '#f8f9fa',
        }}
      >
        <Container maxWidth="lg">
          {/* Back button */}
          <Button
            component={Link}
            href="/marketplace"
            startIcon={<BackIcon />}
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            {language === 'ko' ? '마켓플레이스' : 'Marketplace'}
          </Button>

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Left Column - Plugin Info */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Header Card */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? '#1a1a1a' : '#ffffff',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                  <Avatar
                    sx={{
                      width: { xs: 56, sm: 64 },
                      height: { xs: 56, sm: 64 },
                      bgcolor: '#9333ea',
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      flexShrink: 0,
                    }}
                  >
                    {plugin.icon || plugin.title.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        wordBreak: 'break-word',
                      }}
                    >
                      {plugin.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {plugin.version && (
                        <Chip label={`v${plugin.version}`} size="small" variant="outlined" sx={{ height: 24 }} />
                      )}
                      {plugin.license_type && (
                        <Chip label={plugin.license_type} size="small" variant="outlined" sx={{ height: 24 }} />
                      )}
                      {plugin.category && (
                        <Chip label={getLocalizedCategory(plugin.category)} size="small" sx={{ bgcolor: '#9333ea', color: '#fff', height: 24 }} />
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Author */}
                {plugin.author_name && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {language === 'ko' ? '제작자: ' : 'By: '}{plugin.author_name}
                  </Typography>
                )}

                {/* Description */}
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                  {language === 'en' && plugin.subtitle_en ? plugin.subtitle_en : plugin.subtitle}
                </Typography>

                {/* Rating */}
                {averageRating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={averageRating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({averageRating.toFixed(1)})
                    </Typography>
                  </Box>
                )}

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<UpvoteIcon sx={{ fontSize: '16px !important' }} />}
                    label={upvoteCount}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 28,
                      '& .MuiChip-icon': {
                        color: '#9333ea',
                        ml: 0.5,
                      },
                    }}
                  />
                  <Chip
                    icon={<ViewIcon sx={{ fontSize: '16px !important' }} />}
                    label={plugin.view_count || 0}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 28,
                      '& .MuiChip-icon': {
                        ml: 0.5,
                      },
                    }}
                  />
                  <Chip
                    icon={<CommentIcon sx={{ fontSize: '16px !important' }} />}
                    label={plugin.comments_count || 0}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 28,
                      '& .MuiChip-icon': {
                        ml: 0.5,
                      },
                    }}
                  />
                </Box>
              </Paper>

              {/* Content Sections */}
              {contents.map((section, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: isDark ? '#1a1a1a' : '#ffffff',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
                  >
                    {section.content}
                  </Typography>
                </Paper>
              ))}

              {/* Install Command */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? '#1a1a1a' : '#ffffff',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#9333ea' }}>
                  {language === 'ko' ? '설치 방법' : 'Installation'}
                </Typography>

                {/* Step 1: Add marketplace if GitHub URL exists */}
                {plugin.github_url && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                      {language === 'ko' ? '1. 마켓플레이스 추가 (최초 1회)' : '1. Add Marketplace (first time only)'}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1.5,
                        bgcolor: isDark ? '#0a0a0a' : '#1e1e1e',
                        borderRadius: 1.5,
                        border: `1px solid ${isDark ? '#333' : '#333'}`,
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: 'monospace',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: '#dcdcaa',
                          overflow: 'auto',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        /plugin marketplace add {plugin.github_url.replace('https://github.com/', '')}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const cmd = `/plugin marketplace add ${plugin.github_url?.replace('https://github.com/', '')}`;
                          copyToClipboard(
                            cmd,
                            language === 'ko' ? '마켓플레이스 추가 명령어가 복사되었습니다' : 'Marketplace add command copied'
                          );
                        }}
                        sx={{
                          color: '#9cdcfe',
                          flexShrink: 0,
                          '&:hover': { bgcolor: 'rgba(156, 220, 254, 0.1)' },
                        }}
                      >
                        {copiedInstall ? <CheckIcon sx={{ color: '#4ade80', fontSize: 20 }} /> : <CopyIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {/* Step 2: Install plugin */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                    {language === 'ko' ? (plugin.github_url ? '2. 플러그인 설치' : '플러그인 설치') : (plugin.github_url ? '2. Install Plugin' : 'Install Plugin')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.5,
                      bgcolor: isDark ? '#0a0a0a' : '#1e1e1e',
                      borderRadius: 1.5,
                      border: `1px solid ${isDark ? '#333' : '#333'}`,
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: '#dcdcaa',
                        overflow: 'auto',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {plugin.install_command || `/plugin install ${plugin.title.toLowerCase().replace(/\s+/g, '-')}`}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleCopyInstall}
                      sx={{
                        color: '#9cdcfe',
                        flexShrink: 0,
                        '&:hover': { bgcolor: 'rgba(156, 220, 254, 0.1)' },
                      }}
                    >
                      {copiedInstall ? <CheckIcon sx={{ color: '#4ade80', fontSize: 20 }} /> : <CopyIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Step 3: Usage hint */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                    {language === 'ko' ? (plugin.github_url ? '3. 사용하기' : '사용하기') : (plugin.github_url ? '3. Use Plugin' : 'Use Plugin')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.5,
                      bgcolor: isDark ? '#0a0a0a' : '#1e1e1e',
                      borderRadius: 1.5,
                      border: `1px solid ${isDark ? '#333' : '#333'}`,
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: '#dcdcaa',
                        overflow: 'auto',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      /{plugin.title.toLowerCase().replace(/\s+/g, '-')}:help
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const cmd = `/${plugin.title.toLowerCase().replace(/\s+/g, '-')}:help`;
                        copyToClipboard(
                          cmd,
                          language === 'ko' ? '사용법 명령어가 복사되었습니다' : 'Usage command copied'
                        );
                      }}
                      sx={{
                        color: '#9cdcfe',
                        flexShrink: 0,
                        '&:hover': { bgcolor: 'rgba(156, 220, 254, 0.1)' },
                      }}
                    >
                      <CopyIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', pl: 0.5 }}>
                    {language === 'ko'
                      ? '설치 후 위 명령어로 플러그인의 사용 가능한 명령어를 확인하세요.'
                      : 'After installation, use this command to see available plugin commands.'}
                  </Typography>
                </Box>
              </Paper>

              {/* Comments Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? '#1a1a1a' : '#ffffff',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {language === 'ko' ? '리뷰' : 'Reviews'}
                </Typography>
                <CommentSection contentId={pluginId} />
              </Paper>
            </Grid>

            {/* Right Column - Actions */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? '#1a1a1a' : '#ffffff',
                  position: 'sticky',
                  top: 100,
                }}
              >
                {/* Vote Buttons */}
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  {language === 'ko' ? '이 플러그인이 유용하셨나요?' : 'Was this plugin helpful?'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                  <Button
                    variant={userVote === 'upvote' ? 'contained' : 'outlined'}
                    startIcon={<UpvoteIcon sx={{ fontSize: 18 }} />}
                    onClick={() => handleVote('upvote')}
                    sx={{
                      flex: 1,
                      py: 1,
                      bgcolor: userVote === 'upvote' ? '#9333ea' : undefined,
                      borderColor: userVote === 'upvote' ? '#9333ea' : theme.palette.divider,
                      color: userVote === 'upvote' ? '#fff' : undefined,
                      '&:hover': {
                        bgcolor: userVote === 'upvote' ? '#7e22ce' : 'rgba(147, 51, 234, 0.08)',
                        borderColor: '#9333ea',
                      },
                    }}
                  >
                    {upvoteCount}
                  </Button>
                  <Button
                    variant={userVote === 'downvote' ? 'contained' : 'outlined'}
                    startIcon={<DownvoteIcon sx={{ fontSize: 18 }} />}
                    onClick={() => handleVote('downvote')}
                    sx={{
                      flex: 1,
                      py: 1,
                      borderColor: userVote === 'downvote' ? theme.palette.error.main : theme.palette.divider,
                      bgcolor: userVote === 'downvote' ? theme.palette.error.main : undefined,
                      '&:hover': {
                        bgcolor: userVote === 'downvote' ? theme.palette.error.dark : 'rgba(239, 68, 68, 0.08)',
                        borderColor: theme.palette.error.main,
                      },
                    }}
                  >
                    {downvoteCount}
                  </Button>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {plugin.github_url && (
                    <Button
                      variant="outlined"
                      startIcon={<GitHubIcon sx={{ fontSize: 20 }} />}
                      href={plugin.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{
                        py: 1,
                        borderColor: theme.palette.divider,
                        justifyContent: 'flex-start',
                        pl: 2,
                        '&:hover': { borderColor: '#9333ea', bgcolor: 'rgba(147, 51, 234, 0.04)' },
                      }}
                    >
                      {language === 'ko' ? '깃허브' : 'GitHub'}
                    </Button>
                  )}
                  {plugin.documentation_url && (
                    <Button
                      variant="outlined"
                      startIcon={<DocsIcon sx={{ fontSize: 20 }} />}
                      href={plugin.documentation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{
                        py: 1,
                        borderColor: theme.palette.divider,
                        justifyContent: 'flex-start',
                        pl: 2,
                        '&:hover': { borderColor: '#9333ea', bgcolor: 'rgba(147, 51, 234, 0.04)' },
                      }}
                    >
                      {language === 'ko' ? '문서' : 'Documentation'}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={isBookmarked ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkBorderIcon sx={{ fontSize: 20 }} />}
                    onClick={handleBookmark}
                    fullWidth
                    sx={{
                      py: 1,
                      justifyContent: 'flex-start',
                      pl: 2,
                      color: isBookmarked ? '#9333ea' : undefined,
                      borderColor: isBookmarked ? '#9333ea' : theme.palette.divider,
                      '&:hover': { borderColor: '#9333ea', bgcolor: 'rgba(147, 51, 234, 0.04)' },
                    }}
                  >
                    {language === 'ko' ? '북마크' : 'Bookmark'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ShareIcon sx={{ fontSize: 20 }} />}
                    onClick={handleShare}
                    fullWidth
                    sx={{
                      py: 1,
                      borderColor: theme.palette.divider,
                      justifyContent: 'flex-start',
                      pl: 2,
                      '&:hover': { borderColor: '#9333ea', bgcolor: 'rgba(147, 51, 234, 0.04)' },
                    }}
                  >
                    {language === 'ko' ? '공유' : 'Share'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ReportIcon sx={{ fontSize: 20 }} />}
                    onClick={() => setReportOpen(true)}
                    fullWidth
                    color="error"
                    sx={{
                      py: 1,
                      justifyContent: 'flex-start',
                      pl: 2,
                    }}
                  >
                    {language === 'ko' ? '신고' : 'Report'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />

      {/* Report Dialog */}
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="content"
        targetId={pluginId}
      />

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
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
