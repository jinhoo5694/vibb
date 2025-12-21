'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Psychology as SkillIcon,
  Extension as McpIcon,
  TextSnippet as PromptIcon,
  Newspaper as NewsIcon,
  Block as BlockIcon,
  HourglassEmpty as PendingIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/services/supabase';
import Link from 'next/link';

interface UserProfile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface UserContribution {
  id: string;
  title: string;
  type: string;
  status: 'published' | 'pending' | 'blocked';
  created_at: string;
}

export default function PublicProfilePage() {
  const theme = useTheme();
  const params = useParams();
  const userId = params.userId as string;
  const { language } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setNotFound(false);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_url, bio, created_at')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData as UserProfile);

      // Fetch user's public contributions (only published ones)
      const { data: contributionsData } = await supabase
        .from('contents')
        .select('id, title, type, created_at, metadata')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (contributionsData) {
        // Filter to only show published content to public
        const publicContributions = contributionsData
          .map((c: Record<string, unknown>) => ({
            id: c.id as string,
            title: c.title as string,
            type: c.type as string,
            status: (c.metadata as Record<string, unknown>)?.status as 'published' | 'pending' | 'blocked' || 'published',
            created_at: c.created_at as string,
          }))
          .filter((c: UserContribution) => c.status === 'published');

        setContributions(publicContributions);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'skill': return <SkillIcon />;
      case 'mcp': return <McpIcon />;
      case 'prompt': return <PromptIcon />;
      case 'post': return <ArticleIcon />;
      case 'ai_tool': return <NewsIcon />;
      default: return <ArticleIcon />;
    }
  };

  const getContentLink = (type: string, id: string) => {
    switch (type) {
      case 'skill': return `/skill/${id}`;
      case 'post': return `/board/${id}`;
      default: return `/${type}/${id}`;
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, { ko: string; en: string }> = {
      skill: { ko: '스킬', en: 'Skill' },
      mcp: { ko: 'MCP', en: 'MCP' },
      prompt: { ko: '프롬프트', en: 'Prompt' },
      post: { ko: '게시글', en: 'Post' },
      ai_tool: { ko: 'AI 도구', en: 'AI Tool' },
    };
    return language === 'ko' ? labels[type]?.ko || type : labels[type]?.en || type;
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, minHeight: '70vh' }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              {language === 'ko' ? '사용자를 찾을 수 없습니다' : 'User not found'}
            </Typography>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, minHeight: '70vh' }}>
        {/* Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Avatar */}
            <Avatar
              src={profile?.avatar_url || undefined}
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              {profile?.nickname?.charAt(0).toUpperCase()}
            </Avatar>

            {/* Profile Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  mb: 1,
                }}
              >
                {profile?.nickname}
              </Typography>

              {profile?.bio && typeof profile.bio === 'string' && profile.bio.trim() ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {profile.bio}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ fontStyle: 'italic' }}
                >
                  {language === 'ko' ? '소개가 없습니다' : 'No bio available'}
                </Typography>
              )}

              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ display: 'block', mt: 1 }}
              >
                {language === 'ko' ? '가입일: ' : 'Joined: '}
                {new Date(profile?.created_at || '').toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Contributions Section */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          {language === 'ko' ? '기여' : 'Contributions'}
          {contributions.length > 0 && (
            <Chip
              label={contributions.length}
              size="small"
              sx={{ ml: 1, height: 24 }}
            />
          )}
        </Typography>

        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          {contributions.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                {language === 'ko' ? '작성한 콘텐츠가 없습니다' : 'No contributions yet'}
              </Typography>
            </Box>
          ) : (
            <List>
              {contributions.map((contribution, index) => (
                <Box key={contribution.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    component={Link}
                    href={getContentLink(contribution.type, contribution.id)}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      {getContentIcon(contribution.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {contribution.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={getContentTypeLabel(contribution.type)}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: `${theme.palette.primary.main}15`,
                              color: theme.palette.primary.main,
                            }}
                          />
                          <Typography variant="caption" color="text.disabled">
                            {new Date(contribution.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      <Footer />
      <ScrollToTopFab />
    </>
  );
}
