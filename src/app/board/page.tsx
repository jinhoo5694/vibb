'use client';

import { Container } from '@mui/material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { CommunityBoard } from '@/components/Community';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GeneralBoardPage() {
  const { language } = useLanguage();

  return (
    <>
      <Header />

      {/* Community Board */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <CommunityBoard
          boardType="general"
          title={language === 'ko' ? '커뮤니티' : 'Community'}
          subtitle={language === 'ko'
            ? '자유롭게 이야기를 나누세요'
            : 'Share your thoughts freely'}
        />
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
