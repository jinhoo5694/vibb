'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Pagination,
  Checkbox,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  AdminPanelSettings as AdminIcon,
  DeleteSweep as DeleteSweepIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Newspaper as NewsIcon,
  Forum as ForumIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, getPosts, deletePost, createPost, getPendingPrompts, approvePrompt, rejectPrompt, deletePrompt, Prompt } from '@/services/supabase';
import { getNews, deleteNews, createNews as createNewsItem } from '@/services/newsService';
import { NewsItem, NewsCategory, categoryColors as newsCategoryColors, categoryIcons as newsCategoryIcons } from '@/types/news';
import { Post, SubCategoryTag, subCategoryColors } from '@/types/post';
import { TextSnippet as PromptIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon, HourglassEmpty as PendingIcon } from '@mui/icons-material';

const ITEMS_PER_PAGE = 25;

// Valid tags for posts
const VALID_TAGS: SubCategoryTag[] = [
  'Google', 'Anthropic', 'Microsoft', 'OpenAI', 'Meta', '오픈소스',
  'Cursor', 'Claude Code', 'Windsurf', 'Copilot', 'Antigravity', 'Replit', 'v0',
  'ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Grok',
  'PDF', '이미지 생성', '생산성', '영상', '음악', '자동화', '검색', '기타',
];

// News categories
const NEWS_CATEGORIES: NewsCategory[] = ['AI', '개발', '스타트업', '트렌드', '튜토리얼'];

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Sub-tab panel
function SubTabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const theme = useTheme();
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState(0); // 0: News, 1: Posts
  const [subTab, setSubTab] = useState(0); // 0: Management, 1: Bulk Upload

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setLoading(false);
        return;
      }
      const profile = await getUserProfile(user.id);
      setIsAdmin(profile?.role === 'admin');
      setLoading(false);
    }
    checkAdmin();
  }, [user]);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Container>
        <Footer />
      </>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error">
            {language === 'ko' ? '관리자 권한이 필요합니다.' : 'Admin access required.'}
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <AdminIcon sx={{ color: '#ff6b35', fontSize: 36 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ko' ? '관리자 페이지' : 'Admin Dashboard'}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? '콘텐츠를 관리하고 일괄 업로드할 수 있습니다.'
              : 'Manage content and perform bulk uploads.'}
          </Typography>
        </Box>

        {/* Main Tabs */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: isDark ? '#1a1a1a' : '#fff',
          }}
        >
          <Tabs
            value={mainTab}
            onChange={(_, newValue) => {
              setMainTab(newValue);
              setSubTab(0);
            }}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 56,
              },
              '& .Mui-selected': {
                color: '#ff6b35',
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#ff6b35',
              },
            }}
          >
            <Tab
              icon={<NewsIcon />}
              iconPosition="start"
              label={language === 'ko' ? '뉴스 관리' : 'News'}
            />
            <Tab
              icon={<ForumIcon />}
              iconPosition="start"
              label={language === 'ko' ? '게시글 관리' : 'Posts'}
            />
            <Tab
              icon={<PromptIcon />}
              iconPosition="start"
              label={language === 'ko' ? '프롬프트 승인' : 'Prompts'}
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Sub Tabs - only for News and Posts */}
            {mainTab !== 2 && (
              <Tabs
                value={subTab}
                onChange={(_, newValue) => setSubTab(newValue)}
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: 40,
                    px: 2,
                  },
                  '& .Mui-selected': {
                    color: '#ff6b35',
                  },
                  '& .MuiTabs-indicator': {
                    bgcolor: '#ff6b35',
                  },
                }}
              >
                <Tab label={language === 'ko' ? '목록 관리' : 'Management'} />
                <Tab label={language === 'ko' ? '일괄 업로드' : 'Bulk Upload'} />
              </Tabs>
            )}

            {/* News Tab */}
            <TabPanel value={mainTab} index={0}>
              <SubTabPanel value={subTab} index={0}>
                <NewsManagement user={user} language={language} isDark={isDark} />
              </SubTabPanel>
              <SubTabPanel value={subTab} index={1}>
                <NewsBulkUpload user={user} language={language} isDark={isDark} />
              </SubTabPanel>
            </TabPanel>

            {/* Posts Tab */}
            <TabPanel value={mainTab} index={1}>
              <SubTabPanel value={subTab} index={0}>
                <PostsManagement user={user} language={language} isDark={isDark} />
              </SubTabPanel>
              <SubTabPanel value={subTab} index={1}>
                <PostsBulkUpload user={user} language={language} isDark={isDark} />
              </SubTabPanel>
            </TabPanel>

            {/* Prompts Tab */}
            <TabPanel value={mainTab} index={2}>
              <PromptsApproval user={user} language={language} isDark={isDark} />
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
}

