'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Rating,
} from '@mui/material';
import { Send as SendIcon, Cancel as CancelIcon, Star as StarIcon } from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentFormProps {
  onSubmit: (content: string, rating?: number | null) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  isEditing?: boolean;
  isReply?: boolean; // If true, hide rating selector
  placeholder?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  initialValue = '',
  isEditing = false,
  isReply = false,
  placeholder,
}) => {
  const { t } = useLanguage();
  const [content, setContent] = useState(initialValue);
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError(t('comments.form.emptyError'));
      return;
    }

    if (content.length > 2000) {
      setError(t('comments.form.tooLongError'));
      return;
    }

    // Require rating for root comments (not replies, not edits)
    if (!isReply && !isEditing && !rating) {
      setError(t('comments.form.ratingRequired'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(content.trim(), isReply ? null : rating);
      setContent('');
      setRating(null);
    } catch (err) {
      setError(t('comments.form.submitError'));
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    setRating(null);
    setError(null);
    onCancel?.();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Rating Selector - Only show for root comments */}
      {!isReply && !isEditing && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
            {t('comments.form.ratingLabel')} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Rating
            name="skill-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarIcon fontSize="inherit" />}
          />
        </Box>
      )}

      <TextField
        fullWidth
        multiline
        rows={isReply ? 2 : 3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || t('comments.form.placeholder')}
        disabled={isSubmitting}
        sx={{ mb: 2 }}
        inputProps={{
          maxLength: 2000,
        }}
        helperText={`${content.length}/2000`}
      />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
            startIcon={<CancelIcon />}
          >
            {t('comments.form.cancel')}
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !content.trim() || (!isReply && !isEditing && !rating)}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {isEditing ? t('comments.form.update') : isReply ? t('comments.form.reply') : t('comments.form.submit')}
        </Button>
      </Box>
    </Box>
  );
};
