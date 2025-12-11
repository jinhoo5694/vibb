'use client';

import { Container } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { CommunityBoard } from '@/components/Community';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MCPPage() {
  const { language } = useLanguage();

  return (
    <>
      <Header />

      {/* Community Board */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <CommunityBoard
          boardType="mcp"
          title={language === 'ko' ? 'MCP 게시판' : 'MCP Board'}
          subtitle={language === 'ko'
            ? 'MCP 관련 질문, 정보, 후기를 자유롭게 나눠보세요'
            : 'Freely share questions, information, and reviews about MCP'}
        />
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
