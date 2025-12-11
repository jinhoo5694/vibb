'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  Button,
  Rating,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import type { Comment } from '@/types/comment';
import { CommentForm } from './CommentForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReply: (parentId: string, content: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
  onReply,
}) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOwner = currentUserId === comment.user_id;
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm(t('comments.item.deleteConfirm'))) {
      await onDelete(comment.id);
    }
    handleMenuClose();
  };

  const handleUpdateSubmit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setShowReplyForm(false);
  };

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

  const userName = comment.user_name ||
                   comment.user_email?.split('@')[0] ||
                   'Anonymous';

  const isEdited = comment.created_at !== comment.updated_at;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Avatar */}
        <Avatar
          src={comment.user_avatar || undefined}
          alt={userName}
          sx={{ width: 40, height: 40 }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(comment.created_at)}
              </Typography>
              {isEdited && (
                <Chip
                  label={t('comments.item.edited')}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.65rem' }}
                />
              )}
            </Box>

            {/* Menu for owner */}
            {isOwner && (
              <>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                    {t('comments.item.edit')}
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                    {t('comments.item.delete')}
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Rating - only show for root comments */}
          {comment.rating && (
            <Box sx={{ mb: 1 }}>
              <Rating value={comment.rating} readOnly size="small" />
            </Box>
          )}

          {/* Comment Content or Edit Form */}
          {isEditing ? (
            <CommentForm
              onSubmit={handleUpdateSubmit}
              onCancel={() => setIsEditing(false)}
              initialValue={comment.content}
              isEditing={true}
            />
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  mb: 1,
                }}
              >
                {comment.content}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                {/* Like Button */}
                <Button
                  size="small"
                  startIcon={comment.user_has_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={() => onLike(comment.id)}
                  sx={{
                    minWidth: 'auto',
                    color: comment.user_has_liked ? theme.palette.error.main : theme.palette.text.secondary,
                  }}
                >
                  {comment.like_count || 0}
                </Button>

                {/* Reply Button */}
                {currentUserId && (
                  <Button
                    size="small"
                    startIcon={<ReplyIcon />}
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    sx={{ minWidth: 'auto' }}
                  >
                    {t('comments.item.reply')}
                  </Button>
                )}
              </Box>

              {/* Reply Form */}
              {showReplyForm && (
                <Box sx={{ mt: 2 }}>
                  <CommentForm
                    onSubmit={handleReplySubmit}
                    onCancel={() => setShowReplyForm(false)}
                    isReply={true}
                    placeholder={`${t('comments.item.reply')} to ${userName}...`}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
