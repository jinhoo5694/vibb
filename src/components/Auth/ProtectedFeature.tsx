'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  message?: string;
  title?: string;
}

/**
 * ProtectedFeature Component
 *
 * Wraps features that require authentication (like comments).
 * Shows sign-in prompt for non-authenticated users.
 *
 * Usage:
 * <ProtectedFeature title="Comments" message="Sign in to add comments">
 *   <CommentSection />
 * </ProtectedFeature>
 */
export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  children,
  message = 'Please sign in to access this feature',
  title = 'Authentication Required',
}) => {
  const { user, loading, signInWithGoogle, signInWithGithub } = useAuth();

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
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
      </Paper>
    );
  }

  return <>{children}</>;
};
