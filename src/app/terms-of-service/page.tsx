'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Paper, Button } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

const sections = [
  {
    id: 1,
    title: '제1조 (목적)',
    content: '본 약관은 ViBB(이하 "회사")가 제공하는 바이브 코딩 커뮤니티 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.',
  },
  {
    id: 2,
    title: '제2조 (용어의 정의)',
    subsections: [
      {
        items: [
          '"서비스"란 회사가 제공하는 바이브 코딩 관련 정보 공유, 커뮤니티, 스킬 공유 등 일체의 서비스를 의미합니다.',
          '"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.',
          '"회원"이란 회사에 개인정보를 제공하고 회원등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 말합니다.',
          '"비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.',
          '"콘텐츠"란 이용자가 서비스 내에 게시한 글, 사진, 파일, 링크, 댓글 등 일체의 정보를 말합니다.'
        ],
      },
    ],
  },
  {
    id: 3,
    title: '제3조 (약관의 효력 및 변경)',
    subsections: [
      {
        items: [
          '본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.',
          '이용자가 서비스에 회원가입을 완료하는 경우, 본 약관의 내용을 충분히 이해하고 이에 동의한 것으로 간주됩니다.',
          '본 약관에 동의하지 않는 이용자는 언제든지 회원 탈퇴를 통해 서비스 이용계약을 해지할 수 있습니다.',
          '회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 내에서 본 약관을 변경할 수 있습니다.',
          '회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행 약관과 함께 서비스 내에 그 적용일자 7일 전부터 공지합니다.',
          '변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.',
          '이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.',
        ],
      },
    ],
  },
  {
    id: 4,
    title: '제4조 (회원가입)',
    subsections: [
      {
        items: [
          '이용자는 소셜 로그인(Google, GitHub 등)을 통해 회원가입을 진행할 수 있습니다.',
          '소셜 로그인을 통한 회원가입 완료 시, 이용자는 본 약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.',
          '별도의 약관 동의 절차 없이 가입이 완료되므로, 이용자는 가입 전 본 약관을 충분히 숙지하시기 바랍니다.',
          '본 약관에 동의하지 않는 경우, 회원가입 후 즉시 회원 탈퇴를 요청하실 수 있습니다.',
          '회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:',
        ],
      },
      {
        subtitle: '가입 거부 사유',
        items: [
          '실명이 아니거나 타인의 정보를 이용한 경우',
          '허위의 정보를 기재하거나 필수 정보를 기재하지 않은 경우',
          '이전에 회원자격을 상실한 적이 있는 경우 (단, 회사의 재가입 승낙을 얻은 경우는 예외)',
          '기타 회원으로 등록하는 것이 회사의 서비스 운영에 현저히 지장이 있다고 판단되는 경우',
        ],
      },
    ],
  },
  {
    id: 5,
    title: '제5조 (회원 탈퇴 및 자격 상실)',
    subsections: [
      {
        subtitle: '1. 회원 탈퇴',
        items: [
          '회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.',
          '탈퇴 시 7일간의 유예기간이 적용되며, 유예기간 내 재로그인이 가능합니다. 이 기간 내에 \'마이페이지\'에서 탈퇴 취소가 가능합니다.',
        ],
      },
      {
        subtitle: '2. 회원자격 제한 및 상실',
        content: '회사는 회원이 다음 각 호에 해당하는 경우 사전 통지 없이 회원자격을 제한 또는 상실시킬 수 있습니다:',
        items: [
          '가입 신청 시 허위 내용을 등록한 경우',
          '다른 이용자의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우',
          '서비스를 이용하여 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우',
          '다른 이용자에 대한 괴롭힘, 비방, 명예훼손 등의 행위를 한 경우',
        ],
      },
    ],
  },
  {
    id: 6,
    title: '제6조 (서비스의 제공 및 변경)',
    subsections: [
      {
        subtitle: '1. 제공 서비스',
        items: [
          '바이브 코딩 관련 정보 및 콘텐츠 제공',
          'Claude 스킬 공유 및 검색 서비스',
          'MCP(Model Context Protocol) 관련 정보 및 리소스 제공',
          'AI 프롬프트 템플릿 및 가이드 제공',
          'AI 도구 정보 및 리뷰 제공',
          'AI 뉴스 및 최신 소식 제공',
          '플러그인 마켓플레이스 서비스',
          '커뮤니티 서비스 (게시판, 댓글, 좋아요 등)',
          '회원 프로필 및 활동 관리 서비스',
          '기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스',
        ],
      },
      {
        subtitle: '2. 서비스 변경',
        items: [
          '회사는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 서비스를 변경할 수 있습니다.',
          '서비스 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용 및 제공일자 등을 변경 전에 서비스 내에 공지합니다.',
        ],
      },
    ],
  },
  {
    id: 7,
    title: '제7조 (서비스의 중단)',
    subsections: [
      {
        items: [
          '회사는 컴퓨터 등 정보통신설비의 보수점검, 교체, 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.',
          '회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스 제공화면에 공지한 바에 따릅니다.',
          '회사는 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 30일 전에 이용자에게 통지합니다.',
        ],
      },
    ],
  },
  {
    id: 8,
    title: '제8조 (이용자의 의무)',
    content: '이용자는 다음 행위를 하여서는 안 됩니다:',
    subsections: [
      {
        items: [
          '신청 또는 변경 시 허위 내용의 등록',
          '타인의 정보 도용',
          '회사가 게시한 정보의 무단 변경',
          '회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시',
          '회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해',
          '회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위',
          '외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위',
          '악성코드, 바이러스 등을 배포하는 행위',
          '서비스의 안정적 운영을 방해하는 행위',
          '다른 이용자에 대한 스팸, 광고성 게시물 등록',
          '기타 불법적이거나 부당한 행위',
        ],
      },
    ],
  },
  {
    id: 9,
    title: '제9조 (콘텐츠 및 스킬에 대한 권리와 책임)',
    subsections: [
      {
        subtitle: '1. 콘텐츠의 저작권',
        items: [
          '이용자가 서비스 내에 게시한 콘텐츠의 저작권은 해당 이용자에게 귀속됩니다.',
          '이용자는 자신이 게시한 콘텐츠에 대해 회사에 비독점적, 무상의 이용권을 부여하며, 회사는 서비스 운영, 홍보 목적으로 해당 콘텐츠를 이용할 수 있습니다.',
        ],
      },
      {
        subtitle: '2. 스킬 공유',
        items: [
          '이용자가 공유하는 스킬의 저작권은 해당 이용자에게 귀속됩니다.',
          '스킬을 공유하는 이용자는 해당 스킬이 제3자의 권리를 침해하지 않음을 보증합니다.',
          '회사는 이용자가 공유한 스킬의 내용에 대해 책임을 지지 않습니다.',
        ],
      },
      {
        subtitle: '3. 콘텐츠 관리',
        items: [
          '회사는 다음에 해당하는 콘텐츠를 사전 통지 없이 삭제하거나 비공개 처리할 수 있습니다:',
          '타인의 권리를 침해하는 콘텐츠',
          '법령에 위반되는 콘텐츠',
          '공서양속에 반하는 콘텐츠',
          '서비스 운영 정책에 위반되는 콘텐츠',
        ],
      },
    ],
  },
  {
    id: 10,
    title: '제10조 (개인정보보호)',
    subsections: [
      {
        items: [
          '회사는 이용자의 개인정보를 보호하기 위해 「개인정보 보호법」 등 관련 법령을 준수합니다.',
          '개인정보의 수집, 이용, 제공, 관리에 관한 구체적인 사항은 별도의 개인정보처리방침에서 정합니다.',
          '회사는 이용자의 귀책사유로 인해 노출된 개인정보에 대해서는 책임을 지지 않습니다.',
        ],
        link: {
          label: '개인정보처리방침 자세히 보기',
          href: '/privacy-policy',
        },
      },
    ],
  },
  {
    id: 11,
    title: '제11조 (면책조항)',
    subsections: [
      {
        items: [
          '회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중단 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.',
          '회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.',
          '회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.',
          '회사는 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에 관해서는 책임을 지지 않습니다.',
          '회사는 이용자 상호간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임도 없습니다.',
        ],
      },
    ],
  },
  {
    id: 12,
    title: '제12조 (분쟁해결)',
    subsections: [
      {
        items: [
          '회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리 절차를 마련합니다.',
          '회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 수원지방법원을 관할법원으로 합니다.',
          '회사와 이용자 간에 제기된 소송에는 대한민국법을 적용합니다.',
        ],
      },
    ],
  },
  {
    id: 13,
    title: '제13조 (기타)',
    subsections: [
      {
        items: [
          '본 약관에 명시되지 않은 사항은 관계법령 및 상관례에 따릅니다.',
          '회사는 필요한 경우 특정 서비스에 관하여 적용될 사항을 서비스 이용안내 또는 개별약관 등으로 정할 수 있습니다.',
        ],
      },
    ],
  },
];

