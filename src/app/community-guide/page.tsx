'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Paper, Chip, Divider } from '@mui/material';
import {
  Handshake as HandshakeIcon,
  Block as BlockIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  Forum as ForumIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const respectItems = [
  '모든 멤버에게 예의 바른 언어를 사용해주세요.',
  '비난, 조롱, 차별적 표현은 삼가주세요.',
  '초보자의 질문도 소중합니다. 누구나 처음은 있으니까요.',
  '의견이 다를 수 있습니다. 건강한 토론은 환영하지만, 인신공격은 안 돼요.',
];

const avoidItems = [
  { title: '광고 및 스팸', desc: '홍보성 게시글, 무분별한 링크 공유는 삭제될 수 있습니다.' },
  { title: '도배', desc: '같은 내용을 반복해서 올리지 마세요.' },
  { title: '개인정보 공유', desc: '본인 및 타인의 민감한 정보(연락처, 주소, API 키 등)는 절대 공개하지 마세요.' },
  { title: '저작권 침해', desc: '타인의 콘텐츠를 공유할 때는 반드시 출처를 명시해주세요.' },
];

const welcomeItems = [
  'AI 도구 사용 중 궁금한 점 질문하기',
  '유용한 팁, 프롬프트, 워크플로우 공유하기',
  '프로젝트 경험담과 시행착오 나누기',
  '다른 멤버의 질문에 친절하게 답변하기',
  '새로운 도구나 업데이트 소식 공유하기',
];

export default function CommunityGuidePage() {
  const theme = useTheme();

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
                커뮤니티 가이드
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                함께 만들어가는 건강한 커뮤니티
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Welcome Section */}
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
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                환영합니다!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                ViBB는 바이브 코딩을 함께 배우고 성장하는 공간입니다.
                <br />
                모든 멤버가 편안하고 즐겁게 참여할 수 있도록, 아래 가이드를 함께 지켜주세요.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Respect Section */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                }}
              >
                <HandshakeIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                서로 존중하기
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {respectItems.map((item, index) => (
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
                      gap: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#ff6b35',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#ff6b35',
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                      {item}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Avoid Section */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                }}
              >
                <BlockIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                이런 건 피해주세요
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {avoidItems.map((item, index) => (
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
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fef2f2',
                      border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#fecaca'}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: '#ef4444', mb: 0.5 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {item.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Welcome Activities Section */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                }}
              >
                <LightbulbIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                이런 건 환영합니다
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {welcomeItems.map((item, index) => (
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
                      bgcolor: theme.palette.mode === 'dark' ? '#0f2922' : '#ecfdf5',
                      border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#a7f3d0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#10b981',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#10b981',
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                      {item}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Warning Section */}
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
                p: { xs: 4, md: 5 },
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fffbeb',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#fcd34d'}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <WarningIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  가이드 위반 시
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                }}
              >
                커뮤니티 가이드를 위반하는 경우,{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  게시글 삭제 또는 활동 제한 조치
                </Box>
                가 있을 수 있습니다.
                <br />
                반복적인 위반 시 커뮤니티 이용이 제한될 수 있습니다.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Closing Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 200, 87, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 200, 87, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <ForumIcon
                sx={{
                  fontSize: 48,
                  color: '#ff6b35',
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                마지막으로
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  mb: 3,
                }}
              >
                ViBB는 우리 모두가 함께 만들어가는 공간입니다.
                <br />
                서로 배려하고 지식을 나누며, 함께 성장하는 커뮤니티를 만들어가요.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                궁금한 점이나 건의 사항이 있다면 언제든 운영진에게 연락해주세요!
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
