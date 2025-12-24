'use client';

import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider, useTheme } from '@mui/material';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: 'ViBB에 대해',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: '커뮤니티 가이드', href: '/community-guide' },
        { label: '개인정보처리방침', href: '/privacy-policy' },
        { label: '이용약관', href: '/terms-of-service' },
        { label: 'Contact Us', href: '/contact-us' },
        { label: '오픈소스 라이선스 고지', href: '/open-source-license' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: { xs: 6, md: 8 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(180deg, #FFFBF5 0%, #FFF5F7 100%)',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: { xs: 4, md: 6 },
            mb: 6,
          }}
        >
          {/* Brand Section */}
          <Box>
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={theme.palette.mode === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                alt="VIB Builders"
                sx={{
                  height: 36,
                  width: 'auto',
                }}
              />
              <Box
                component="img"
                src={theme.palette.mode === 'dark' ? '/textLogo-darkmode.svg' : '/textLogo.svg'}
                alt="VIB Builders"
                sx={{
                  height: 22,
                  width: 'auto',
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              바이브 코딩 커뮤니티. AI와 함께하는 새로운 개발 경험을 공유하고,
              함께 성장하는 빌더들의 공간입니다.
            </Typography>
          </Box>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <Box key={section.title} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ViBB. All rights reserved.
          </Typography>

        </Box>
      </Container>
    </Box>
  );
};
