'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  IconButton,
  useTheme,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Comment as CommentIcon,
  Bookmark as BookmarkIcon,
  Create as CreateIcon,
  ExitToApp as SignOutIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Article as ArticleIcon,
  Psychology as SkillIcon,
  Extension as McpIcon,
  TextSnippet as PromptIcon,
  Newspaper as NewsIcon,
  HourglassEmpty as PendingIcon,
  Warning as WarningIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/services/supabase';
import Link from 'next/link';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserProfile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'admin' | 'withdrawal';
  created_at: string;
  deletion_scheduled_at: string | null;
}

interface UserComment {
  id: string;
  content: string;
  created_at: string;
  content_id: string;
  content_title: string;
  content_type: string;
}

interface SavedContent {
  id: string;
  title: string;
  type: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post' | 'news';
  status: 'draft' | 'pending' | 'published' | 'hidden' | 'reported';
  view_count: number;
  upvote_count: number;
  bookmarked_at: string;
}

interface UserContribution {
  id: string;
  title: string;
  type: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post' | 'news';
  status: 'draft' | 'pending' | 'published' | 'hidden' | 'reported';
  view_count: number;
  upvote_count: number;
  created_at: string;
}

export default function MyPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { language } = useLanguage();

  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch user data
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch or create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          id: user.id,
          nickname: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          email: user.email,
          role: 'user',
        };

        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createdProfile) {
          setProfile(createdProfile as UserProfile);
          setEditNickname(createdProfile.nickname);
          setEditBio(typeof createdProfile.bio === 'string' ? createdProfile.bio : '');
        }
      } else if (profileData) {
        setProfile(profileData as UserProfile);
        setEditNickname(profileData.nickname);
        setEditBio(typeof profileData.bio === 'string' ? profileData.bio : '');
      }

      // Fetch user's reviews/comments
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          id,
          content,
          created_at,
          content_id,
          contents:content_id (title, type)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (reviewsData) {
        setComments(reviewsData.map((r: Record<string, unknown>) => ({
          id: r.id as string,
          content: r.content as string,
          created_at: r.created_at as string,
          content_id: r.content_id as string,
          content_title: (r.contents as Record<string, unknown>)?.title as string || 'Unknown',
          content_type: (r.contents as Record<string, unknown>)?.type as string || 'post',
        })));
      }

      // Fetch bookmarked contents using RPC
      const { data: bookmarksData, error: bookmarksError } = await supabase.rpc('get_my_bookmarks', {
        sort_by: 'latest',
        page_size: 50,
      });

      if (!bookmarksError && bookmarksData) {
        setSavedContents(bookmarksData.map((b: Record<string, unknown>) => ({
          id: b.id as string,
          title: b.title as string || 'Unknown',
          type: b.type as SavedContent['type'],
          status: b.status as SavedContent['status'],
          view_count: b.view_count as number || 0,
          upvote_count: b.upvote_count as number || 0,
          bookmarked_at: b.bookmarked_at as string,
        })));
      }

      // Fetch user's contributions using RPC
      const { data: contributionsData, error: contributionsError } = await supabase.rpc('get_my_contents', {
        sort_by: 'latest',
        page_size: 50,
      });

      if (!contributionsError && contributionsData) {
        setContributions(contributionsData.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          title: c.title as string,
          type: c.type as UserContribution['type'],
          status: c.status as UserContribution['status'],
          view_count: c.view_count as number || 0,
          upvote_count: c.upvote_count as number || 0,
          created_at: c.created_at as string,
        })));
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setSaving(true);

    console.log('Saving profile for user.id:', user.id);
    console.log('Current profile.id:', profile.id);

    try {
      // Use upsert to handle both insert and update cases
      // This also works better with some RLS configurations
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nickname: editNickname,
          bio: editBio,
        })
        .select();

      if (error) {
        console.error('Error saving profile:', error);
        alert(language === 'ko' ? '프로필 저장에 실패했습니다: ' + error.message : 'Failed to save profile: ' + error.message);
      } else if (!data || data.length === 0) {
        console.error('No rows updated. User ID:', user.id);
        alert(language === 'ko' ? '프로필을 찾을 수 없습니다.' : 'Profile not found.');
      } else {
        console.log('Profile updated:', data);
        setProfile({ ...profile, nickname: editNickname, bio: editBio });
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(language === 'ko' ? '프로필 저장 중 오류가 발생했습니다.' : 'Error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleRequestDeletion = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('request_account_deletion');

      if (error) {
        alert(language === 'ko' ? '탈퇴 요청 실패: ' + error.message : 'Deletion request failed: ' + error.message);
        return;
      }

      // Calculate the deletion date (7 days from now) for UI update
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 7);

      setProfile(prev => prev ? { ...prev, deletion_scheduled_at: deletionDate.toISOString() } : null);
      setDeleteDialogOpen(false);
      alert(language === 'ko' ? '7일 후에 계정이 삭제됩니다.' : 'Your account will be deleted in 7 days.');
    } catch (error) {
      console.error('Error scheduling deletion:', error);
      alert(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
    }
  };

  const handleCancelDeletion = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('cancel_account_deletion');

      if (error) {
        alert(language === 'ko' ? '취소 실패: ' + error.message : 'Cancel failed: ' + error.message);
        return;
      }

      setProfile(prev => prev ? { ...prev, deletion_scheduled_at: null } : null);
      alert(language === 'ko' ? '탈퇴가 취소되었습니다.' : 'Account deletion cancelled.');
    } catch (error) {
      console.error('Error canceling deletion:', error);
      alert(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
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

  const getOAuthProvider = () => {
    const provider = user?.app_metadata?.provider;
    if (provider === 'google') return { icon: <GoogleIcon />, name: 'Google' };
    if (provider === 'github') return { icon: <GitHubIcon />, name: 'GitHub' };
    return { icon: <PersonIcon />, name: 'Email' };
  };

  const getDaysUntilDeletion = () => {
    if (!profile?.deletion_scheduled_at) return null;
    const deletionDate = new Date(profile.deletion_scheduled_at);
    const now = new Date();
    const diffTime = deletionDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (authLoading || loading) {
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

  if (!user) {
    return null;
  }

  const oauthProvider = getOAuthProvider();
  const daysUntilDeletion = getDaysUntilDeletion();

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, minHeight: '70vh' }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 4 }}
        >
          {language === 'ko' ? '마이페이지' : 'My Page'}
        </Typography>

        {/* Deletion Warning */}
        {daysUntilDeletion !== null && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleCancelDeletion}>
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
            }
          >
            {language === 'ko'
              ? `계정 삭제 예정: ${daysUntilDeletion}일 후 삭제됩니다.`
              : `Account scheduled for deletion in ${daysUntilDeletion} days.`}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<PersonIcon />}
              iconPosition="start"
              label={language === 'ko' ? '계정 정보' : 'Account'}
            />
            <Tab
              icon={<CommentIcon />}
              iconPosition="start"
              label={language === 'ko' ? '내 댓글' : 'My Comments'}
            />
            <Tab
              icon={<BookmarkIcon />}
              iconPosition="start"
              label={language === 'ko' ? '저장한 콘텐츠' : 'Saved'}
            />
            <Tab
              icon={<CreateIcon />}
              iconPosition="start"
              label={language === 'ko' ? '기여' : 'Contributions'}
            />
          </Tabs>
        </Box>

        {/* Account Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
              {/* Avatar */}
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={profile?.avatar_url || user.user_metadata?.avatar_url}
                  sx={{ width: 100, height: 100 }}
                >
                  {profile?.nickname?.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Profile Info */}
              <Box sx={{ flex: 1 }}>
                {editing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label={language === 'ko' ? '닉네임' : 'Nickname'}
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label={language === 'ko' ? '자기소개' : 'Bio'}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      size="small"
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={saving}
                        size="small"
                      >
                        {language === 'ko' ? '저장' : 'Save'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditing(false);
                          setEditNickname(profile?.nickname || '');
                          setEditBio(typeof profile?.bio === 'string' ? profile.bio : '');
                        }}
                        size="small"
                      >
                        {language === 'ko' ? '취소' : 'Cancel'}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {profile?.nickname}
                      </Typography>
                      <IconButton size="small" onClick={() => setEditing(true)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {(typeof profile?.bio === 'string' && profile.bio.trim()) || (language === 'ko' ? '자기소개를 작성해주세요' : 'Add a bio')}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* OAuth Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {language === 'ko' ? '로그인 정보' : 'Login Information'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                {oauthProvider.icon}
                <Typography variant="body2">
                  {oauthProvider.name} - {user.email}
                </Typography>
              </Box>
            </Box>

            {/* Account Created */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {language === 'ko' ? '가입일' : 'Member Since'}
              </Typography>
              <Typography variant="body2">
                {new Date(profile?.created_at || user.created_at || '').toLocaleDateString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Account Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SignOutIcon />}
                onClick={() => setSignOutDialogOpen(true)}
              >
                {language === 'ko' ? '로그아웃' : 'Sign Out'}
              </Button>

              {!profile?.deletion_scheduled_at && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<WarningIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  {language === 'ko' ? '계정 삭제 요청' : 'Request Account Deletion'}
                </Button>
              )}
            </Box>
          </Paper>
        </TabPanel>

        {/* My Comments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            {comments.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CommentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">
                  {language === 'ko' ? '작성한 댓글이 없습니다' : 'No comments yet'}
                </Typography>
              </Box>
            ) : (
              <List>
                {comments.map((comment, index) => (
                  <Box key={comment.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      component={Link}
                      href={getContentLink(comment.content_type, comment.content_id)}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <ListItemIcon>
                        {getContentIcon(comment.content_type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {comment.content}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {comment.content_title}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {new Date(comment.created_at).toLocaleDateString()}
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
        </TabPanel>

        {/* Saved Contents Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            {savedContents.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <BookmarkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">
                  {language === 'ko' ? '저장한 콘텐츠가 없습니다' : 'No saved content'}
                </Typography>
              </Box>
            ) : (
              <List>
                {savedContents.map((content, index) => (
                  <Box key={content.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      component={Link}
                      href={getContentLink(content.type, content.id)}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <ListItemIcon>
                        {getContentIcon(content.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={content.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={content.type}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="text.disabled">
                              {new Date(content.bookmarked_at).toLocaleDateString()}
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
        </TabPanel>

        {/* Contributions Tab */}
        <TabPanel value={tabValue} index={3}>
          <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            {contributions.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CreateIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
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
                      <ListItemIcon>
                        {getContentIcon(contribution.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={contribution.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={contribution.type}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                            {contribution.status === 'pending' && (
                              <Chip
                                icon={<PendingIcon sx={{ fontSize: 14 }} />}
                                label={language === 'ko' ? '검토중' : 'Pending'}
                                size="small"
                                color="warning"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                            {contribution.status === 'reported' && (
                              <Chip
                                icon={<WarningIcon sx={{ fontSize: 14 }} />}
                                label={language === 'ko' ? '신고됨' : 'Reported'}
                                size="small"
                                color="error"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                            {contribution.status === 'hidden' && (
                              <Chip
                                label={language === 'ko' ? '숨김' : 'Hidden'}
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'grey.300' }}
                              />
                            )}
                            {contribution.status === 'draft' && (
                              <Chip
                                label={language === 'ko' ? '임시저장' : 'Draft'}
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'grey.200' }}
                              />
                            )}
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
        </TabPanel>
      </Container>

      {/* Sign Out Dialog */}
      <Dialog open={signOutDialogOpen} onClose={() => setSignOutDialogOpen(false)}>
        <DialogTitle>
          {language === 'ko' ? '로그아웃' : 'Sign Out'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {language === 'ko' ? '정말 로그아웃하시겠습니까?' : 'Are you sure you want to sign out?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignOutDialogOpen(false)}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button onClick={handleSignOut} color="primary" variant="contained">
            {language === 'ko' ? '로그아웃' : 'Sign Out'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>
          {language === 'ko' ? '계정 삭제 요청' : 'Request Account Deletion'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {language === 'ko'
              ? '계정 삭제를 요청하면 7일 후 모든 데이터가 삭제됩니다. 이 기간 내에 취소할 수 있습니다.'
              : 'If you request account deletion, all your data will be deleted after 7 days. You can cancel within this period.'}
          </Alert>
          <Typography>
            {language === 'ko'
              ? '정말 계정을 삭제하시겠습니까?'
              : 'Are you sure you want to delete your account?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button onClick={handleRequestDeletion} color="error" variant="contained">
            {language === 'ko' ? '삭제 요청' : 'Request Deletion'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <ScrollToTopFab />
    </>
  );
}
