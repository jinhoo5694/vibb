'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import {
  Warning as WarningIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useLanguage } from './LanguageContext';

interface ExternalLinkContextType {
  openExternalLink: (url: string) => void;
}

const ExternalLinkContext = createContext<ExternalLinkContextType | undefined>(undefined);

// No trusted domains - show warning for all external links
const TRUSTED_DOMAINS: string[] = [];

// localStorage key for "don't show again" preference
const DONT_SHOW_AGAIN_KEY = 'vibb_external_link_warning_disabled';

function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function isTrustedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return TRUSTED_DOMAINS.some(domain =>
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export function ExternalLinkProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const openExternalLink = useCallback((url: string) => {
    console.log('[ExternalLink] openExternalLink called with:', url);

    // Check if it's an external URL
    if (!isExternalUrl(url)) {
      console.log('[ExternalLink] Not external, navigating directly');
      window.location.href = url;
      return;
    }

    // Check if it's a trusted domain
    if (isTrustedDomain(url)) {
      console.log('[ExternalLink] Trusted domain, opening directly');
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Check if user has disabled warnings
    try {
      if (localStorage.getItem(DONT_SHOW_AGAIN_KEY) === 'true') {
        console.log('[ExternalLink] User disabled warnings, opening directly');
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
    } catch {
      // localStorage not available
    }

    // Show warning dialog
    console.log('[ExternalLink] Showing warning dialog');
    setPendingUrl(url);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPendingUrl(null);
    setDontShowAgain(false);
  }, []);

  const handleProceed = useCallback(() => {
    if (pendingUrl) {
      // Save preference if checked
      if (dontShowAgain) {
        try {
          localStorage.setItem(DONT_SHOW_AGAIN_KEY, 'true');
        } catch {
          // localStorage not available
        }
      }
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    }
    handleClose();
  }, [pendingUrl, dontShowAgain, handleClose]);

  return (
    <ExternalLinkContext.Provider value={{ openExternalLink }}>
      {children}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: 'warning.main' }} />
          <Typography variant="h6" component="span">
            {language === 'ko' ? '외부 링크 이동' : 'External Link'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {language === 'ko'
              ? '외부 웹사이트로 이동하려고 합니다. 외부 사이트의 콘텐츠는 VIB Builders와 관련이 없으며, 보안 위험이 있을 수 있습니다.'
              : 'You are about to visit an external website. Content on external sites is not affiliated with VIB Builders and may pose security risks.'}
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              wordBreak: 'break-all',
            }}
          >
            <OpenInNewIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
            <Link
              href={pendingUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.preventDefault()}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {pendingUrl ? getDomain(pendingUrl) : ''}
            </Link>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {language === 'ko'
              ? '주의: 개인정보를 요구하거나 의심스러운 다운로드를 제안하는 사이트에 주의하세요.'
              : 'Warning: Be cautious of sites that request personal information or offer suspicious downloads.'}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                {language === 'ko' ? '다시 표시하지 않기' : "Don't show this again"}
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={handleProceed}
            variant="contained"
            sx={{
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e55a2b' },
            }}
          >
            {language === 'ko' ? '계속하기' : 'Continue'}
          </Button>
        </DialogActions>
      </Dialog>
    </ExternalLinkContext.Provider>
  );
}

export function useExternalLink() {
  const context = useContext(ExternalLinkContext);
  if (context === undefined) {
    throw new Error('useExternalLink must be used within an ExternalLinkProvider');
  }
  return context;
}
