'use client';

import React from 'react';
import { Box } from '@mui/material';
import type { Comment, CommentReply } from '@/types/comment';
import { CommentItem } from './CommentItem';
import { ReplyItem } from './ReplyItem';

interface CommentThreadProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReply: (reviewId: string, content: string) => Promise<void>;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
  onReply,
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
      {/* Render replies with indentation */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ ml: { xs: 2, sm: 4 }, borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
          {comment.replies.map((reply: CommentReply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
