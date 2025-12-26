'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
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
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbUp as ThumbUpIcon,
  NavigateNext as NavigateNextIcon,
  Flag as FlagIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Post, categoryColors, categoryIcons, PostCategory } from '@/types/post';
import { ReviewWithUser } from '@/types/database';
import { getPostById, getBoardPosts, getPostComments, addPostComment, deletePost, deletePostComment, addReply, deleteReply, incrementViewCount } from '@/services/supabase';
import { createClient } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ReportDialog } from '@/components/Community/ReportDialog';
import { PostNavigationList } from '@/components/Community/PostNavigationList';
import { useExternalLink } from '@/contexts/ExternalLinkContext';

// Parse markdown to render content with code blocks and links
function MarkdownPreview({ content, isDark }: { content: string; isDark: boolean }) {
  const theme = useTheme();
  const { openExternalLink } = useExternalLink();

  // Helper to parse text and convert raw URLs to clickable links
  const parseTextWithUrls = (text: string, keyStart: number): { elements: React.ReactNode[]; keyEnd: number } => {
    const elements: React.ReactNode[] = [];
    let key = keyStart;

    // Regex to match raw URLs (not inside markdown link syntax)
    const urlRegex = /(https?:\/\/[^\s<>[\]()]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        elements.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
      }

      const url = match[1];
      elements.push(
        <Typography
          key={key++}
          component="span"
          onClick={() => {
            console.log('[MarkdownPreview] Raw URL clicked:', url);
            openExternalLink(url);
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#ff6b35',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <LinkIcon sx={{ fontSize: 14 }} />
          {url.length > 50 ? url.slice(0, 50) + '...' : url}
        </Typography>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    return { elements, keyEnd: key };
  };

  const parseContent = (text: string) => {
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'code', content: match[2], language: match[1] || 'text' });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    parts.forEach((part) => {
      if (part.type === 'code') {
        elements.push(
          <Box key={key++} sx={{ my: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '4px 4px 0 0',
                border: `1px solid ${theme.palette.divider}`,
                borderBottom: 'none',
              }}
            >
              <CodeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {part.language}
              </Typography>
            </Box>
            <SyntaxHighlighter
              language={part.language}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0 0 4px 4px',
                border: `1px solid ${theme.palette.divider}`,
                borderTop: 'none',
                fontSize: '0.85rem',
              }}
            >
              {part.content.trim()}
            </SyntaxHighlighter>
          </Box>
        );
      } else {
        const textContent = part.content;
        const textElements: React.ReactNode[] = [];
        let textLastIndex = 0;
        let linkMatch;

        // Helper to add text with raw URL parsing
        const addTextWithUrls = (text: string) => {
          text.split('\n').forEach((line, i, arr) => {
            if (line.trim()) {
              const { elements: lineElements, keyEnd } = parseTextWithUrls(line, key);
              textElements.push(...lineElements);
              key = keyEnd;
            }
            if (i < arr.length - 1) {
              textElements.push(<br key={key++} />);
            }
          });
        };

        const linkRegexLocal = /\[([^\]]+)\]\(([^)]+)\)/g;
        while ((linkMatch = linkRegexLocal.exec(textContent)) !== null) {
          if (linkMatch.index > textLastIndex) {
            const beforeText = textContent.slice(textLastIndex, linkMatch.index);
            addTextWithUrls(beforeText);
          }
          const linkUrl = linkMatch[2];
          const linkText = linkMatch[1];
          const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');

          textElements.push(
            <Typography
              key={key++}
              component="span"
              onClick={() => {
                console.log('[MarkdownPreview] Markdown link clicked:', linkUrl, 'isExternal:', isExternal);
                if (isExternal) {
                  openExternalLink(linkUrl);
                } else {
                  window.location.href = linkUrl;
                }
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#ff6b35',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <LinkIcon sx={{ fontSize: 14 }} />
              {linkText}
            </Typography>
          );
          textLastIndex = linkMatch.index + linkMatch[0].length;
        }

        if (textLastIndex < textContent.length) {
          const remainingText = textContent.slice(textLastIndex);
          addTextWithUrls(remainingText);
        }

        if (textElements.length > 0) {
          elements.push(
            <Typography key={key++} component="div" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {textElements}
            </Typography>
          );
        }
      }
    });

    return elements;
  };

  if (!content.trim()) {
    return null;
  }

  console.log('[MarkdownPreview] Rendering content:', content);
  return <Box>{parseContent(content)}</Box>;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const viewCountedRef = useRef(false);
  const [comments, setComments] = useState<ReviewWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<string>('');
  const [reportTargetType, setReportTargetType] = useState<'content' | 'review' | 'user'>('review');
  const [currentPage, setCurrentPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [commentSort, setCommentSort] = useState<'popular' | 'newest'>('popular');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const postId = params.id as string;
  const POSTS_PER_PAGE = 15;
  const COMMENTS_PER_PAGE = 20;

  // State for all posts (for navigation)
  const [allPosts, setAllPosts] = useState<Post[]>([]);

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

  // Sort and paginate comments
  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    if (commentSort === 'popular') {
      // For now, sort by rating since we don't have upvotes on comments
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }
    return sorted;
  }, [comments, commentSort]);

  const paginatedComments = useMemo(() => {
    const startIndex = (commentPage - 1) * COMMENTS_PER_PAGE;
    return sortedComments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);
  }, [sortedComments, commentPage]);

  const totalCommentPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);

  // Reset comment page when sort changes
  useEffect(() => {
    setCommentPage(1);
  }, [commentSort]);

  // Fetch user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        return;
      }

      const supabase = createClient();
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setUserRole(profileData.role);
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch post from Supabase
        const foundPost = await getPostById(postId);
        if (foundPost) {
          setPost(foundPost);
          // Increment view count (only once per page load)
          if (!viewCountedRef.current) {
            viewCountedRef.current = true;
            incrementViewCount(postId);
          }
        }

        // Fetch comments from Supabase
        const fetchedComments = await getPostComments(postId);
        setComments(fetchedComments);

        // Fetch all posts for navigation list
        const posts = await getBoardPosts('general', { sortBy: 'new' });
        setAllPosts(posts);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // Fetch user's current vote status
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!user || !postId) {
        setUserVote(null);
        return;
      }

      try {
        const { getUserVote } = await import('@/services/supabase');
        const vote = await getUserVote(user.id, postId);
        if (vote === 'upvote') {
          setUserVote('up');
        } else if (vote === 'downvote') {
          setUserVote('down');
        } else {
          setUserVote(null);
        }
      } catch (error) {
        console.error('Error fetching user vote:', error);
      }
    };

    fetchUserVote();
  }, [user, postId]);

  // Fetch user's bookmark status
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!user || !postId) {
        setIsBookmarked(false);
        return;
      }

      try {
        const { hasUserBookmarked } = await import('@/services/supabase');
        const bookmarked = await hasUserBookmarked(user.id, postId);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchBookmarkStatus();
  }, [user, postId]);

  const handleToggleBookmark = async () => {
    if (!user) {
      alert(language === 'ko' ? '로그인이 필요합니다.' : 'Please sign in to bookmark.');
      return;
    }

    try {
      const { toggleBookmark } = await import('@/services/supabase');
      const result = await toggleBookmark(user.id, postId);
      setIsBookmarked(result.bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Fetch which comments the user has liked
  useEffect(() => {
    const fetchLikedComments = async () => {
      if (!user || comments.length === 0) {
        setLikedComments(new Set());
        return;
      }

      try {
        const { hasUserLikedReview } = await import('@/services/supabase');
        const liked = new Set<string>();

        await Promise.all(
          comments.map(async (comment) => {
            const isLiked = await hasUserLikedReview(user.id, comment.id);
            if (isLiked) {
              liked.add(comment.id);
            }
          })
        );

        setLikedComments(liked);
      } catch (error) {
        console.error('Error fetching liked comments:', error);
      }
    };

    fetchLikedComments();
  }, [user, comments]);

  const handleToggleCommentLike = async (commentId: string) => {
    if (!user) {
      alert(language === 'ko' ? '로그인이 필요합니다.' : 'Please sign in to like.');
      return;
    }

    try {
      const { toggleReviewLike } = await import('@/services/supabase');
      const result = await toggleReviewLike(commentId);

      if (result.success) {
        setLikedComments(prev => {
          const newSet = new Set(prev);
          if (result.action === 'liked') {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  // Check if current user is admin
  const isAdmin = userRole === 'admin';

  // Check if current user is the post author
  const isPostAuthor = user && post?.author?.id === user.id;

  // Check if user can edit/delete the post
  const canEditPost = isAdmin || isPostAuthor;

  // Check if user can delete a specific comment
  const canDeleteComment = (comment: ReviewWithUser) => {
    if (!user) return false;
    if (isAdmin) return true;
    return comment.user_id === user.id;
  };

  const handleReportComment = (commentId: string) => {
    setReportTargetId(commentId);
    setReportTargetType('review');
    setReportDialogOpen(true);
  };

  const handleReportPost = () => {
    if (!post) return;
    setReportTargetId(post.id);
    setReportTargetType('content');
    setReportDialogOpen(true);
  };

  const handleDeletePost = async () => {
    if (!post || !user || deletingPost) return;

    const confirmMessage = language === 'ko'
      ? '정말로 이 게시글을 삭제하시겠습니까?'
      : 'Are you sure you want to delete this post?';

    if (!confirm(confirmMessage)) return;

    setDeletingPost(true);
    try {
      const success = await deletePost(post.id, user.id, isAdmin);
      if (success) {
        router.push('/board');
      } else {
        alert(language === 'ko' ? '게시글 삭제에 실패했습니다.' : 'Failed to delete post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(language === 'ko' ? '게시글 삭제 중 오류가 발생했습니다.' : 'An error occurred while deleting the post.');
    } finally {
      setDeletingPost(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || deletingCommentId) return;

    const confirmMessage = language === 'ko'
      ? '정말로 이 댓글을 삭제하시겠습니까?'
      : 'Are you sure you want to delete this comment?';

    if (!confirm(confirmMessage)) return;

    setDeletingCommentId(commentId);
    try {
      const success = await deletePostComment(commentId);
      if (success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
      } else {
        alert(language === 'ko' ? '댓글 삭제에 실패했습니다.' : 'Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(language === 'ko' ? '댓글 삭제 중 오류가 발생했습니다.' : 'An error occurred while deleting the comment.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleReplyClick = (commentId: string) => {
    if (replyingToCommentId === commentId) {
      // Toggle off
      setReplyingToCommentId(null);
      setReplyText('');
    } else {
      // Toggle on
      setReplyingToCommentId(commentId);
      setReplyText('');
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim() || !user || submittingReply) return;

    setSubmittingReply(true);
    try {
      const result = await addReply(user.id, commentId, replyText.trim());
      if (result) {
        // Refetch comments to get the updated data
        const updatedComments = await getPostComments(postId);
        setComments(updatedComments);
        setReplyText('');
        setReplyingToCommentId(null);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert(language === 'ko' ? '답글 등록에 실패했습니다.' : 'Failed to add reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!user || deletingReplyId) return;

    const confirmMessage = language === 'ko'
      ? '정말로 이 답글을 삭제하시겠습니까?'
      : 'Are you sure you want to delete this reply?';

    if (!confirm(confirmMessage)) return;

    setDeletingReplyId(replyId);
    try {
      const success = await deleteReply(replyId);
      if (success) {
        // Refetch comments to get the updated data
        const updatedComments = await getPostComments(postId);
        setComments(updatedComments);
      } else {
        alert(language === 'ko' ? '답글 삭제에 실패했습니다.' : 'Failed to delete reply.');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert(language === 'ko' ? '답글 삭제 중 오류가 발생했습니다.' : 'An error occurred while deleting the reply.');
    } finally {
      setDeletingReplyId(null);
    }
  };

  // Check if user can delete a specific reply
  const canDeleteReply = (reply: { user_id: string }) => {
    if (!user) return false;
    if (isAdmin) return true;
    return reply.user_id === user.id;
  };

  const handleReportSubmit = (reason: string, detail?: string) => {
    // In production, this would call an API to submit the report
    console.log('Report submitted:', { targetId: reportTargetId, reason, detail });
    // Show success feedback (could add a snackbar here)
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!post || !user) {
      alert(language === 'ko' ? '로그인이 필요합니다.' : 'Please sign in to vote.');
      return;
    }

    try {
      const { votePost } = await import('@/services/supabase');
      const result = await votePost(user.id, post.id, type);

      if (result.success) {
        // Update local state based on the result
        if (result.action === 'removed') {
          setUserVote(null);
        } else {
          setUserVote(type);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || submittingComment) return;

    setSubmittingComment(true);
    try {
      const result = await addPostComment(user.id, postId, newComment.trim());
      if (result) {
        // Refetch comments to get the full data with user info
        const updatedComments = await getPostComments(postId);
        setComments(updatedComments);
        setNewComment('');
        setCommentPage(1); // Go to first page to see new comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
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
              <Box
                component={post.author.id ? Link : 'div'}
                href={post.author.id ? `/profile/${post.author.id}` : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  textDecoration: 'none',
                  color: 'inherit',
                  ...(post.author.id && {
                    cursor: 'pointer',
                    '&:hover': {
                      '& .author-name': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    },
                  }),
                }}
              >
                <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }}>
                  {post.author.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className="author-name" sx={{ fontWeight: 600 }}>
                    {post.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fullDate} ({timeAgo})
                  </Typography>
                </Box>
              </Box>
              {canEditPost && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                    onClick={() => router.push(`/board/write?edit=${post.id}`)}
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      minWidth: 'auto',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {language === 'ko' ? '수정' : 'Edit'}
                  </Button>
                  <Button
                    size="small"
                    startIcon={deletingPost ? <CircularProgress size={14} /> : <DeleteIcon sx={{ fontSize: 16 }} />}
                    onClick={handleDeletePost}
                    disabled={deletingPost}
                    sx={{
                      color: 'error.main',
                      fontSize: '0.8rem',
                      minWidth: 'auto',
                      '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
                    }}
                  >
                    {language === 'ko' ? '삭제' : 'Delete'}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Post Content */}
          <Box sx={{ p: 3, minHeight: 100 }}>
            <MarkdownPreview content={post.content} isDark={theme.palette.mode === 'dark'} />

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                size="small"
                startIcon={<ViewIcon sx={{ fontSize: 18 }} />}
                sx={{ color: 'text.secondary', fontSize: '0.875rem', cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}
                disableRipple
              >
                {post.viewCount ?? 0}
              </Button>
              <Button
                size="small"
                startIcon={<CommentIcon sx={{ fontSize: 18 }} />}
                sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
              >
                {comments.length}
              </Button>
              <IconButton
                size="small"
                onClick={handleToggleBookmark}
                sx={{ color: isBookmarked ? theme.palette.primary.main : 'text.secondary', p: 1 }}
              >
                {isBookmarked ? <BookmarkFilledIcon sx={{ fontSize: 20 }} /> : <BookmarkIcon sx={{ fontSize: 20 }} />}
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary', p: 1 }}>
                <ShareIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleReportPost}
                sx={{ color: 'text.secondary', p: 1 }}
              >
                <FlagIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Comments Section */}
        <Box sx={{ mt: 4 }}>
          {/* New Comment Input */}
          <Box sx={{ mb: 3 }}>
            {user ? (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar src={user.user_metadata?.avatar_url} sx={{ width: 32, height: 32, fontSize: '0.85rem' }}>
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder={language === 'ko' ? '댓글을 입력하세요...' : 'Write a comment...'}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        bgcolor: theme.palette.mode === 'dark' ? '#0d0d0d' : '#ffffff',
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || submittingComment}
                      sx={{
                        bgcolor: '#ff6b35',
                        '&:hover': { bgcolor: '#e55a2b' },
                        '&:disabled': { bgcolor: theme.palette.action.disabledBackground },
                      }}
                    >
                      {submittingComment
                        ? (language === 'ko' ? '등록 중...' : 'Posting...')
                        : (language === 'ko' ? '댓글 등록' : 'Post Comment')}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {language === 'ko' ? '댓글을 작성하려면 로그인하세요' : 'Sign in to write a comment'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': {
                      borderColor: '#e55a2b',
                      bgcolor: 'rgba(255, 107, 53, 0.08)',
                    },
                  }}
                >
                  {language === 'ko' ? '로그인' : 'Sign In'}
                </Button>
              </Box>
            )}
          </Box>

          {/* Comment Header with Sort */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === 'ko' ? '댓글' : 'Comments'} ({comments.length})
            </Typography>
            {comments.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button
                  size="small"
                  variant={commentSort === 'popular' ? 'contained' : 'text'}
                  onClick={() => setCommentSort('popular')}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.25,
                    fontSize: '0.75rem',
                    fontWeight: commentSort === 'popular' ? 600 : 400,
                    bgcolor: commentSort === 'popular' ? '#ff6b35' : 'transparent',
                    color: commentSort === 'popular' ? '#fff' : 'text.secondary',
                    '&:hover': {
                      bgcolor: commentSort === 'popular' ? '#e55a2b' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {language === 'ko' ? '인기순' : 'Popular'}
                </Button>
                <Button
                  size="small"
                  variant={commentSort === 'newest' ? 'contained' : 'text'}
                  onClick={() => setCommentSort('newest')}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.25,
                    fontSize: '0.75rem',
                    fontWeight: commentSort === 'newest' ? 600 : 400,
                    bgcolor: commentSort === 'newest' ? '#ff6b35' : 'transparent',
                    color: commentSort === 'newest' ? '#fff' : 'text.secondary',
                    '&:hover': {
                      bgcolor: commentSort === 'newest' ? '#e55a2b' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {language === 'ko' ? '최신순' : 'Newest'}
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
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        {/* Avatar - fixed on left */}
                        <Box
                          component={comment.user?.id ? Link : 'div'}
                          href={comment.user?.id ? `/profile/${comment.user.id}` : undefined}
                          sx={{
                            flexShrink: 0,
                            textDecoration: 'none',
                            ...(comment.user?.id && {
                              cursor: 'pointer',
                              '&:hover': { opacity: 0.8 },
                            }),
                          }}
                        >
                          <Avatar src={comment.user?.avatar_url || undefined} sx={{ width: 32, height: 32, fontSize: '0.85rem' }}>
                            {(comment.user?.nickname || comment.user?.email || '?').charAt(0).toUpperCase()}
                          </Avatar>
                        </Box>
                        {/* Content area */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Author info row */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                              component={comment.user?.id ? Link : 'span'}
                              href={comment.user?.id ? `/profile/${comment.user.id}` : undefined}
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.813rem',
                                color: 'text.primary',
                                textDecoration: 'none',
                                ...(comment.user?.id && {
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: 'primary.main',
                                    textDecoration: 'underline',
                                  },
                                }),
                              }}
                            >
                              {comment.user?.nickname || comment.user?.email?.split('@')[0] || (language === 'ko' ? '익명' : 'Anonymous')}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                              {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
                            </Typography>
                          </Box>
                          {/* Comment content */}
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5, mt: 0.5, mb: 0.5, wordBreak: 'break-word' }}>
                            {comment.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Button
                              size="small"
                              startIcon={likedComments.has(comment.id) ? <ThumbUpIcon sx={{ fontSize: 14 }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />}
                              onClick={() => handleToggleCommentLike(comment.id)}
                              sx={{
                                color: likedComments.has(comment.id) ? '#ff6b35' : 'text.secondary',
                                minWidth: 'auto',
                                px: 0.75,
                                py: 0.25,
                                fontSize: '0.75rem',
                                minHeight: 'auto',
                              }}
                            >
                              {language === 'ko' ? '좋아요' : 'Like'}
                            </Button>
                            <Button
                              size="small"
                              onClick={() => user ? handleReplyClick(comment.id) : alert(language === 'ko' ? '로그인이 필요합니다.' : 'Please sign in.')}
                              sx={{
                                color: replyingToCommentId === comment.id ? '#ff6b35' : 'text.secondary',
                                minWidth: 'auto',
                                px: 0.75,
                                py: 0.25,
                                fontSize: '0.75rem',
                                minHeight: 'auto',
                                fontWeight: replyingToCommentId === comment.id ? 600 : 400,
                              }}
                            >
                              {language === 'ko' ? '답글' : 'Reply'}
                              {comment.replies && comment.replies.length > 0 && ` (${comment.replies.length})`}
                            </Button>
                            <Button
                              size="small"
                              startIcon={<FlagIcon sx={{ fontSize: 14 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReportComment(comment.id);
                              }}
                              sx={{ color: 'text.disabled', minWidth: 'auto', px: 0.75, py: 0.25, fontSize: '0.75rem', minHeight: 'auto' }}
                            >
                              {language === 'ko' ? '신고' : 'Report'}
                            </Button>
                            {canDeleteComment(comment) && (
                              <Button
                                size="small"
                                startIcon={deletingCommentId === comment.id ? <CircularProgress size={12} /> : <DeleteIcon sx={{ fontSize: 14 }} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteComment(comment.id);
                                }}
                                disabled={deletingCommentId === comment.id}
                                sx={{ color: 'error.main', minWidth: 'auto', px: 0.75, py: 0.25, fontSize: '0.75rem', minHeight: 'auto' }}
                              >
                                {language === 'ko' ? '삭제' : 'Delete'}
                              </Button>
                            )}
                          </Box>

                          {/* Reply Input */}
                          {replyingToCommentId === comment.id && user && (
                            <Box
                              sx={{
                                mt: 1.5,
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Avatar src={user.user_metadata?.avatar_url} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                  {user.email?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    multiline
                                    rows={2}
                                    placeholder={language === 'ko' ? '답글을 입력하세요...' : 'Write a reply...'}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                        fontSize: '0.85rem',
                                        bgcolor: theme.palette.mode === 'dark' ? '#0d0d0d' : '#ffffff',
                                      },
                                    }}
                                  />
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                    <Button
                                      size="small"
                                      onClick={() => {
                                        setReplyingToCommentId(null);
                                        setReplyText('');
                                      }}
                                      sx={{ fontSize: '0.813rem', color: 'text.secondary' }}
                                    >
                                      {language === 'ko' ? '취소' : 'Cancel'}
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleSubmitReply(comment.id)}
                                      disabled={!replyText.trim() || submittingReply}
                                      sx={{
                                        fontSize: '0.813rem',
                                        bgcolor: '#ff6b35',
                                        '&:hover': { bgcolor: '#e55a2b' },
                                      }}
                                    >
                                      {submittingReply
                                        ? (language === 'ko' ? '등록 중...' : 'Posting...')
                                        : (language === 'ko' ? '답글 등록' : 'Post Reply')}
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          )}

                          {/* Existing Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <Box
                              sx={{
                                mt: 1.5,
                                pl: 2,
                                borderLeft: `2px solid ${theme.palette.divider}`,
                              }}
                            >
                              {comment.replies.map((reply) => (
                                <Box
                                  key={reply.id}
                                  sx={{
                                    py: 1,
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'flex-start',
                                  }}
                                >
                                  {/* Reply Avatar - fixed on left */}
                                  <Box
                                    component={reply.user?.id ? Link : 'div'}
                                    href={reply.user?.id ? `/profile/${reply.user.id}` : undefined}
                                    sx={{
                                      flexShrink: 0,
                                      textDecoration: 'none',
                                      ...(reply.user?.id && {
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                      }),
                                    }}
                                  >
                                    <Avatar src={reply.user?.avatar_url || undefined} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                      {(reply.user?.nickname || reply.user?.email || '?').charAt(0).toUpperCase()}
                                    </Avatar>
                                  </Box>
                                  {/* Reply Content area */}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    {/* Reply author info row */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                      <Typography
                                        component={reply.user?.id ? Link : 'span'}
                                        href={reply.user?.id ? `/profile/${reply.user.id}` : undefined}
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                          color: 'text.primary',
                                          textDecoration: 'none',
                                          ...(reply.user?.id && {
                                            cursor: 'pointer',
                                            '&:hover': {
                                              color: 'primary.main',
                                              textDecoration: 'underline',
                                            },
                                          }),
                                        }}
                                      >
                                        {reply.user?.nickname || reply.user?.email?.split('@')[0] || (language === 'ko' ? '익명' : 'Anonymous')}
                                      </Typography>
                                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                                        {reply.created_at && formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: ko })}
                                      </Typography>
                                    </Box>
                                    {/* Reply content */}
                                    <Typography variant="body2" sx={{ fontSize: '0.813rem', lineHeight: 1.5, mt: 0.25, wordBreak: 'break-word' }}>
                                      {reply.content}
                                    </Typography>
                                    {canDeleteReply(reply) && (
                                      <Button
                                        size="small"
                                        startIcon={deletingReplyId === reply.id ? <CircularProgress size={12} /> : <DeleteIcon sx={{ fontSize: 14 }} />}
                                        onClick={() => handleDeleteReply(reply.id)}
                                        disabled={deletingReplyId === reply.id}
                                        sx={{ color: 'error.main', minWidth: 'auto', px: 0.5, py: 0.25, fontSize: '0.7rem', minHeight: 'auto', mt: 0.25 }}
                                      >
                                        {language === 'ko' ? '삭제' : 'Delete'}
                                      </Button>
                                    )}
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          )}
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
        targetType={reportTargetType}
        targetId={reportTargetId}
      />

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