// =============================================
// NEWS MANAGEMENT COMPONENT
// =============================================
interface ManagementProps {
  user: { id: string };
  language: string;
  isDark: boolean;
}

function NewsManagement({ user, language, isDark }: ManagementProps) {
  const theme = useTheme();
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState(0);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const fetchedNews = await getNews({ limit: 1000 });
      setNews(fetchedNews);
      setFilteredNews(fetchedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNews(news);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredNews(
        news.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.source.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        )
      );
    }
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchQuery, news]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedNews.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  };

  const isAllSelected = paginatedNews.length > 0 && paginatedNews.every((item) => selectedIds.has(item.id));
  const isPartialSelected = paginatedNews.some((item) => selectedIds.has(item.id)) && !isAllSelected;

  const handleDeleteConfirm = async () => {
    if (!newsToDelete) return;
    setDeleting(true);
    try {
      const success = await deleteNews(newsToDelete.id);
      if (success) {
        setNews((prev) => prev.filter((n) => n.id !== newsToDelete.id));
        setSuccessMessage(language === 'ko' ? '뉴스가 삭제되었습니다.' : 'News deleted.');
        setDeleteDialogOpen(false);
        setNewsToDelete(null);
      } else {
        setDeleteError(language === 'ko' ? '삭제에 실패했습니다.' : 'Failed to delete.');
      }
    } catch (error) {
      setDeleteError(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;
    setBulkDeleting(true);
    setBulkDeleteProgress(0);
    let successCount = 0;

    for (let i = 0; i < idsToDelete.length; i++) {
      try {
        const success = await deleteNews(idsToDelete[i]);
        if (success) successCount++;
      } catch (error) {}
      setBulkDeleteProgress(((i + 1) / idsToDelete.length) * 100);
    }

    await fetchNews();
    setSelectedIds(new Set());
    setBulkDeleting(false);
    setBulkDeleteDialogOpen(false);
    setSuccessMessage(
      language === 'ko'
        ? `${successCount}개의 뉴스가 삭제되었습니다.`
        : `${successCount} news deleted.`
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', py: 4 }}><Typography>Loading...</Typography></Box>;
  }

  return (
    <>
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder={language === 'ko' ? '검색...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled' }} /></InputAdornment>,
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
                </InputAdornment>
              ),
            }}
          />
          {selectedIds.size > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setBulkDeleteDialogOpen(true)}
              sx={{ fontWeight: 600 }}
            >
              {language === 'ko' ? `${selectedIds.size}개 삭제` : `Delete ${selectedIds.size}`}
            </Button>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {language === 'ko' ? `총 ${filteredNews.length}개` : `Total ${filteredNews.length}`}
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 700, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 40, p: 1 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartialSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{ '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#ff6b35' } }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{language === 'ko' ? '제목' : 'Title'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }}>{language === 'ko' ? '카테고리' : 'Category'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>{language === 'ko' ? '출처' : 'Source'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>{language === 'ko' ? '등록일' : 'Date'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80, textAlign: 'center' }}>{language === 'ko' ? '작업' : 'Actions'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNews.map((item) => (
              <TableRow key={item.id} hover selected={selectedIds.has(item.id)}>
                <TableCell sx={{ p: 1 }}>
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    sx={{ '&.Mui-checked': { color: '#ff6b35' } }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${newsCategoryIcons[item.category]} ${item.category}`}
                    size="small"
                    sx={{ height: 22, fontSize: '0.7rem', bgcolor: `${newsCategoryColors[item.category]}20`, color: newsCategoryColors[item.category], fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{item.source}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{formatDate(item.createdAt)}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title={language === 'ko' ? '수정' : 'Edit'}>
                      <IconButton size="small" onClick={() => router.push(`/news/${item.id}/edit`)} sx={{ color: '#ff6b35' }}>
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={language === 'ko' ? '삭제' : 'Delete'}>
                      <IconButton size="small" onClick={() => { setNewsToDelete(item); setDeleteDialogOpen(true); }} sx={{ color: theme.palette.error.main }}>
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginatedNews.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">{language === 'ko' ? '데이터가 없습니다.' : 'No data.'}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => { setCurrentPage(page); setSelectedIds(new Set()); }}
            size="small"
            sx={{ '& .Mui-selected': { bgcolor: '#ff6b35 !important', color: '#fff' } }}
          />
        </Box>
      )}

      {/* Single Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'ko' ? '뉴스 삭제' : 'Delete News'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko' ? '정말로 이 뉴스를 삭제하시겠습니까?' : 'Are you sure you want to delete this news?'}
          </DialogContentText>
          {newsToDelete && (
            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{newsToDelete.title}</Typography>
            </Paper>
          )}
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>{language === 'ko' ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleDeleteConfirm} disabled={deleting} variant="contained" color="error">
            {deleting ? (language === 'ko' ? '삭제 중...' : 'Deleting...') : (language === 'ko' ? '삭제' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={bulkDeleting ? undefined : () => setBulkDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: theme.palette.error.main }}>{language === 'ko' ? '일괄 삭제' : 'Bulk Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko' ? `${selectedIds.size}개의 뉴스를 삭제하시겠습니까?` : `Delete ${selectedIds.size} news?`}
          </DialogContentText>
          {bulkDeleting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={bulkDeleteProgress} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{Math.round(bulkDeleteProgress)}%</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBulkDeleteDialogOpen(false)} disabled={bulkDeleting}>{language === 'ko' ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleBulkDeleteConfirm} disabled={bulkDeleting} variant="contained" color="error" startIcon={<DeleteSweepIcon />}>
            {bulkDeleting ? (language === 'ko' ? '삭제 중...' : 'Deleting...') : (language === 'ko' ? '삭제' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// =============================================
// NEWS BULK UPLOAD COMPONENT
// =============================================
interface NewsUploadItem {
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  category: NewsCategory;
  status?: 'pending' | 'success' | 'error';
  error?: string;
}

function NewsBulkUpload({ user, language, isDark }: ManagementProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newsItems, setNewsItems] = useState<NewsUploadItem[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) {
          setError(language === 'ko' ? 'JSON 파일은 배열이어야 합니다.' : 'JSON must be an array.');
          return;
        }

        const validated: NewsUploadItem[] = data.map((item) => ({
          title: item.title?.trim() || '',
          content: item.content?.trim() || '',
          source: item.source?.trim() || '',
          sourceUrl: item.sourceUrl?.trim() || '',
          category: NEWS_CATEGORIES.includes(item.category) ? item.category : 'AI',
          status: 'pending' as const,
        })).filter((item) => item.title && item.content);

        setNewsItems(validated);
      } catch {
        setError(language === 'ko' ? 'JSON 파싱 실패' : 'Failed to parse JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImport = async () => {
    if (newsItems.length === 0) return;
    setImporting(true);
    setImportProgress(0);
    let successCount = 0, failedCount = 0;

    for (let i = 0; i < newsItems.length; i++) {
      const item = newsItems[i];
      try {
        const result = await createNewsItem({
          title: item.title,
          content: item.content,
          source: item.source || 'Unknown',
          sourceUrl: item.sourceUrl || '#',
          category: item.category,
          authorId: user.id,
        });
        if (result) {
          successCount++;
          setNewsItems((prev) => prev.map((n, idx) => idx === i ? { ...n, status: 'success' as const } : n));
        } else {
          failedCount++;
          setNewsItems((prev) => prev.map((n, idx) => idx === i ? { ...n, status: 'error' as const } : n));
        }
      } catch {
        failedCount++;
        setNewsItems((prev) => prev.map((n, idx) => idx === i ? { ...n, status: 'error' as const } : n));
      }
      setImportProgress(((i + 1) / newsItems.length) * 100);
    }

    setImporting(false);
    setImportResults({ success: successCount, failed: failedCount });
  };

  const handleDownloadTemplate = () => {
    const template = [
      { title: '샘플 뉴스 제목', content: '뉴스 본문 내용입니다.\n\n마크다운 지원됩니다.', source: 'TechCrunch', sourceUrl: 'https://example.com', category: 'AI' }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'news-template.json';
    a.click();
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()} disabled={importing} sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}>
          {language === 'ko' ? 'JSON 파일 선택' : 'Select JSON'}
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
          {language === 'ko' ? '템플릿 다운로드' : 'Download Template'}
        </Button>
        {newsItems.length > 0 && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { setNewsItems([]); setImportResults(null); }} disabled={importing}>
            {language === 'ko' ? '초기화' : 'Reset'}
          </Button>
        )}
      </Box>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>JSON Format:</Typography>
        <Box component="pre" sx={{ fontSize: '0.7rem', bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, overflow: 'auto' }}>
{`[{ "title": "...", "content": "...", "source": "...", "sourceUrl": "...", "category": "AI" }]`}
        </Box>
        <Typography variant="caption" color="text.secondary">Categories: {NEWS_CATEGORIES.join(', ')}</Typography>
      </Alert>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {importResults && (
        <Alert severity={importResults.failed === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {language === 'ko' ? `완료: ${importResults.success}개 성공, ${importResults.failed}개 실패` : `Done: ${importResults.success} success, ${importResults.failed} failed`}
        </Alert>
      )}

      {importing && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={importProgress} sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{Math.round(importProgress)}%</Typography>
        </Box>
      )}

      {newsItems.length > 0 && (
        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{language === 'ko' ? `미리보기 (${newsItems.length}개)` : `Preview (${newsItems.length})`}</Typography>
            <Button variant="contained" onClick={handleImport} disabled={importing || newsItems.every((n) => n.status === 'success')} sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}>
              {importing ? (language === 'ko' ? '업로드 중...' : 'Uploading...') : (language === 'ko' ? '전체 업로드' : 'Upload All')}
            </Button>
          </Box>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{language === 'ko' ? '제목' : 'Title'}</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 80 }}>{language === 'ko' ? '카테고리' : 'Category'}</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 80 }}>{language === 'ko' ? '상태' : 'Status'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newsItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><Typography sx={{ maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography></TableCell>
                    <TableCell><Chip label={item.category} size="small" sx={{ height: 20, fontSize: '0.65rem' }} /></TableCell>
                    <TableCell>
                      {item.status === 'success' && <Chip icon={<CheckIcon sx={{ fontSize: 14 }} />} label="OK" size="small" color="success" sx={{ fontSize: '0.65rem' }} />}
                      {item.status === 'error' && <Chip icon={<ErrorIcon sx={{ fontSize: 14 }} />} label="Fail" size="small" color="error" sx={{ fontSize: '0.65rem' }} />}
                      {item.status === 'pending' && <Chip label="..." size="small" sx={{ fontSize: '0.65rem' }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}

// =============================================
// POSTS MANAGEMENT COMPONENT
// =============================================
function PostsManagement({ user, language, isDark }: ManagementProps) {
  const theme = useTheme();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts('post', { limit: 1000, sortBy: 'new' });
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.author.name.toLowerCase().includes(query) ||
            (item.tags?.some(tag => tag.toLowerCase().includes(query)))
        )
      );
    }
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchQuery, posts]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedPosts.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  };

  const isAllSelected = paginatedPosts.length > 0 && paginatedPosts.every((item) => selectedIds.has(item.id));
  const isPartialSelected = paginatedPosts.some((item) => selectedIds.has(item.id)) && !isAllSelected;

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setDeleting(true);
    try {
      const success = await deletePost(postToDelete.id, user.id, true);
      if (success) {
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        setSuccessMessage(language === 'ko' ? '게시글이 삭제되었습니다.' : 'Post deleted.');
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      } else {
        setDeleteError(language === 'ko' ? '삭제에 실패했습니다.' : 'Failed to delete.');
      }
    } catch (error) {
      setDeleteError(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;
    setBulkDeleting(true);
    setBulkDeleteProgress(0);
    let successCount = 0;

    for (let i = 0; i < idsToDelete.length; i++) {
      try {
        const success = await deletePost(idsToDelete[i], user.id, true);
        if (success) successCount++;
      } catch (error) {}
      setBulkDeleteProgress(((i + 1) / idsToDelete.length) * 100);
    }

    await fetchPosts();
    setSelectedIds(new Set());
    setBulkDeleting(false);
    setBulkDeleteDialogOpen(false);
    setSuccessMessage(
      language === 'ko'
        ? `${successCount}개의 게시글이 삭제되었습니다.`
        : `${successCount} posts deleted.`
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', py: 4 }}><Typography>Loading...</Typography></Box>;
  }

  return (
    <>
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder={language === 'ko' ? '검색...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled' }} /></InputAdornment>,
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
                </InputAdornment>
              ),
            }}
          />
          {selectedIds.size > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setBulkDeleteDialogOpen(true)}
              sx={{ fontWeight: 600 }}
            >
              {language === 'ko' ? `${selectedIds.size}개 삭제` : `Delete ${selectedIds.size}`}
            </Button>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {language === 'ko' ? `총 ${filteredPosts.length}개` : `Total ${filteredPosts.length}`}
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 700, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 40, p: 1 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartialSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{ '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#ff6b35' } }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{language === 'ko' ? '제목' : 'Title'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>{language === 'ko' ? '작성자' : 'Author'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>{language === 'ko' ? '태그' : 'Tags'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>{language === 'ko' ? '등록일' : 'Date'}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80, textAlign: 'center' }}>{language === 'ko' ? '작업' : 'Actions'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.map((item) => (
              <TableRow key={item.id} hover selected={selectedIds.has(item.id)}>
                <TableCell sx={{ p: 1 }}>
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    sx={{ '&.Mui-checked': { color: '#ff6b35' } }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{item.author.name}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {item.tags?.slice(0, 2).map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: subCategoryColors[tag as keyof typeof subCategoryColors] || '#666', color: '#fff' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{formatDate(item.createdAt)}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title={language === 'ko' ? '수정' : 'Edit'}>
                      <IconButton size="small" onClick={() => router.push(`/board/write?edit=${item.id}`)} sx={{ color: '#ff6b35' }}>
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={language === 'ko' ? '삭제' : 'Delete'}>
                      <IconButton size="small" onClick={() => { setPostToDelete(item); setDeleteDialogOpen(true); }} sx={{ color: theme.palette.error.main }}>
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginatedPosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">{language === 'ko' ? '데이터가 없습니다.' : 'No data.'}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => { setCurrentPage(page); setSelectedIds(new Set()); }}
            size="small"
            sx={{ '& .Mui-selected': { bgcolor: '#ff6b35 !important', color: '#fff' } }}
          />
        </Box>
      )}

      {/* Single Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'ko' ? '게시글 삭제' : 'Delete Post'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko' ? '정말로 이 게시글을 삭제하시겠습니까?' : 'Are you sure you want to delete this post?'}
          </DialogContentText>
          {postToDelete && (
            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{postToDelete.title}</Typography>
            </Paper>
          )}
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>{language === 'ko' ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleDeleteConfirm} disabled={deleting} variant="contained" color="error">
            {deleting ? (language === 'ko' ? '삭제 중...' : 'Deleting...') : (language === 'ko' ? '삭제' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={bulkDeleting ? undefined : () => setBulkDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: theme.palette.error.main }}>{language === 'ko' ? '일괄 삭제' : 'Bulk Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko' ? `${selectedIds.size}개의 게시글을 삭제하시겠습니까?` : `Delete ${selectedIds.size} posts?`}
          </DialogContentText>
          {bulkDeleting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={bulkDeleteProgress} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{Math.round(bulkDeleteProgress)}%</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBulkDeleteDialogOpen(false)} disabled={bulkDeleting}>{language === 'ko' ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleBulkDeleteConfirm} disabled={bulkDeleting} variant="contained" color="error" startIcon={<DeleteSweepIcon />}>
            {bulkDeleting ? (language === 'ko' ? '삭제 중...' : 'Deleting...') : (language === 'ko' ? '삭제' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// =============================================
// POSTS BULK UPLOAD COMPONENT
// =============================================
interface PostUploadItem {
  title: string;
  content: string;
  tags: SubCategoryTag[];
  status?: 'pending' | 'success' | 'error';
}

function PostsBulkUpload({ user, language, isDark }: ManagementProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [postItems, setPostItems] = useState<PostUploadItem[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) {
          setError(language === 'ko' ? 'JSON 파일은 배열이어야 합니다.' : 'JSON must be an array.');
          return;
        }

        const validated: PostUploadItem[] = data.map((item) => ({
          title: item.title?.trim() || '',
          content: item.content?.trim() || '',
          tags: (item.tags || []).filter((t: string) => VALID_TAGS.includes(t as SubCategoryTag)),
          status: 'pending' as const,
        })).filter((item) => item.title && item.content);

        setPostItems(validated);
      } catch {
        setError(language === 'ko' ? 'JSON 파싱 실패' : 'Failed to parse JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImport = async () => {
    if (postItems.length === 0) return;
    setImporting(true);
    setImportProgress(0);
    let successCount = 0, failedCount = 0;

    for (let i = 0; i < postItems.length; i++) {
      const item = postItems[i];
      try {
        const result = await createPost(user.id, {
          title: item.title,
          body: item.content,
          type: 'post',
          tags: item.tags,
          metadata: { selectedTags: item.tags },
          status: 'pending',
        });
        if (result) {
          successCount++;
          setPostItems((prev) => prev.map((p, idx) => idx === i ? { ...p, status: 'success' as const } : p));
        } else {
          failedCount++;
          setPostItems((prev) => prev.map((p, idx) => idx === i ? { ...p, status: 'error' as const } : p));
        }
      } catch {
        failedCount++;
        setPostItems((prev) => prev.map((p, idx) => idx === i ? { ...p, status: 'error' as const } : p));
      }
      setImportProgress(((i + 1) / postItems.length) * 100);
    }

    setImporting(false);
    setImportResults({ success: successCount, failed: failedCount });
  };

  const handleDownloadTemplate = () => {
    const template = [
      { title: '샘플 게시글 제목', content: '게시글 본문입니다.\n\n```javascript\nconsole.log("Hello!");\n```', tags: ['Claude Code', 'Anthropic'] }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'post-template.json';
    a.click();
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()} disabled={importing} sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}>
          {language === 'ko' ? 'JSON 파일 선택' : 'Select JSON'}
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
          {language === 'ko' ? '템플릿 다운로드' : 'Download Template'}
        </Button>
        {postItems.length > 0 && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { setPostItems([]); setImportResults(null); }} disabled={importing}>
            {language === 'ko' ? '초기화' : 'Reset'}
          </Button>
        )}
      </Box>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>JSON Format:</Typography>
        <Box component="pre" sx={{ fontSize: '0.7rem', bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, overflow: 'auto' }}>
{`[{ "title": "...", "content": "...", "tags": ["Claude Code", "Anthropic"] }]`}
        </Box>
        <Typography variant="caption" color="text.secondary">Tags: {VALID_TAGS.slice(0, 8).join(', ')}...</Typography>
      </Alert>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {importResults && (
        <Alert severity={importResults.failed === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {language === 'ko' ? `완료: ${importResults.success}개 성공, ${importResults.failed}개 실패` : `Done: ${importResults.success} success, ${importResults.failed} failed`}
        </Alert>
      )}

      {importing && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={importProgress} sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{Math.round(importProgress)}%</Typography>
        </Box>
      )}

      {postItems.length > 0 && (
        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{language === 'ko' ? `미리보기 (${postItems.length}개)` : `Preview (${postItems.length})`}</Typography>
            <Button variant="contained" onClick={handleImport} disabled={importing || postItems.every((p) => p.status === 'success')} sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}>
              {importing ? (language === 'ko' ? '업로드 중...' : 'Uploading...') : (language === 'ko' ? '전체 업로드' : 'Upload All')}
            </Button>
          </Box>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{language === 'ko' ? '제목' : 'Title'}</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 150 }}>{language === 'ko' ? '태그' : 'Tags'}</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 80 }}>{language === 'ko' ? '상태' : 'Status'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><Typography sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {item.tags.slice(0, 2).map((tag) => (
                          <Chip key={tag} label={tag} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: subCategoryColors[tag] || '#666', color: '#fff' }} />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {item.status === 'success' && <Chip icon={<CheckIcon sx={{ fontSize: 14 }} />} label="OK" size="small" color="success" sx={{ fontSize: '0.65rem' }} />}
                      {item.status === 'error' && <Chip icon={<ErrorIcon sx={{ fontSize: 14 }} />} label="Fail" size="small" color="error" sx={{ fontSize: '0.65rem' }} />}
                      {item.status === 'pending' && <Chip label="..." size="small" sx={{ fontSize: '0.65rem' }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}

// =============================================
// PROMPTS APPROVAL COMPONENT
// =============================================
function PromptsApproval({ user, language, isDark }: ManagementProps) {
  const theme = useTheme();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPrompts();
  }, []);

  const fetchPendingPrompts = async () => {
    try {
      setLoading(true);
      const fetchedPrompts = await getPendingPrompts({ limit: 100 });
      setPrompts(fetchedPrompts);
    } catch (error) {
      console.error('Error fetching pending prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPrompt) return;
    setProcessing(true);
    try {
      const success = await approvePrompt(selectedPrompt.id);
      if (success) {
        setPrompts((prev) => prev.filter((p) => p.id !== selectedPrompt.id));
        setSuccessMessage(language === 'ko' ? '프롬프트가 승인되었습니다.' : 'Prompt approved.');
        setApproveDialogOpen(false);
        setSelectedPrompt(null);
      } else {
        setErrorMessage(language === 'ko' ? '승인에 실패했습니다.' : 'Failed to approve.');
      }
    } catch (error) {
      setErrorMessage(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPrompt) return;
    setProcessing(true);
    try {
      const success = await rejectPrompt(selectedPrompt.id, rejectReason);
      if (success) {
        setPrompts((prev) => prev.filter((p) => p.id !== selectedPrompt.id));
        setSuccessMessage(language === 'ko' ? '프롬프트가 거절되었습니다.' : 'Prompt rejected.');
        setRejectDialogOpen(false);
        setSelectedPrompt(null);
        setRejectReason('');
      } else {
        setErrorMessage(language === 'ko' ? '거절에 실패했습니다.' : 'Failed to reject.');
      }
    } catch (error) {
      setErrorMessage(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', py: 4 }}><Typography>Loading...</Typography></Box>;
  }

  return (
    <>
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          {language === 'ko'
            ? '사용자가 등록한 프롬프트를 검토하고 승인하거나 거절할 수 있습니다.'
            : 'Review user-submitted prompts and approve or reject them.'}
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PendingIcon sx={{ color: '#f59e0b' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {language === 'ko' ? '대기 중인 프롬프트' : 'Pending Prompts'}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {language === 'ko' ? `총 ${prompts.length}개` : `Total ${prompts.length}`}
        </Typography>
      </Box>

      {prompts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <PendingIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            {language === 'ko' ? '승인 대기 중인 프롬프트가 없습니다.' : 'No pending prompts.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer sx={{ maxHeight: 700, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>{language === 'ko' ? '제목' : 'Title'}</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>{language === 'ko' ? '작성자' : 'Author'}</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>{language === 'ko' ? '등록일' : 'Date'}</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 150, textAlign: 'center' }}>{language === 'ko' ? '작업' : 'Actions'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id} hover>
                  <TableCell>
                    <Box>
                      <Typography sx={{ fontWeight: 500, mb: 0.5 }}>{prompt.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {prompt.description || prompt.promptText.substring(0, 100)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{prompt.author.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {formatDate(prompt.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title={language === 'ko' ? '승인' : 'Approve'}>
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedPrompt(prompt); setApproveDialogOpen(true); }}
                          sx={{ color: 'success.main' }}
                        >
                          <ApproveIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={language === 'ko' ? '거절' : 'Reject'}>
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedPrompt(prompt); setRejectDialogOpen(true); }}
                          sx={{ color: 'error.main' }}
                        >
                          <RejectIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={language === 'ko' ? '상세보기' : 'View Details'}>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedPrompt(prompt)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <ViewIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'success.main' }}>{language === 'ko' ? '프롬프트 승인' : 'Approve Prompt'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {language === 'ko' ? '이 프롬프트를 승인하시겠습니까? 승인 후 다른 사용자들에게 공개됩니다.' : 'Approve this prompt? It will become visible to all users.'}
          </DialogContentText>
          {selectedPrompt && (
            <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>{selectedPrompt.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{selectedPrompt.description}</Typography>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  maxHeight: 150,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedPrompt.promptText}
              </Paper>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setApproveDialogOpen(false)} disabled={processing}>{language === 'ko' ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleApprove} disabled={processing} variant="contained" color="success" startIcon={<ApproveIcon />}>
            {processing ? (language === 'ko' ? '처리 중...' : 'Processing...') : (language === 'ko' ? '승인' : 'Approve')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>{language === 'ko' ? '프롬프트 거절' : 'Reject Prompt'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {language === 'ko' ? '이 프롬프트를 거절하시겠습니까?' : 'Reject this prompt?'}
          </DialogContentText>
          {selectedPrompt && (
            <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{selectedPrompt.title}</Typography>
            </Paper>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label={language === 'ko' ? '거절 사유 (선택사항)' : 'Rejection reason (optional)'}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setRejectDialogOpen(false); setRejectReason(''); }} disabled={processing}>{language === 'ko' ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleReject} disabled={processing} variant="contained" color="error" startIcon={<RejectIcon />}>
            {processing ? (language === 'ko' ? '처리 중...' : 'Processing...') : (language === 'ko' ? '거절' : 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail View Dialog (when clicking view icon without approve/reject) */}
      <Dialog open={Boolean(selectedPrompt) && !approveDialogOpen && !rejectDialogOpen} onClose={() => setSelectedPrompt(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedPrompt?.title}
            <IconButton onClick={() => setSelectedPrompt(null)}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrompt && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">{language === 'ko' ? '작성자' : 'Author'}</Typography>
                <Typography variant="body2">{selectedPrompt.author.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">{language === 'ko' ? '설명' : 'Description'}</Typography>
                <Typography variant="body2">{selectedPrompt.description || '-'}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">{language === 'ko' ? '프롬프트' : 'Prompt'}</Typography>
                <Paper
                  sx={{
                    p: 2,
                    mt: 1,
                    bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    maxHeight: 300,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedPrompt.promptText}
                </Paper>
              </Box>
              {selectedPrompt.variables && selectedPrompt.variables.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">{language === 'ko' ? '변수' : 'Variables'}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {selectedPrompt.variables.map((v) => (
                      <Chip key={v} label={`{{${v}}}`} size="small" sx={{ fontFamily: 'monospace' }} />
                    ))}
                  </Box>
                </Box>
              )}
              {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">{language === 'ko' ? '태그' : 'Tags'}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {selectedPrompt.tags.map((t) => (
                      <Chip key={t} label={t} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setSelectedPrompt(null); }} sx={{ mr: 'auto' }}>{language === 'ko' ? '닫기' : 'Close'}</Button>
          <Button onClick={() => setRejectDialogOpen(true)} variant="outlined" color="error" startIcon={<RejectIcon />}>
            {language === 'ko' ? '거절' : 'Reject'}
          </Button>
          <Button onClick={() => setApproveDialogOpen(true)} variant="contained" color="success" startIcon={<ApproveIcon />}>
            {language === 'ko' ? '승인' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
