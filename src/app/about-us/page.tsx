'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Paper, Chip, Grid } from '@mui/material';
import {
  Speed as SpeedIcon,
  Groups as GroupsIcon,
  Lightbulb as LightbulbIcon,
  MenuBook as MenuBookIcon,
  QuestionAnswer as QuestionAnswerIcon,
  School as SchoolIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const serviceItems = [
  {
    category: '빠르고 친절한 가이드',
    icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
    color: '#ff6b35',
    items: [
      'Cursor, Windsurf, Claude Code 등 주요 AI 개발 도구에 대한 한국어 가이드',
      '복잡한 설정과 확장 기능을 쉽게 따라할 수 있는 튜토리얼',
      '최신 도구와 업데이트 소식을 빠르게 전달',
    ],
  },
  {
    category: '커뮤니티 기반 지식 공유',
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    color: '#ffc857',
    items: [
      '실제 프로젝트 경험과 노하우를 나누는 공간',
      '막히는 부분을 함께 해결하는 Q&A',
      '초보자부터 숙련자까지 모두가 배우고 가르치는 문화',
    ],
  },
  {
    category: '함께 만드는 지혜',
    icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
    color: '#10b981',
    items: [
      '효과적인 프롬프트와 워크플로우 공유',
      '성공 사례와 실패 경험에서 배우는 인사이트',
      '바이브 코딩 생태계를 함께 개척하는 동료들',
    ],
  },
];

export default function AboutUsPage() {
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
                About Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                바이브 코딩 커뮤니티
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Vision Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff',
        }}
      >
        <Container maxWidth="md">
          {/* Logo at top of content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 6,
              }}
            >
              <Box
                component="img"
                src={theme.palette.mode === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                alt="ViBB Logo"
                sx={{
                  height: { xs: 60, md: 80 },
                  width: 'auto',
                }}
              />
              <Box
                component="img"
                src={theme.palette.mode === 'dark' ? '/textLogo-darkmode.svg' : '/textLogo.svg'}
                alt="VIB Builders"
                sx={{
                  height: { xs: 36, md: 48 },
                  width: 'auto',
                }}
              />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                label="Our Vision"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 800,
                  mb: 4,
                  lineHeight: 1.4,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  "AI와 함께, 누구나 만드는 사람이 되는 세상"
                </Box>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                {
                  text: '코딩은 더 이상 개발자만의 영역이 아닙니다. AI 도구의 등장으로 아이디어만 있다면 누구나 자신만의 서비스를 만들 수 있는 시대가 열렸습니다.',
                  highlight: '누구나 자신만의 서비스를 만들 수 있는 시대',
                },
                {
                  text: 'ViBB는 이 변화의 중심에서 한국어 사용자들이 언어의 장벽 없이 바이브 코딩의 세계에 자연스럽게 진입하고, 함께 성장할 수 있는 터전이 되고자 합니다.',
                  highlight: '언어의 장벽 없이',
                },
                {
                  text: '혼자 헤매지 않아도 됩니다. 우리는 서로의 경험을 나누고, 시행착오를 줄이며, 더 빠르게 원하는 것을 만들어가는 커뮤니티입니다.',
                  highlight: '혼자 헤매지 않아도 됩니다',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fffbf5',
                      border: `1px solid ${theme.palette.divider}`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: 'linear-gradient(180deg, #ff6b35 0%, #ffc857 100%)',
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        lineHeight: 1.8,
                        color: 'text.primary',
                      }}
                    >
                      {item.text.split(item.highlight).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 700,
                                color: '#ff6b35',
                              }}
                            >
                              {item.highlight}
                            </Box>
                          )}
                        </span>
                      ))}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Our Service Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)'
              : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip
                label="Our Service"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                우리가 제공하는 것
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {serviceItems.map((service, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={service.category}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    style={{ height: '100%' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[12],
                          borderColor: service.color,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 72,
                          height: 72,
                          borderRadius: 3,
                          bgcolor: `${service.color}15`,
                          color: service.color,
                          mb: 3,
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 3,
                          color: 'text.primary',
                        }}
                      >
                        {service.category}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {service.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.15 + itemIndex * 0.1 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: service.color,
                                  mt: 1,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  lineHeight: 1.7,
                                }}
                              >
                                {item}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
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
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                함께 만들어가요
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                ViBB와 함께 바이브 코딩의 세계를 탐험하고,
                <br />
                여러분만의 아이디어를 현실로 만들어보세요.
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
