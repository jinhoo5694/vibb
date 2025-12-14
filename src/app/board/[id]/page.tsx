'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  TextField,
  Paper,
  useTheme,
  CircularProgress,
  Breadcrumbs,
  Pagination,
} from '@mui/material';
import {
  ArrowUpward as UpvoteIcon,
  ArrowDownward as DownvoteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  ArrowBack as BackIcon,
  MoreVert as MoreIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  NavigateNext as NavigateNextIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Post, categoryColors, categoryIcons, PostCategory } from '@/types/post';
import { samplePosts, getNewPosts, filterByCategory } from '@/data/posts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ReportDialog } from '@/components/Community/ReportDialog';
import { PostNavigationList } from '@/components/Community/PostNavigationList';

// Sample comments data
interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  upvotes: number;
  replies?: Comment[];
}

const generateSampleComments = (count: number): Comment[] => {
  const commentAuthors = [
    '개발자A', 'ㅇㅇ', '바이브러', '클로드팬', '코딩마스터',
    '뉴비개발자', '시니어개발자', '풀스택러', 'AI덕후', '프론트엔드러'
  ];

  const commentContents = [
    '완전 공감합니다 ㅋㅋㅋ',
    '저도 같은 경험 했어요!',
    '이거 진짜 꿀팁이네요',
    'ㅋㅋㅋㅋ 웃겨서 댓글 달고 감',
    '오 좋은 정보 감사합니다',
    '저는 좀 다른 의견인데...',
    '이거 어떻게 하는건지 더 자세히 알 수 있을까요?',
    '대박 ㅋㅋㅋㅋ',
    '저도 써봐야겠네요',
    '공감 100번 클릭',
    'ㄹㅇ 팩트',
    '이게 바로 바이브코딩이지',
    '오늘도 좋은 하루 되세요~',
    '저만 그런게 아니었군요 ㅋㅋ',
    '꿀정보 감사해요!',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${i + 1}`,
    author: {
      name: commentAuthors[Math.floor(Math.random() * commentAuthors.length)],
    },
    content: commentContents[Math.floor(Math.random() * commentContents.length)],
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24),
    upvotes: Math.floor(Math.random() * 50),
  }));
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);

  const postId = params.id as string;
  const POSTS_PER_PAGE = 15;
  const COMMENTS_PER_PAGE = 20;

  // Get all posts sorted by date for navigation
  const allPosts = useMemo(() => getNewPosts(samplePosts), []);

  // Calculate which page the current post is on
  useEffect(() => {
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      const page = Math.floor(postIndex / POSTS_PER_PAGE) + 1;
      setCurrentPage(page);
    }
  }, [postId, allPosts]);

  // Get posts for current page
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [allPosts, currentPage]);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  // Comment pagination
  const paginatedComments = useMemo(() => {
    const startIndex = (commentPage - 1) * COMMENTS_PER_PAGE;
    return comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);
  }, [comments, commentPage]);

  const totalCommentPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);

  useEffect(() => {
    // Find post from sample data
    const foundPost = samplePosts.find(p => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      // Generate sample comments based on comment count
      setComments(generateSampleComments(foundPost.commentCount));
    }
    setLoading(false);
  }, [postId]);

  const handleReportComment = (commentId: string) => {
    setReportTargetId(commentId);
    setReportDialogOpen(true);
  };

  const handleReportSubmit = (reason: string, detail?: string) => {
    // In production, this would call an API to submit the report
    console.log('Report submitted:', { targetId: reportTargetId, reason, detail });
    // Show success feedback (could add a snackbar here)
  };

  const handleVote = (type: 'up' | 'down') => {
    if (!post) return;

    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }
  };

  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return;

    const newCommentObj: Comment = {
      id: `comment-new-${Date.now()}`,
      author: {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url,
      },
      content: newComment,
      createdAt: new Date(),
      upvotes: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setCommentPage(1); // Go to first page to see new comment
  };

  const score = useMemo(() => {
    if (!post) return 0;
    let baseScore = post.upvotes - post.downvotes;
    if (userVote === 'up') baseScore += 1;
    if (userVote === 'down') baseScore -= 1;
    return baseScore;
  }, [post, userVote]);

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {language === 'ko' ? '게시글을 찾을 수 없습니다' : 'Post not found'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            sx={{ mt: 2 }}
          >
            {language === 'ko' ? '돌아가기' : 'Go Back'}
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  const categoryColor = categoryColors[post.category];
  const categoryIcon = categoryIcons[post.category];
  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ko });
  const fullDate = format(post.createdAt, 'yyyy년 M월 d일 HH:mm', { locale: ko });

  // Determine board link based on category
  const getBoardLink = (category: PostCategory) => {
    switch (category) {
      case '스킬': return '/skills/board';
      case 'MCP': return '/mcp/board';
      case '프롬프트': return '/prompt/board';
      case 'AI 코딩 툴': return '/ai-tools/board';
      default: return '/board';
    }
  };

  return (
    <>
      <Header />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
            {language === 'ko' ? '홈' : 'Home'}
          </Link>
          <Link href={getBoardLink(post.category)} style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
            {post.category}
          </Link>
          <Typography color="text.primary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </Typography>
        </Breadcrumbs>

        {/* Main Post Card */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          {/* Post Header */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            {/* Category & Pin */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={`${categoryIcon} ${post.category}`}
                size="small"
                sx={{
                  bgcolor: `${categoryColor}20`,
                  color: categoryColor,
                  fontWeight: 600,
                }}
              />
              {post.isPinned && (
                <Chip
                  label={language === 'ko' ? '공지' : 'Pinned'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 107, 53, 0.1)',
                    color: '#ff6b35',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, wordBreak: 'break-word' }}>
              {post.title}
            </Typography>

            {/* Author Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }}>
                  {post.author.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {post.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fullDate} ({timeAgo})
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small">
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Post Content */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: 100,
              }}
            >
              {post.content}
            </Typography>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 4, flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.divider,
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Post Actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' ? '#141414' : '#f8f9fa',
            }}
          >
            {/* Vote Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant={userVote === 'up' ? 'contained' : 'outlined'}
                size="small"
                startIcon={<UpvoteIcon />}
                onClick={() => handleVote('up')}
                sx={{
                  minWidth: 'auto',
                  color: userVote === 'up' ? '#fff' : '#ff4500',
                  borderColor: '#ff4500',
                  bgcolor: userVote === 'up' ? '#ff4500' : 'transparent',
                  '&:hover': {
                    bgcolor: userVote === 'up' ? '#e03d00' : 'rgba(255, 69, 0, 0.1)',
                    borderColor: '#ff4500',
                  },
                }}
              >
                {language === 'ko' ? '추천' : 'Upvote'}
              </Button>
              <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
                {score}
              </Typography>
              <Button
                variant={userVote === 'down' ? 'contained' : 'outlined'}
                size="small"
                startIcon={<DownvoteIcon />}
                onClick={() => handleVote('down')}
                sx={{
                  minWidth: 'auto',
                  color: userVote === 'down' ? '#fff' : '#7193ff',
                  borderColor: '#7193ff',
                  bgcolor: userVote === 'down' ? '#7193ff' : 'transparent',
                  '&:hover': {
                    bgcolor: userVote === 'down' ? '#5a7de6' : 'rgba(113, 147, 255, 0.1)',
                    borderColor: '#7193ff',
                  },
                }}
              >
                {language === 'ko' ? '비추' : 'Downvote'}
              </Button>
            </Box>

            {/* Other Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                startIcon={<CommentIcon />}
                sx={{ color: 'text.secondary' }}
              >
                {comments.length}
              </Button>
              <IconButton
                size="small"
                onClick={() => setIsBookmarked(!isBookmarked)}
                sx={{ color: isBookmarked ? theme.palette.primary.main : 'text.secondary' }}
              >
                {isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Comments Section */}
        <Box sx={{ mt: 4 }}>
          {/* Comment Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {language === 'ko' ? '댓글' : 'Comments'} ({comments.length})
            </Typography>
          </Box>

          {/* New Comment Input */}
          <Box sx={{ mb: 3 }}>
            {user ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar src={user.user_metadata?.avatar_url} sx={{ width: 40, height: 40 }}>
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={language === 'ko' ? '댓글을 입력하세요...' : 'Write a comment...'}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                    >
                      {language === 'ko' ? '댓글 등록' : 'Post Comment'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ko' ? '댓글을 작성하려면 로그인하세요' : 'Sign in to write a comment'}
                </Typography>
                <Button variant="outlined" size="small">
                  {language === 'ko' ? '로그인' : 'Sign In'}
                </Button>
              </Box>
            )}
          </Box>

          {/* Comments List */}
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
            {comments.length > 0 ? (
              <>
                {paginatedComments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                  >
                    <Box
                      sx={{
                        py: 1,
                        px: 0.5,
                        borderBottom: index < paginatedComments.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <Avatar src={comment.author.avatar} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {comment.author.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                              {comment.author.name}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ko })}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4, my: 0.25, wordBreak: 'break-word' }}>
                            {comment.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <Button
                              size="small"
                              startIcon={<ThumbUpOutlinedIcon sx={{ fontSize: 12 }} />}
                              sx={{ color: 'text.secondary', minWidth: 'auto', p: 0.25, fontSize: '0.7rem', minHeight: 'auto' }}
                            >
                              {comment.upvotes > 0 && comment.upvotes}
                            </Button>
                            <Button
                              size="small"
                              sx={{ color: 'text.secondary', minWidth: 'auto', p: 0.25, fontSize: '0.7rem', minHeight: 'auto' }}
                            >
                              {language === 'ko' ? '답글' : 'Reply'}
                            </Button>
                            <Button
                              size="small"
                              startIcon={<FlagIcon sx={{ fontSize: 10 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReportComment(comment.id);
                              }}
                              sx={{ color: 'text.disabled', minWidth: 'auto', p: 0.25, fontSize: '0.7rem', minHeight: 'auto' }}
                            >
                              {language === 'ko' ? '신고' : 'Report'}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
                {/* Comment Pagination */}
                {totalCommentPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                      py: 2,
                      mt: 1,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {language === 'ko'
                        ? `${comments.length}개의 댓글 중 ${(commentPage - 1) * COMMENTS_PER_PAGE + 1}-${Math.min(commentPage * COMMENTS_PER_PAGE, comments.length)}번째`
                        : `${(commentPage - 1) * COMMENTS_PER_PAGE + 1}-${Math.min(commentPage * COMMENTS_PER_PAGE, comments.length)} of ${comments.length} comments`}
                    </Typography>
                    <Pagination
                      count={totalCommentPages}
                      page={commentPage}
                      onChange={(_, page) => setCommentPage(page)}
                      size="small"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: '0.8rem',
                        },
                        '& .Mui-selected': {
                          bgcolor: '#ff6b35 !important',
                          color: '#fff',
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ko' ? '아직 댓글이 없습니다. 첫 댓글을 작성해보세요!' : 'No comments yet. Be the first to comment!'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Post Navigation List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {language === 'ko' ? '게시글 목록' : 'Post List'}
          </Typography>
          <PostNavigationList
            posts={paginatedPosts}
            currentPostId={postId}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Box>

        {/* Back Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.push('/board')}
          >
            {language === 'ko' ? '목록으로' : 'Back to List'}
          </Button>
        </Box>
      </Container>

      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
        targetType="comment"
      />

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
