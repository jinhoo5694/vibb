'use client';

import { use, useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewsCategory, NewsItem, categoryIcons } from '@/types/news';
import { getNewsById, updateNews, CreateNewsInput } from '@/services/newsService';
import { getUserProfile } from '@/services/supabase';
import { isDebugMode } from '@/lib/debug';

const categories: NewsCategory[] = ['AI', '개발', '스타트업', '트렌드', '튜토리얼'];

// Language options for code blocks
const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
];

// Sample news data for debug mode
const sampleNewsDetail: NewsItem = {
  id: '1',
  title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
  content: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다.',
  source: 'Anthropic Blog',
  sourceUrl: 'https://www.anthropic.com/news',
  category: 'AI',
  createdAt: new Date(),
  upvoteCount: 342,
  downvoteCount: 12,
  commentCount: 89,
  viewCount: 2850,
  status: 'published',
};

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const theme = useTheme();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const isDark = theme.palette.mode === 'dark';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState<NewsCategory>('AI');

  // Editor mode
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  // Code dialog states
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState(CODE_LANGUAGES[0]);
  const [codeContent, setCodeContent] = useState('');

  // Link dialog states
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Fetch news data
  useEffect(() => {
    async function fetchNews() {
      setLoadingNews(true);

      if (isDebugMode()) {
        const data = { ...sampleNewsDetail, id };
        setNews(data);
        setTitle(data.title);
        setContent(data.content);
        setSource(data.source);
        setSourceUrl(data.sourceUrl);
        setCategory(data.category);
        setLoadingNews(false);
        return;
      }

      try {
        const newsData = await getNewsById(id);
        if (newsData) {
          setNews(newsData);
          setTitle(newsData.title);
          setContent(newsData.content);
          setSource(newsData.source);
          setSourceUrl(newsData.sourceUrl);
          setCategory(newsData.category);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoadingNews(false);
      }
    }
    fetchNews();
  }, [id]);

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (authLoading) return;

      if (!user?.id) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingAdmin(false);
      }
    }
    checkAdmin();
  }, [user?.id, authLoading]);

  // Insert text at cursor position
  const insertAtCursor = useCallback(
    (textToInsert: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setContent((prev) => prev + textToInsert);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + textToInsert + content.slice(end);
      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 0);
    },
    [content]
  );

  // Open code dialog
  const openCodeDialog = () => {
    setCodeLanguage(CODE_LANGUAGES[0]);
    setCodeContent('');
    setShowCodeDialog(true);
  };

  // Insert code block
  const insertCodeBlock = () => {
    if (!codeContent.trim()) {
      setShowCodeDialog(false);
      return;
    }

    const codeBlock = `\n\`\`\`${codeLanguage.value}\n${codeContent}\n\`\`\`\n`;
    insertAtCursor(codeBlock);
    setShowCodeDialog(false);
    setCodeContent('');
  };

  // Open link dialog
  const openLinkDialog = () => {
    setLinkText('');
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  // Insert link
  const insertLink = () => {
    if (!linkText.trim() || !linkUrl.trim()) {
      setShowLinkDialog(false);
      return;
    }

    const link = `[${linkText}](${linkUrl})`;
    insertAtCursor(link);
    setShowLinkDialog(false);
    setLinkText('');
    setLinkUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim() || !source.trim()) {
      setError(language === 'ko' ? '필수 항목을 모두 입력해주세요' : 'Please fill in all required fields');
      return;
    }

    if (!user) return;

    setSaving(true);
    try {
      const input: CreateNewsInput = {
        title: title.trim(),
        content: content.trim(),
        source: source.trim(),
        sourceUrl: sourceUrl.trim() || '#',
        category,
        authorId: user.id,
      };

      const success = await updateNews(id, input);
      if (success) {
        router.push(`/news/${id}`);
      } else {
        setError(language === 'ko' ? '뉴스 수정에 실패했습니다' : 'Failed to update news');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      setError(language === 'ko' ? '뉴스 수정에 실패했습니다' : 'Failed to update news');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (authLoading || checkingAdmin || loadingNews) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Skeleton variant="text" width={100} height={40} sx={{ mb: 3 }} />
          <Skeleton variant="text" width="40%" height={50} sx={{ mb: 4 }} />
          <Skeleton variant="rounded" height={400} />
        </Container>
        <Footer />
      </>
    );
  }

  // Not authorized
  if (!user || !isAdmin) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {language === 'ko' ? '접근 권한이 없습니다' : 'Access Denied'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {language === 'ko'
              ? '관리자만 뉴스를 수정할 수 있습니다'
              : 'Only admins can edit news'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/news')}
            sx={{
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e55a2b' },
            }}
          >
            {language === 'ko' ? '뉴스 목록으로' : 'Back to News'}
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  // News not found
  if (!news) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {language === 'ko' ? '뉴스를 찾을 수 없습니다' : 'News not found'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/news')}
            sx={{
              mt: 3,
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e55a2b' },
            }}
          >
            {language === 'ko' ? '뉴스 목록으로' : 'Back to News'}
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/news/${id}`)}
            sx={{
              mb: 3,
              color: 'text.secondary',
              '&:hover': { color: '#ff6b35' },
            }}
          >
            {language === 'ko' ? '뒤로 가기' : 'Go Back'}
          </Button>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 4,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '뉴스 수정' : 'Edit News'}
          </Typography>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? '#1a1a1a' : '#fff',
              overflow: 'hidden',
            }}
          >
            {error && (
              <Alert severity="error" sx={{ m: 3, mb: 0 }}>
                {error}
              </Alert>
            )}

            {/* Basic Info Section */}
            <Box sx={{ p: { xs: 3, md: 4 }, pb: 2 }}>
              <TextField
                fullWidth
                label={language === 'ko' ? '제목 *' : 'Title *'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 3 }}
                disabled={saving}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>{language === 'ko' ? '카테고리' : 'Category'}</InputLabel>
                  <Select
                    value={category}
                    label={language === 'ko' ? '카테고리' : 'Category'}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    disabled={saving}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{categoryIcons[cat]}</span>
                          <span>{cat}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={language === 'ko' ? '출처 *' : 'Source *'}
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder={language === 'ko' ? '예: Anthropic Blog' : 'e.g., Anthropic Blog'}
                  disabled={saving}
                  sx={{ flex: 1, minWidth: 200 }}
                />

                <TextField
                  label={language === 'ko' ? '출처 URL' : 'Source URL'}
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={saving}
                  sx={{ flex: 1, minWidth: 200 }}
                />
              </Box>
            </Box>

            {/* Content Editor Section */}
            <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
              {/* Toolbar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  p: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<CodeIcon />}
                    variant="outlined"
                    onClick={openCodeDialog}
                    disabled={editorMode === 'preview' || saving}
                    sx={{ textTransform: 'none' }}
                  >
                    {language === 'ko' ? '코드' : 'Code'}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<LinkIcon />}
                    variant="outlined"
                    onClick={openLinkDialog}
                    disabled={editorMode === 'preview' || saving}
                    sx={{ textTransform: 'none' }}
                  >
                    {language === 'ko' ? '링크' : 'Link'}
                  </Button>
                </Box>

                <ToggleButtonGroup
                  value={editorMode}
                  exclusive
                  onChange={(_, newMode) => {
                    if (newMode) setEditorMode(newMode);
                  }}
                  size="small"
                >
                  <ToggleButton value="edit" sx={{ textTransform: 'none', px: 2 }}>
                    <EditIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    {language === 'ko' ? '편집' : 'Edit'}
                  </ToggleButton>
                  <ToggleButton value="preview" sx={{ textTransform: 'none', px: 2 }}>
                    <VisibilityIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    {language === 'ko' ? '미리보기' : 'Preview'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Editor / Preview Area */}
              <Box
                sx={{
                  minHeight: 300,
                  p: 2,
                }}
              >
                {editorMode === 'edit' ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    placeholder={language === 'ko' ? '뉴스 내용을 입력하세요... (마크다운 지원)' : 'Enter news content... (Markdown supported)'}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    inputRef={textareaRef}
                    disabled={saving}
                    variant="standard"
                    slotProps={{
                      input: {
                        disableUnderline: true,
                        sx: {
                          fontSize: '0.95rem',
                          lineHeight: 1.8,
                        },
                      },
                    }}
                  />
                ) : (
                  <Box sx={{ minHeight: 200 }}>
                    {content.trim() ? (
                      <MarkdownPreview content={content} isDark={isDark} />
                    ) : (
                      <Typography color="text.disabled" sx={{ fontStyle: 'italic' }}>
                        {language === 'ko' ? '미리보기할 내용이 없습니다.' : 'No content to preview.'}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              {/* Character count */}
              <Box
                sx={{
                  p: 1.5,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography variant="caption" color="text.disabled">
                  {content.length} {language === 'ko' ? '자' : 'characters'}
                </Typography>
              </Box>
            </Box>

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', p: { xs: 3, md: 4 }, pt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push(`/news/${id}`)}
                disabled={saving}
                sx={{
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                }}
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={saving}
                sx={{
                  bgcolor: '#ff6b35',
                  '&:hover': { bgcolor: '#e55a2b' },
                  px: 4,
                }}
              >
                {saving
                  ? (language === 'ko' ? '저장 중...' : 'Saving...')
                  : (language === 'ko' ? '저장' : 'Save')}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Code Dialog */}
      <Dialog open={showCodeDialog} onClose={() => setShowCodeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{language === 'ko' ? '코드 블럭 삽입' : 'Insert Code Block'}</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={CODE_LANGUAGES}
            getOptionLabel={(option) => option.label}
            value={codeLanguage}
            onChange={(_, newValue) => newValue && setCodeLanguage(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={language === 'ko' ? '언어' : 'Language'}
                margin="dense"
              />
            )}
            disableClearable
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={8}
            label={language === 'ko' ? '코드' : 'Code'}
            placeholder={language === 'ko' ? '코드를 입력하세요...' : 'Enter your code...'}
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            slotProps={{
              input: {
                sx: { fontFamily: 'monospace', fontSize: '0.9rem' },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCodeDialog(false)}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={insertCodeBlock}
            disabled={!codeContent.trim()}
            variant="contained"
            sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}
          >
            {language === 'ko' ? '삽입' : 'Insert'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'ko' ? '링크 삽입' : 'Insert Link'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={language === 'ko' ? '링크 제목' : 'Link Text'}
            fullWidth
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLinkDialog(false)}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={insertLink}
            disabled={!linkText.trim() || !linkUrl.trim()}
            variant="contained"
            sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}
          >
            {language === 'ko' ? '삽입' : 'Insert'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
