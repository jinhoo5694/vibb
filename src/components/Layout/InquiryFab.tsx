'use client';

import React, { useState } from 'react';
import {
  Fab,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Mail as MailIcon,
  Close as CloseIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const InquiryFab: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const { user, session, signInWithGoogle, signInWithGithub } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    type: 'bug_report',
    title: '',
    description: '',
  });

  // Map to API type values
  const inquiryTypes = [
    { value: 'bug_report', label: t('inquiry.type.bug') },
    { value: 'feature_request', label: t('inquiry.type.feature') },
    { value: 'business', label: t('inquiry.type.business') },
    { value: 'account_issue', label: t('inquiry.type.account') },
  ];

  const handleOpen = () => {
    setOpen(true);
    setSuccess(false);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    if (success) {
      setFormData({
        email: '',
        type: 'bug_report',
        title: '',
        description: '',
      });
      setSuccess(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build request body according to API spec
      const requestBody: {
        type: string;
        email: string;
        title: string;
        description: string;
        user_id?: string;
      } = {
        type: formData.type,
        email: formData.email,
        title: formData.title,
        description: formData.description,
      };

      // Include user_id if logged in
      if (user?.id) {
        requestBody.user_id = user.id;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('inquiry.error'));
      }

      setSuccess(true);
      setFormData({
        email: '',
        type: 'bug_report',
        title: '',
        description: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('inquiry.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: theme.spacing(12),
          right: theme.spacing(4),
          zIndex: theme.zIndex.fab || 1050,
        }}
      >
        <Fab
          color="secondary"
          onClick={handleOpen}
          aria-label="inquiry"
          sx={{
            background: 'linear-gradient(135deg, #ffc857 0%, #ff6b35 100%)',
            boxShadow: theme.shadows[8],
            '&:hover': {
              background: 'linear-gradient(135deg, #ffd477 0%, #ff8a5c 100%)',
              boxShadow: theme.shadows[12],
            },
            transition: 'all 0.3s ease',
          }}
        >
          <MailIcon sx={{ fontSize: 24, color: 'white' }} />
        </Fab>
      </motion.div>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}>
          <Box sx={{ fontWeight: 700 }}>
            {t('inquiry.title')}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            {!user ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  {t('inquiry.signInRequired')}
                </Alert>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={signInWithGoogle}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff8a5c 0%, #ffd477 100%)',
                      },
                    }}
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
            ) : success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                {t('inquiry.success')}
              </Alert>
            ) : (
              <>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label={t('inquiry.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="dense"
                  disabled={loading}
                />

                <TextField
                  fullWidth
                  select
                  label={t('inquiry.typeLabel')}
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  margin="dense"
                  disabled={loading}
                >
                  {inquiryTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label={t('inquiry.titleLabel')}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  margin="dense"
                  disabled={loading}
                  placeholder={t('inquiry.titlePlaceholder')}
                />

                <TextField
                  fullWidth
                  label={t('inquiry.description')}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  margin="dense"
                  disabled={loading}
                  placeholder={t('inquiry.descriptionPlaceholder')}
                />
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} disabled={loading}>
              {success ? t('inquiry.close') : t('inquiry.cancel')}
            </Button>
            {user && !success && (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff8a5c 0%, #ffd477 100%)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('inquiry.submit')
                )}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
