'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Button } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import NextLink from 'next/link';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { CommunityBoard } from '@/components/Community';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/supabase';

export default function GeneralBoardPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const profile = await getUserProfile(user.id);
      setIsAdmin(profile?.role === 'admin');
    }
    checkAdmin();
  }, [user]);

  return (
    <>
      <Header />

      {/* Community Board */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Admin Button */}
        {isAdmin && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              component={NextLink}
              href="/admin"
              variant="outlined"
              startIcon={<AdminIcon />}
              sx={{
                borderColor: '#ff6b35',
                color: '#ff6b35',
                '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.1)', borderColor: '#e55a2b' },
                borderRadius: 2,
                px: 2,
                py: 0.75,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {language === 'ko' ? '관리자' : 'Admin'}
            </Button>
          </Box>
        )}

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
