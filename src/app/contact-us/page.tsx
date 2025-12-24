'use client';

import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Paper, Button } from '@mui/material';
import {
  Mail as MailIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Lightbulb as LightbulbIcon,
  Handshake as HandshakeIcon,
  Report as ReportIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const contactReasons = [
  { icon: <QuestionAnswerIcon sx={{ fontSize: 28 }} />, text: '커뮤니티 이용 관련 문의', color: '#ff6b35' },
  { icon: <LightbulbIcon sx={{ fontSize: 28 }} />, text: '콘텐츠 또는 기능 제안', color: '#ffc857' },
  { icon: <HandshakeIcon sx={{ fontSize: 28 }} />, text: '협업 및 파트너십 문의', color: '#10b981' },
  { icon: <ReportIcon sx={{ fontSize: 28 }} />, text: '가이드 위반 신고', color: '#ef4444' },
  { icon: <MoreIcon sx={{ fontSize: 28 }} />, text: '기타 건의 사항', color: '#8b5cf6' },
];

export default function ContactUsPage() {
  const theme = useTheme();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const handleOpenInquiry = () => {
    setInquiryOpen(true);
  };

  const handleCloseInquiry = () => {
    setInquiryOpen(false);
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #fff5f5 0%, #fffbf5 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                언제든 연락주세요
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Welcome Message */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fffbf5',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <MailIcon
                sx={{
                  fontSize: 56,
                  color: '#ff6b35',
                  mb: 2,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                ViBB에 대해 궁금한 점이 있으신가요?
                <br />
                제안하고 싶은 아이디어가 있으신가요?
                <br />
                <Box component="span" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                  어떤 이야기든 환영합니다.
                </Box>
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Reasons Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)'
              : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
              }}
            >
              이런 내용으로 연락주세요
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactReasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: reason.color,
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `${reason.color}15`,
                        color: reason.color,
                        flexShrink: 0,
                      }}
                    >
                      {reason.icon}
                    </Box>
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                      {reason.text}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff',
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<MailIcon />}
                onClick={handleOpenInquiry}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff8a5c 0%, #ffd477 100%)',
                  },
                  borderRadius: 3,
                  px: 6,
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: theme.shadows[8],
                }}
              >
                문의하기
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Response Time Notice */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 200, 87, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 200, 87, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                }}
              >
                보내주신 문의는 확인 후{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                  영업일 기준 1~2일 이내
                </Box>
                에 답변드리고 있습니다.
                <br />
                조금만 기다려주시면 빠르게 연락드릴게요!
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Footer />
      <InquiryFab
        externalOpen={inquiryOpen}
        onExternalClose={handleCloseInquiry}
      />
      <ScrollToTopFab />
    </>
  );
}
