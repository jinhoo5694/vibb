'use client';

import { useState, useEffect } from 'react';
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
  Settings as SettingsIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/supabase';
import { getNews, deleteNews } from '@/services/newsService';
import { NewsItem, categoryColors, categoryIcons } from '@/types/news';

const NEWS_PER_PAGE = 20;

export default function NewsManagePage() {
  const theme = useTheme();
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Single delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Bulk selection & delete
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState(0);
  const [bulkDeleteError, setBulkDeleteError] = useState<string | null>(null);

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(user.id);
      setIsAdmin(profile?.role === 'admin');

      if (profile?.role === 'admin') {
        fetchNews();
      } else {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [user]);

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

  // Filter news based on search query
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
    // Clear selection when filter changes
    setSelectedIds(new Set());
  }, [searchQuery, news]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items on current page
      const pageIds = paginatedNews.map((item) => item.id);
      setSelectedIds(new Set(pageIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const isAllSelected = paginatedNews.length > 0 && paginatedNews.every((item) => selectedIds.has(item.id));
  const isPartialSelected = paginatedNews.some((item) => selectedIds.has(item.id)) && !isAllSelected;

  // Single delete handlers
  const handleDeleteClick = (item: NewsItem) => {
    setNewsToDelete(item);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!newsToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const success = await deleteNews(newsToDelete.id);
      if (success) {
        setNews((prev) => prev.filter((n) => n.id !== newsToDelete.id));
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(newsToDelete.id);
          return newSet;
        });
        setSuccessMessage(
          language === 'ko'
            ? `"${newsToDelete.title}" 뉴스가 삭제되었습니다.`
            : `News "${newsToDelete.title}" has been deleted.`
        );
        setDeleteDialogOpen(false);
        setNewsToDelete(null);
      } else {
        setDeleteError(
          language === 'ko' ? '삭제에 실패했습니다.' : 'Failed to delete news.'
        );
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      setDeleteError(
        language === 'ko'
          ? '오류가 발생했습니다. 다시 시도해주세요.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
    setDeleteError(null);
  };

  // Bulk delete handlers
  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
    setBulkDeleteError(null);
  };

  const handleBulkDeleteConfirm = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;

    setBulkDeleting(true);
    setBulkDeleteProgress(0);
    setBulkDeleteError(null);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < idsToDelete.length; i++) {
      try {
        const success = await deleteNews(idsToDelete[i]);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
      }
      setBulkDeleteProgress(((i + 1) / idsToDelete.length) * 100);
    }

    // Update state
    setNews((prev) => prev.filter((n) => !selectedIds.has(n.id) || failedCount > 0));

    // Refetch to get accurate data
    await fetchNews();

    setSelectedIds(new Set());
    setBulkDeleting(false);
    setBulkDeleteDialogOpen(false);

    if (failedCount === 0) {
      setSuccessMessage(
        language === 'ko'
          ? `${successCount}개의 뉴스가 삭제되었습니다.`
          : `${successCount} news articles have been deleted.`
      );
    } else {
      setSuccessMessage(
        language === 'ko'
          ? `${successCount}개 삭제 완료, ${failedCount}개 실패`
          : `${successCount} deleted, ${failedCount} failed`
      );
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
    setBulkDeleteError(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get selected items for display in dialog
  const selectedItems = filteredNews.filter((item) => selectedIds.has(item.id));

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
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/news')}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {language === 'ko' ? '뉴스 목록' : 'Back to News'}
        </Button>

        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <SettingsIcon sx={{ color: '#ff6b35', fontSize: 32 }} />
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
              {language === 'ko' ? '뉴스 관리' : 'News Management'}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? '등록된 뉴스를 수정하거나 삭제할 수 있습니다.'
              : 'Edit or delete registered news articles.'}
          </Typography>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            sx={{ mb: 3 }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Search and Stats */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: isDark ? '#1a1a1a' : '#fff',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder={language === 'ko' ? '제목, 출처, 카테고리로 검색...' : 'Search by title, source, category...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {selectedIds.size > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleBulkDeleteClick}
                  sx={{ fontWeight: 600 }}
                >
                  {language === 'ko'
                    ? `${selectedIds.size}개 삭제`
                    : `Delete ${selectedIds.size}`}
                </Button>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {selectedIds.size > 0
                ? (language === 'ko'
                    ? `${selectedIds.size}개 선택됨 / 총 ${filteredNews.length}개`
                    : `${selectedIds.size} selected / ${filteredNews.length} total`)
                : (language === 'ko'
                    ? `총 ${filteredNews.length}개의 뉴스`
                    : `Total ${filteredNews.length} news articles`)}
            </Typography>
          </Box>
        </Paper>

        {/* News Table */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 50, p: 1 }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isPartialSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      sx={{
                        color: 'text.disabled',
                        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                          color: '#ff6b35',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 50 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {language === 'ko' ? '제목' : 'Title'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 100 }}>
                    {language === 'ko' ? '카테고리' : 'Category'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 100 }}>
                    {language === 'ko' ? '출처' : 'Source'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 150 }}>
                    {language === 'ko' ? '등록일' : 'Created'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 120, textAlign: 'center' }}>
                    {language === 'ko' ? '통계' : 'Stats'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 100, textAlign: 'center' }}>
                    {language === 'ko' ? '작업' : 'Actions'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedNews.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selectedIds.has(item.id)}
                    sx={{
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      },
                      '&.Mui-selected': {
                        bgcolor: isDark ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255, 107, 53, 0.05)',
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 107, 53, 0.08)',
                        },
                      },
                    }}
                  >
                    <TableCell sx={{ p: 1 }}>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        sx={{
                          color: 'text.disabled',
                          '&.Mui-checked': {
                            color: '#ff6b35',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {(currentPage - 1) * NEWS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${categoryIcons[item.category]} ${item.category}`}
                        size="small"
                        sx={{
                          bgcolor: `${categoryColors[item.category]}20`,
                          color: categoryColors[item.category],
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {item.source}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {formatDate(item.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        <Tooltip title={language === 'ko' ? '조회수' : 'Views'}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <ViewIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {item.viewCount}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title={language === 'ko' ? '추천' : 'Upvotes'}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <ThumbUpIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {item.upvoteCount}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title={language === 'ko' ? '댓글' : 'Comments'}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <CommentIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {item.commentCount}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title={language === 'ko' ? '수정' : 'Edit'}>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/news/${item.id}/edit`)}
                            sx={{
                              color: '#ff6b35',
                              '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.1)' },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={language === 'ko' ? '삭제' : 'Delete'}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(item)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedNews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography color="text.secondary">
                        {searchQuery
                          ? (language === 'ko' ? '검색 결과가 없습니다.' : 'No results found.')
                          : (language === 'ko' ? '등록된 뉴스가 없습니다.' : 'No news articles.')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => {
                  setCurrentPage(page);
                  setSelectedIds(new Set()); // Clear selection on page change
                }}
                color="primary"
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: '#ff6b35',
                      color: '#fff',
                      '&:hover': { bgcolor: '#e55a2b' },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Container>

      {/* Single Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {language === 'ko' ? '뉴스 삭제' : 'Delete News'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko'
              ? '정말로 이 뉴스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
              : 'Are you sure you want to delete this news? This action cannot be undone.'}
          </DialogContentText>
          {newsToDelete && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {newsToDelete.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${categoryIcons[newsToDelete.category]} ${newsToDelete.category}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: `${categoryColors[newsToDelete.category]}20`,
                    color: categoryColors[newsToDelete.category],
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {newsToDelete.source}
                </Typography>
              </Box>
            </Paper>
          )}
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            disabled={deleting}
            sx={{ color: 'text.secondary' }}
          >
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            variant="contained"
            color="error"
            sx={{ fontWeight: 600 }}
          >
            {deleting
              ? (language === 'ko' ? '삭제 중...' : 'Deleting...')
              : (language === 'ko' ? '삭제' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={bulkDeleting ? undefined : handleBulkDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.error.main }}>
          {language === 'ko' ? '선택한 뉴스 일괄 삭제' : 'Delete Selected News'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko'
              ? `정말로 ${selectedIds.size}개의 뉴스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
              : `Are you sure you want to delete ${selectedIds.size} news articles? This action cannot be undone.`}
          </DialogContentText>

          {bulkDeleting && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={bulkDeleteProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.error.main,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {Math.round(bulkDeleteProgress)}%
              </Typography>
            </Box>
          )}

          {!bulkDeleting && selectedItems.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: 2,
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {language === 'ko' ? '삭제될 뉴스:' : 'News to be deleted:'}
              </Typography>
              {selectedItems.slice(0, 10).map((item, index) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {index + 1}. {item.title.length > 50 ? item.title.slice(0, 50) + '...' : item.title}
                  </Typography>
                </Box>
              ))}
              {selectedItems.length > 10 && (
                <Typography variant="caption" color="text.secondary">
                  {language === 'ko'
                    ? `...외 ${selectedItems.length - 10}개`
                    : `...and ${selectedItems.length - 10} more`}
                </Typography>
              )}
            </Paper>
          )}

          {bulkDeleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {bulkDeleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleBulkDeleteCancel}
            disabled={bulkDeleting}
            sx={{ color: 'text.secondary' }}
          >
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={handleBulkDeleteConfirm}
            disabled={bulkDeleting}
            variant="contained"
            color="error"
            startIcon={<DeleteSweepIcon />}
            sx={{ fontWeight: 600 }}
          >
            {bulkDeleting
              ? (language === 'ko' ? '삭제 중...' : 'Deleting...')
              : (language === 'ko' ? `${selectedIds.size}개 삭제` : `Delete ${selectedIds.size}`)}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}
