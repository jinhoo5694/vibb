'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import type { Comment } from '@/types/comment';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { commentService } from '@/services/commentService';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentSectionProps {
  skillId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ skillId }) => {
  const { user, signInWithGoogle } = useAuth();
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
      const data = await commentService.getCommentsBySkillId(skillId, user?.id);
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
  }, [skillId, user?.id]);

  // Check if user has already commented
  useEffect(() => {
    const checkUserComment = async () => {
      if (user) {
        try {
          const commented = await commentService.userHasCommented(skillId, user.id);
          setHasCommented(commented);
        } catch (err) {
          console.error('Error checking user comment:', err);
        }
      } else {
        setHasCommented(false);
      }
    };

    checkUserComment();
  }, [skillId, user]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = commentService.subscribeToComments(skillId, () => {
      // Reload all comments when any change occurs
      loadComments();
    });

    const likesChannel = commentService.subscribeToLikes(() => {
      // Reload all comments when likes change
      loadComments();
    });

    return () => {
      channel.unsubscribe();
      likesChannel.unsubscribe();
    };
  }, [skillId, user?.id]);

  // Add comment
  const handleAddComment = async (content: string, rating?: number | null) => {
    if (!user) return;

    try {
      await commentService.addComment({
        skill_id: skillId,
        user_id: user.id,
        content,
        rating: rating || null,
        user_email: user.email || undefined,
        user_name: user.user_metadata?.full_name || null,
        user_avatar: user.user_metadata?.avatar_url || null,
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
      // Find the comment to check if user has already liked it
      const findComment = (comments: Comment[], id: string): Comment | null => {
        for (const comment of comments) {
          if (comment.id === id) return comment;
          if (comment.replies) {
            const found = findComment(comment.replies, id);
            if (found) return found;
          }
        }
        return null;
      };

      const comment = findComment(comments, commentId);

      if (comment?.user_has_liked) {
        await commentService.unlikeComment(commentId, user.id);
      } else {
        await commentService.likeComment(commentId, user.id);
      }

      await loadComments();
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  // Reply to comment
  const handleReplyComment = async (parentId: string, content: string) => {
    if (!user) return;

    try {
      await commentService.addComment({
        skill_id: skillId,
        user_id: user.id,
        parent_id: parentId,
        content,
        rating: null, // Replies don't have ratings
        user_email: user.email || undefined,
        user_name: user.user_metadata?.full_name || null,
        user_avatar: user.user_metadata?.avatar_url || null,
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
      return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
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
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'background.default' }}>
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
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t('comments.section.signInPrompt')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={signInWithGoogle}
              sx={{ mt: 2 }}
            >
              {t('comments.section.signInButton')}
            </Button>
          </Box>
        )}
      </Paper>

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
