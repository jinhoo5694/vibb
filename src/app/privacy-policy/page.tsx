'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { Box, Container, Typography, useTheme, Paper, Divider, Link as MuiLink, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { motion } from 'framer-motion';

const sections = [
  {
    id: 1,
    title: '제1조 (개인정보의 처리목적)',
    content: `회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.`,
    subsections: [
      {
        subtitle: '1. 회원가입 및 관리',
        items: [
          '회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증',
          '회원자격 유지·관리, 서비스 부정이용 방지',
          '각종 고지·통지, 고충처리',
        ],
      },
      {
        subtitle: '2. 서비스 제공',
        items: [
          '바이브 코딩 관련 콘텐츠 제공, 게시물 작성·관리',
          '맞춤형 서비스 제공, 서비스 이용 기록과 접속 빈도 분석',
          '신규 서비스 개발 및 서비스 개선',
        ],
      },
      {
        subtitle: '3. 마케팅 및 광고 활용 (선택 동의 시)',
        items: [
          '이벤트·프로모션 정보 제공',
          '서비스 이용 통계 및 분석',
        ],
      },
    ],
  },
  {
    id: 2,
    title: '제2조 (개인정보의 수집항목 및 수집방법)',
    subsections: [
      {
        subtitle: '1. 수집하는 개인정보 항목',
        table: {
          headers: ['구분', '수집항목', '수집목적'],
          rows: [
            ['필수', '이메일 주소, 이름(닉네임), 프로필 사진, 소셜 계정 식별자', '회원 식별, 서비스 제공'],
            ['자동수집', '서비스 이용기록, 접속 로그, 접속 IP, 쿠키, 기기정보', '서비스 개선, 부정이용 방지'],
            ['선택', '연락처, 관심분야', '맞춤형 서비스, 마케팅'],
          ],
        },
      },
      {
        subtitle: '2. 개인정보 수집방법',
        items: [
          '소셜 로그인(Google, GitHub) 연동을 통한 수집',
          '서비스 이용 과정에서 이용자가 직접 입력',
          '서비스 이용 과정에서 자동 생성·수집',
        ],
      },
    ],
  },
  {
    id: 3,
    title: '제3조 (개인정보의 처리 및 보유기간)',
    content: '회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.',
    subsections: [
      {
        subtitle: '1. 회원 정보',
        items: [
          '보유기간: 회원 탈퇴 시까지',
          '탈퇴 후 유예기간: 7일 (복구 요청 가능 기간)',
        ],
      },
      {
        subtitle: '2. 관계법령에 따른 보존',
        table: {
          headers: ['보존 항목', '보존 기간', '근거 법령'],
          rows: [
            ['계약 또는 청약철회 등에 관한 기록', '5년', '전자상거래 등에서의 소비자보호에 관한 법률'],
            ['대금결제 및 재화 등의 공급에 관한 기록', '5년', '전자상거래 등에서의 소비자보호에 관한 법률'],
            ['소비자의 불만 또는 분쟁처리에 관한 기록', '3년', '전자상거래 등에서의 소비자보호에 관한 법률'],
            ['표시·광고에 관한 기록', '6개월', '전자상거래 등에서의 소비자보호에 관한 법률'],
            ['웹사이트 방문기록', '3개월', '통신비밀보호법'],
          ],
        },
      },
      {
        subtitle: '3. 내부방침에 따른 보존 (탈퇴회원)',
        items: [
          '보존 항목: 회원 식별자(해시 처리), 탈퇴일',
          '보존 기간: 탈퇴 후 1년',
          '보존 사유: 부정이용 방지, 재가입 방지, 분쟁 대응, 수사협조',
        ],
      },
    ],
  },
  {
    id: 4,
    title: '제4조 (개인정보의 파기절차 및 파기방법)',
    content: '회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.',
    subsections: [
      {
        subtitle: '1. 파기절차',
        items: [
          '이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 파기됩니다.',
          '별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.',
        ],
      },
      {
        subtitle: '2. 파기방법',
        items: [
          '전자적 파일: 기록을 재생할 수 없는 기술적 방법을 사용하여 영구 삭제',
          '종이 문서: 분쇄기로 분쇄하거나 소각',
        ],
      },
    ],
  },
  {
    id: 5,
    title: '제5조 (회원 탈퇴 처리)',
    subsections: [
      {
        subtitle: '1. 탈퇴 신청',
        items: [
          '이용자는 서비스 내 \'마이페이지 > 회원탈퇴\' 메뉴를 통해 직접 탈퇴 신청을 할 수 있습니다.',
        ],
      },
      {
        subtitle: '2. 탈퇴 유예기간',
        items: [
          '탈퇴 신청 후 7일간의 유예기간이 적용됩니다.',
          '유예기간 내 재로그인이 가능하며, \'마이페이지\'에서 탈퇴 취소가 가능합니다.',
          '유예기간 동안 서비스 이용은 제한됩니다.',
        ],
      },
      {
        subtitle: '3. 실제 탈퇴 처리',
        items: [
          '유예기간 종료 후 개인정보는 즉시 파기 처리됩니다.',
          '단, 제3조 제2항 및 제3항에 따라 보존이 필요한 정보는 별도 분리하여 보관합니다.',
          '탈퇴 회원이 작성한 게시물 또는 댓글은 삭제되지 않으며, \'알 수 없음\' 또는 임의 닉네임으로 표시됩니다.',
        ],
      },
    ],
  },
  {
    id: 6,
    title: '제6조 (정보주체의 권리·의무 및 행사방법)',
    content: '이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.',
    subsections: [
      {
        subtitle: '1. 정보주체의 권리',
        items: [
          '개인정보 열람 요구',
          '오류 등이 있을 경우 정정 요구',
          '삭제 요구',
          '처리정지 요구',
        ],
      },
      {
        subtitle: '2. 권리 행사 방법',
        items: [
          '서비스 내 \'마이페이지\' 메뉴에서 직접 조회·수정',
          '개인정보 보호책임자에게 서면, 이메일로 요청',
          '회사는 요청을 받은 날로부터 10일 이내에 조치하고 그 결과를 통지합니다.',
        ],
      },
    ],
  },
  {
    id: 7,
    title: '제7조 (개인정보의 안전성 확보조치)',
    content: '회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.',
    subsections: [
      {
        subtitle: '1. 관리적 조치',
        items: [
          '내부관리계획 수립·시행',
          '개인정보 취급 직원의 최소화 및 교육',
        ],
      },
      {
        subtitle: '2. 기술적 조치',
        items: [
          '개인정보처리시스템 접근권한 관리',
          '고유식별정보 등의 암호화',
          '보안프로그램 설치 및 갱신',
          '접속기록의 보관 및 위·변조 방지',
        ],
      },
      {
        subtitle: '3. 물리적 조치',
        items: [
          '전산실, 자료보관실 등에 대한 접근 통제',
        ],
      },
    ],
  },
  {
    id: 8,
    title: '제8조 (쿠키의 설치·운영 및 거부)',
    subsections: [
      {
        subtitle: '1. 쿠키의 사용 목적',
        items: [
          '로그인 상태 유지',
          '이용자의 서비스 이용 형태 분석',
          '맞춤형 서비스 제공',
        ],
      },
      {
        subtitle: '2. 쿠키 설정 거부 방법',
        content: '이용자는 웹브라우저의 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.',
        items: [
          'Chrome: 설정 > 개인정보 및 보안 > 쿠키 및 기타 사이트 데이터',
          'Edge: 설정 > 쿠키 및 사이트 권한 > 쿠키 및 사이트 데이터 관리 및 삭제',
          'Safari: 환경설정 > 개인정보 보호',
        ],
      },
    ],
  },
  {
    id: 9,
    title: '제9조 (소셜 로그인 관련 고지)',
    content: '회사는 Google 및 GitHub의 OAuth 서비스를 통해 소셜 로그인 기능을 제공합니다.',
    subsections: [
      {
        subtitle: '1. 소셜 로그인 시 수집 정보',
        items: [
          '해당 소셜 서비스에서 공개 설정한 정보 중 회사가 요청한 항목만 수집됩니다.',
          '회사는 비밀번호를 저장하지 않습니다.',
        ],
      },
      {
        subtitle: '2. 소셜 연동 해제',
        items: [
          '이용자는 각 소셜 서비스의 계정 설정에서 ViBB와의 연동을 해제할 수 있습니다.',
          '연동 해제 시에도 ViBB에 이미 저장된 정보는 회원 탈퇴 전까지 유지됩니다.',
        ],
      },
      {
        subtitle: '3. 각 소셜 서비스의 개인정보처리방침',
        links: [
          { label: 'Google', url: 'https://policies.google.com/privacy' },
          { label: 'GitHub', url: 'https://docs.github.com/en/site-policy/privacy-policies' },
        ],
      },
    ],
  },
  {
    id: 10,
    title: '제10조 (개인정보 보호책임자)',
    content: '회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.',
    subsections: [
      {
        table: {
          headers: ['구분', '내용'],
          rows: [
            ['직책', '개인정보 보호책임자'],
            ['성명', '유권우'],
            ['연락처', 'doworkslaves@gmail.com'],
          ],
        },
        note: '※ 개인정보 보호 관련 문의는 위 담당자에게 연락해 주시기 바라며, 회사는 정보주체의 문의에 대해 신속하고 충실하게 답변해 드리겠습니다.',
      },
    ],
  },
  {
    id: 11,
    title: '제11조 (권익침해 구제방법)',
    content: '정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.',
    subsections: [
      {
        table: {
          headers: ['기관명', '연락처', '홈페이지'],
          rows: [
            ['개인정보분쟁조정위원회', '1833-6972', 'www.kopico.go.kr'],
            ['개인정보침해신고센터', '118', 'privacy.kisa.or.kr'],
            ['대검찰청 사이버수사과', '1301', 'www.spo.go.kr'],
            ['경찰청 사이버안전국', '182', 'cyberbureau.police.go.kr'],
          ],
        },
      },
    ],
  },
  {
    id: 12,
    title: '제12조 (개인정보처리방침 변경)',
    content: '개인정보처리방침 내용 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.',
    subsections: [
      {
        items: [
          '다만, 개인정보의 수집 및 활용, 제3자 제공 등과 같이 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.',
        ],
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                개인정보처리방침
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                Privacy Policy
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
                (이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
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

                    {'table' in sub && sub.table && (
                      <TableContainer
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow
                              sx={{
                                bgcolor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f8f9fa',
                              }}
                            >
                              {sub.table.headers.map((header, hIndex) => (
                                <TableCell
                                  key={hIndex}
                                  sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sub.table.rows.map((row, rIndex) => (
                              <TableRow key={rIndex}>
                                {row.map((cell, cIndex) => (
                                  <TableCell
                                    key={cIndex}
                                    sx={{
                                      color: 'text.secondary',
                                      borderBottom: `1px solid ${theme.palette.divider}`,
                                      fontSize: '0.813rem',
                                    }}
                                  >
                                    {cell}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {'links' in sub && sub.links && (
                      <Box sx={{ pl: 2 }}>
                        {sub.links.map((link, linkIndex) => (
                          <Box
                            key={linkIndex}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {link.label}:
                            </Typography>
                            <MuiLink
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#ff6b35',
                                fontSize: '0.875rem',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {link.url}
                            </MuiLink>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {'note' in sub && sub.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mt: 2,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                        }}
                      >
                        {sub.note}
                      </Typography>
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
                본 방침은 2025년 12월 1일부터 시행합니다.
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
