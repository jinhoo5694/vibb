'use client';

import React from 'react';
import { Box } from '@mui/material';
import type { Comment } from '@/types/comment';
import { CommentItem } from './CommentItem';

interface CommentThreadProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReply: (parentId: string, content: string) => Promise<void>;
  depth?: number;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
  onReply,
  depth = 0,
}) => {
  return (
    <Box>
      <CommentItem
        comment={comment}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onDelete={onDelete}
        onLike={onLike}
        onReply={onReply}
      />
      {/* Render nested replies with indentation */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ ml: { xs: 2, sm: 4 }, mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
