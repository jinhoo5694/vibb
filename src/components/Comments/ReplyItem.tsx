'use client';

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import type { CommentReply } from '@/types/comment';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

interface ReplyItemProps {
  reply: CommentReply;
  currentUserId?: string;
}

export const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  currentUserId,
}) => {
  const theme = useTheme();
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'ko' ? ko : enUS,
      });
    } catch {
      return dateString;
    }
  };

  const userName = reply.user_name || 'Anonymous';

  return (
    <Box
      sx={{
        py: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Avatar */}
        <Avatar
          src={reply.user_avatar || undefined}
          alt={userName}
          sx={{ width: 32, height: 32 }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(reply.created_at)}
            </Typography>
          </Box>

          {/* Reply Content */}
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {reply.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
