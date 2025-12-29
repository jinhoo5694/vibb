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
import { getUserProfile, getPosts, deletePost } from '@/services/supabase';
import { Post, subCategoryColors } from '@/types/post';

const POSTS_PER_PAGE = 20;

export default function BoardManagePage() {
  const theme = useTheme();
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Single delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
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
        fetchPosts();
      } else {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Fetch all posts (type 'post' for community)
      const fetchedPosts = await getPosts('post', { limit: 1000, sortBy: 'new' });
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query) ||
            item.author.name.toLowerCase().includes(query) ||
            (item.tags?.some(tag => tag.toLowerCase().includes(query)))
        )
      );
    }
    setCurrentPage(1);
    // Clear selection when filter changes
    setSelectedIds(new Set());
  }, [searchQuery, posts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedPosts.map((item) => item.id);
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

  const isAllSelected = paginatedPosts.length > 0 && paginatedPosts.every((item) => selectedIds.has(item.id));
  const isPartialSelected = paginatedPosts.some((item) => selectedIds.has(item.id)) && !isAllSelected;

  // Single delete handlers
  const handleDeleteClick = (item: Post) => {
    setPostToDelete(item);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete || !user) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const success = await deletePost(postToDelete.id, user.id, true); // isAdmin = true
      if (success) {
        setPosts((prev) => prev.filter((n) => n.id !== postToDelete.id));
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postToDelete.id);
          return newSet;
        });
        setSuccessMessage(
          language === 'ko'
            ? `"${postToDelete.title}" 게시글이 삭제되었습니다.`
            : `Post "${postToDelete.title}" has been deleted.`
        );
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      } else {
        setDeleteError(
          language === 'ko' ? '삭제에 실패했습니다.' : 'Failed to delete post.'
        );
      }
    } catch (error) {
      console.error('Error deleting post:', error);
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
    setPostToDelete(null);
    setDeleteError(null);
  };

  // Bulk delete handlers
  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
    setBulkDeleteError(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (!user) return;
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;

    setBulkDeleting(true);
    setBulkDeleteProgress(0);
    setBulkDeleteError(null);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < idsToDelete.length; i++) {
      try {
        const success = await deletePost(idsToDelete[i], user.id, true); // isAdmin = true
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

    // Refetch to get accurate data
    await fetchPosts();

    setSelectedIds(new Set());
    setBulkDeleting(false);
    setBulkDeleteDialogOpen(false);

    if (failedCount === 0) {
      setSuccessMessage(
        language === 'ko'
          ? `${successCount}개의 게시글이 삭제되었습니다.`
          : `${successCount} posts have been deleted.`
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
  const selectedItems = filteredPosts.filter((item) => selectedIds.has(item.id));

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
          onClick={() => router.push('/board')}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {language === 'ko' ? '커뮤니티' : 'Back to Community'}
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
              {language === 'ko' ? '게시글 관리' : 'Post Management'}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? '등록된 게시글을 수정하거나 삭제할 수 있습니다.'
              : 'Edit or delete registered posts.'}
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
                placeholder={language === 'ko' ? '제목, 내용, 작성자, 태그로 검색...' : 'Search by title, content, author, tag...'}
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
                    ? `${selectedIds.size}개 선택됨 / 총 ${filteredPosts.length}개`
                    : `${selectedIds.size} selected / ${filteredPosts.length} total`)
                : (language === 'ko'
                    ? `총 ${filteredPosts.length}개의 게시글`
                    : `Total ${filteredPosts.length} posts`)}
            </Typography>
          </Box>
        </Paper>

        {/* Posts Table */}
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
                    {language === 'ko' ? '작성자' : 'Author'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 150 }}>
                    {language === 'ko' ? '태그' : 'Tags'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 140 }}>
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
                {paginatedPosts.map((item, index) => (
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
                      {(currentPage - 1) * POSTS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          maxWidth: 250,
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
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {item.author.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {item.tags?.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              bgcolor: subCategoryColors[tag as keyof typeof subCategoryColors] || '#666',
                              color: '#fff',
                            }}
                          />
                        ))}
                        {item.tags && item.tags.length > 2 && (
                          <Chip
                            label={`+${item.tags.length - 2}`}
                            size="small"
                            sx={{ height: 20, fontSize: '0.6rem' }}
                          />
                        )}
                      </Box>
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
                              {item.viewCount || 0}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title={language === 'ko' ? '추천' : 'Upvotes'}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <ThumbUpIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {item.upvotes}
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
                            onClick={() => router.push(`/board/write?edit=${item.id}`)}
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
                {paginatedPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography color="text.secondary">
                        {searchQuery
                          ? (language === 'ko' ? '검색 결과가 없습니다.' : 'No results found.')
                          : (language === 'ko' ? '등록된 게시글이 없습니다.' : 'No posts.')}
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
                  setSelectedIds(new Set());
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
          {language === 'ko' ? '게시글 삭제' : 'Delete Post'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko'
              ? '정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
              : 'Are you sure you want to delete this post? This action cannot be undone.'}
          </DialogContentText>
          {postToDelete && (
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
                {postToDelete.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {postToDelete.author.name}
                </Typography>
                {postToDelete.tags && postToDelete.tags.length > 0 && (
                  <>
                    <Typography variant="caption" color="text.disabled">•</Typography>
                    {postToDelete.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.6rem',
                          bgcolor: subCategoryColors[tag as keyof typeof subCategoryColors] || '#666',
                          color: '#fff',
                        }}
                      />
                    ))}
                  </>
                )}
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
          {language === 'ko' ? '선택한 게시글 일괄 삭제' : 'Delete Selected Posts'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === 'ko'
              ? `정말로 ${selectedIds.size}개의 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
              : `Are you sure you want to delete ${selectedIds.size} posts? This action cannot be undone.`}
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
                {language === 'ko' ? '삭제될 게시글:' : 'Posts to be deleted:'}
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
