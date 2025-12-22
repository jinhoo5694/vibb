'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import type { Comment } from '@/types/comment';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { commentService } from '@/services/commentService';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentSectionProps {
  contentId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ contentId }) => {
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCommented, setHasCommented] = useState(false);

  // Load comments
  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await commentService.getCommentsByContentId(contentId, user?.id);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError(t('comments.section.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [contentId, user?.id]);

  // Check if user has already commented
  useEffect(() => {
    const checkUserComment = async () => {
      if (user) {
        try {
          const commented = await commentService.userHasCommented(contentId, user.id);
          setHasCommented(commented);
        } catch (err) {
          console.error('Error checking user comment:', err);
        }
      } else {
        setHasCommented(false);
      }
    };

    checkUserComment();
  }, [contentId, user]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = commentService.subscribeToComments(contentId, () => {
      // Reload all comments when any change occurs
      loadComments();
    });

    const repliesChannel = commentService.subscribeToReplies(() => {
      // Reload all comments when replies change
      loadComments();
    });

    const likesChannel = commentService.subscribeToLikes(() => {
      // Reload all comments when likes change
      loadComments();
    });

    return () => {
      channel.unsubscribe();
      repliesChannel.unsubscribe();
      likesChannel.unsubscribe();
    };
  }, [contentId, user?.id]);

  // Add comment
  const handleAddComment = async (content: string, rating?: number | null) => {
    if (!user) return;

    try {
      await commentService.addComment({
        content_id: contentId,
        user_id: user.id,
        content,
        rating: rating || 1,
      });
      setHasCommented(true);
      await loadComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  // Edit comment
  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await commentService.updateComment(commentId, content);
      await loadComments();
    } catch (err) {
      console.error('Error editing comment:', err);
      throw err;
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      setHasCommented(false);
      await loadComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw err;
    }
  };

  // Like/Unlike comment
  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      await commentService.toggleLike(commentId);
      await loadComments();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Reply to comment
  const handleReplyComment = async (reviewId: string, content: string) => {
    if (!user) return;

    try {
      await commentService.addReply({
        review_id: reviewId,
        user_id: user.id,
        content,
      });
      await loadComments();
    } catch (err) {
      console.error('Error replying to comment:', err);
      throw err;
    }
  };

  // Count total comments including replies
  const countAllComments = (comments: Comment[]): number => {
    return comments.reduce((count, comment) => {
      const replyCount = comment.replies ? comment.replies.length : 0;
      return count + 1 + replyCount;
    }, 0);
  };

  const totalComments = countAllComments(comments);

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ my: 4 }} />

      {/* Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {t('comments.section.title')} ({totalComments})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('comments.section.subtitle')}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Comment Form or Sign In Prompt */}
      <Box sx={{ mb: 4 }}>
        {user ? (
          hasCommented ? (
            <Alert severity="info">
              {t('comments.form.alreadyCommented')}
            </Alert>
          ) : (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                {t('comments.section.addComment')}
              </Typography>
              <CommentForm onSubmit={handleAddComment} />
            </>
          )
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t('comments.section.signInPrompt')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={signInWithGoogle}
              >
                Google
              </Button>
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                onClick={signInWithGithub}
                sx={{
                  backgroundColor: '#24292e',
                  '&:hover': {
                    backgroundColor: '#1a1e22',
                  },
                }}
              >
                GitHub
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Comments List */}
      <CommentList
        comments={comments}
        currentUserId={user?.id}
        isLoading={isLoading}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        onLike={handleLikeComment}
        onReply={handleReplyComment}
      />
    </Box>
  );
};
