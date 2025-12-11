'use client';

import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider, useTheme } from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: '섹션',
      links: [
        { label: '스킬', href: '/skills' },
        { label: 'MCP', href: '/mcp' },
        { label: '프롬프트', href: '/prompt' },
        { label: 'AI 도구', href: '/ai-tools' },
      ],
    },
    {
      title: '리소스',
      links: [
        { label: 'Claude 문서', href: 'https://docs.anthropic.com' },
        { label: 'GitHub', href: 'https://github.com/anthropics/skills' },
        { label: '커뮤니티', href: '#' },
      ],
    },
    {
      title: '정보',
      links: [
        { label: '소개', href: '#' },
        { label: '블로그', href: '#' },
        { label: '문의하기', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <GitHubIcon />, href: 'https://github.com/anthropics', label: 'GitHub' },
    { icon: <TwitterIcon />, href: 'https://twitter.com/anthropicai', label: 'Twitter' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/anthropic', label: 'LinkedIn' },
    { icon: <EmailIcon />, href: 'mailto:contact@anthropic.com', label: 'Email' },
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
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 4, md: 6 },
            mb: 6,
          }}
        >
          {/* Brand Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VIB Builders
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              바이브 코딩 커뮤니티. AI와 함께하는 새로운 개발 경험을 공유하고,
              함께 성장하는 빌더들의 공간입니다.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialLinks.map((social) => (
                <MuiLink
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: theme.palette.text.secondary,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {social.icon}
                </MuiLink>
              ))}
            </Box>
          </Box>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <Box key={section.title}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
            © {new Date().getFullYear()} VIB Builders. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              href="#"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              href="#"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
