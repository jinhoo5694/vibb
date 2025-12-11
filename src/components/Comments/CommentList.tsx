'use client';

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { CommentOutlined as CommentIcon } from '@mui/icons-material';
import type { Comment } from '@/types/comment';
import { CommentThread } from './CommentThread';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  isLoading: boolean;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReply: (parentId: string, content: string) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserId,
  isLoading,
  onEdit,
  onDelete,
  onLike,
  onReply,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 2,
        }}
      >
        <CommentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {t('comments.list.noComments')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('comments.list.beFirst')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {comments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
          onReply={onReply}
        />
      ))}
    </Box>
  );
};