export default function TermsOfServicePage() {
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
                이용약관
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                Terms of Service
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Content */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff',
        }}
      >
        <Container maxWidth="md">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fffbf5',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                }}
              >
                <Box component="span" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                  ViBB(비브)
                </Box>
                (이하 "회사")가 제공하는 서비스를 이용해 주셔서 감사합니다. 본 이용약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정하고 있습니다. 서비스를 이용하시기 전에 본 약관을 주의 깊게 읽어주시기 바랍니다.
              </Typography>
            </Paper>
          </motion.div>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.05 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: '#ff6b35',
                  }}
                >
                  {section.title}
                </Typography>

                {section.content && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      lineHeight: 1.8,
                      mb: section.subsections ? 3 : 0,
                    }}
                  >
                    {section.content}
                  </Typography>
                )}

                {section.subsections?.map((sub, subIndex) => (
                  <Box key={subIndex} sx={{ mb: subIndex < section.subsections!.length - 1 ? 3 : 0 }}>
                    {'subtitle' in sub && sub.subtitle && (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 1.5,
                          color: 'text.primary',
                        }}
                      >
                        {sub.subtitle}
                      </Typography>
                    )}

                    {'content' in sub && sub.content && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.8,
                          mb: 1.5,
                        }}
                      >
                        {sub.content}
                      </Typography>
                    )}

                    {'items' in sub && sub.items && (
                      <Box sx={{ pl: 2 }}>
                        {sub.items.map((item, itemIndex) => (
                          <Box
                            key={itemIndex}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.5,
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: '#ff6b35',
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
                        ))}
                      </Box>
                    )}

                    {'link' in sub && sub.link && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          component={Link}
                          href={sub.link.href}
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            borderColor: '#ff6b35',
                            color: '#ff6b35',
                            '&:hover': {
                              borderColor: '#ff6b35',
                              bgcolor: 'rgba(255, 107, 53, 0.08)',
                            },
                          }}
                        >
                          {sub.link.label}
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </Paper>
            </motion.div>
          ))}

          {/* Appendix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fffbf5',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#ff6b35',
                }}
              >
                부칙
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              >
                본 약관은 2025년 12월 1일부터 시행합니다.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
