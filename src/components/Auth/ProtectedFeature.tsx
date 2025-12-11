'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
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
  const { user, loading, signInWithGoogle } = useAuth();

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
        <Button
          variant="contained"
          color="primary"
          startIcon={<LoginIcon />}
          onClick={signInWithGoogle}
        >
          Sign In with Google
        </Button>
      </Paper>
    );
  }

  return <>{children}</>;
};
