'use client';

import { useState, useRef, useEffect } from 'react';
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
  LinearProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, createPost } from '@/services/supabase';
import { SubCategoryTag, subCategoryColors } from '@/types/post';

interface PostUploadItem {
  title: string;
  content: string;
  tags: SubCategoryTag[];
  status?: 'pending' | 'success' | 'error';
  error?: string;
}

const VALID_TAGS: SubCategoryTag[] = [
  // AI Companies
  'Google', 'Anthropic', 'Microsoft', 'OpenAI', 'Meta', '오픈소스',
  // Coding Tools
  'Cursor', 'Claude Code', 'Windsurf', 'Copilot', 'Antigravity', 'Replit', 'v0',
  // LLM Services
  'ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Grok',
  // Fields
  'PDF', '이미지 생성', '생산성', '영상', '음악', '자동화', '검색', '기타',
];

// Sample template for download
const sampleTemplate: PostUploadItem[] = [
  {
    title: 'Claude Code로 프로젝트 세팅하는 방법',
    content: '안녕하세요! Claude Code를 사용해서 새 프로젝트를 세팅하는 방법을 공유합니다.\n\n## 시작하기\n\n1. Claude Code를 설치합니다.\n2. 터미널에서 `claude` 명령어를 실행합니다.\n\n```bash\nnpm install -g @anthropic-ai/claude-code\nclaude\n```\n\n이렇게 하면 바로 시작할 수 있습니다!',
    tags: ['Claude Code', 'Anthropic'],
  },
  {
    title: 'Cursor vs Windsurf 비교 후기',
    content: '두 AI 코딩 툴을 한 달간 사용해본 솔직한 후기입니다.\n\n## Cursor 장점\n- 빠른 응답 속도\n- 다양한 모델 선택\n\n## Windsurf 장점\n- 직관적인 UI\n- 강력한 컨텍스트 이해\n\n결론적으로 각자의 장단점이 있으니 직접 사용해보시는 걸 추천드립니다.',
    tags: ['Cursor', 'Windsurf'],
  },
];

export default function BulkUploadPage() {
  const theme = useTheme();
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme.palette.mode === 'dark';

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postItems, setPostItems] = useState<PostUploadItem[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate it's an array
        if (!Array.isArray(data)) {
          setError(language === 'ko' ? 'JSON 파일은 배열 형식이어야 합니다.' : 'JSON file must be an array.');
          return;
        }

        // Validate and transform each item
        const validatedItems: PostUploadItem[] = [];
        const errors: string[] = [];

        data.forEach((item, index) => {
          const itemErrors: string[] = [];

          if (!item.title?.trim()) {
            itemErrors.push('title');
          }
          if (!item.content?.trim()) {
            itemErrors.push('content');
          }

          // Validate tags
          const validTags: SubCategoryTag[] = [];
          if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach((tag: string) => {
              if (VALID_TAGS.includes(tag as SubCategoryTag)) {
                validTags.push(tag as SubCategoryTag);
              }
            });
          }

          if (itemErrors.length > 0) {
            errors.push(`Item ${index + 1}: Missing or invalid fields - ${itemErrors.join(', ')}`);
          } else {
            validatedItems.push({
              title: item.title.trim(),
              content: item.content.trim(),
              tags: validTags,
              status: 'pending',
            });
          }
        });

        if (errors.length > 0) {
          setError(errors.join('\n'));
        }

        if (validatedItems.length > 0) {
          setPostItems(validatedItems);
        }
      } catch (err) {
        setError(language === 'ko' ? 'JSON 파일을 파싱할 수 없습니다.' : 'Failed to parse JSON file.');
      }
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveItem = (index: number) => {
    setPostItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (!user || postItems.length === 0) return;

    setImporting(true);
    setImportProgress(0);
    setImportResults(null);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < postItems.length; i++) {
      const item = postItems[i];

      try {
        const result = await createPost(user.id, {
          title: item.title,
          body: item.content,
          type: 'post',
          tags: item.tags,
          metadata: {
            selectedTags: item.tags,
          },
          status: 'pending',
        });

        if (result) {
          successCount++;
          setPostItems((prev) =>
            prev.map((n, idx) =>
              idx === i ? { ...n, status: 'success' as const } : n
            )
          );
        } else {
          failedCount++;
          setPostItems((prev) =>
            prev.map((n, idx) =>
              idx === i ? { ...n, status: 'error' as const, error: 'Failed to create' } : n
            )
          );
        }
      } catch (err) {
        failedCount++;
        setPostItems((prev) =>
          prev.map((n, idx) =>
            idx === i ? { ...n, status: 'error' as const, error: String(err) } : n
          )
        );
      }

      setImportProgress(((i + 1) / postItems.length) * 100);
    }

    setImporting(false);
    setImportResults({ success: successCount, failed: failedCount });
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(sampleTemplate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setPostItems([]);
    setError(null);
    setImportResults(null);
    setImportProgress(0);
  };

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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '게시글 일괄 업로드' : 'Bulk Upload Posts'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? 'JSON 파일을 업로드하여 여러 게시글을 한 번에 등록하세요.'
              : 'Upload a JSON file to add multiple posts at once.'}
          </Typography>
        </Box>

        {/* Upload Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: isDark ? '#1a1a1a' : '#fff',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              sx={{
                bgcolor: '#ff6b35',
                '&:hover': { bgcolor: '#e55a2b' },
              }}
            >
              {language === 'ko' ? 'JSON 파일 선택' : 'Select JSON File'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
              sx={{
                borderColor: theme.palette.divider,
                color: 'text.secondary',
                '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' },
              }}
            >
              {language === 'ko' ? '템플릿 다운로드' : 'Download Template'}
            </Button>

            {postItems.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                disabled={importing}
                sx={{
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                  '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' },
                }}
              >
                {language === 'ko' ? '초기화' : 'Reset'}
              </Button>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          {/* JSON Format Guide */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {language === 'ko' ? 'JSON 형식:' : 'JSON Format:'}
            </Typography>
            <Box
              component="pre"
              sx={{
                fontSize: '0.75rem',
                bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
              }}
            >
{`[
  {
    "title": "게시글 제목",
    "content": "게시글 본문 (마크다운 지원)\\n## 제목\\n- 목록\\n\`\`\`js\\ncode\\n\`\`\`",
    "tags": ["Claude Code", "Anthropic"]
  }
]`}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {language === 'ko' ? '사용 가능한 태그: ' : 'Available tags: '}
              {VALID_TAGS.slice(0, 10).join(', ')}...
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}

          {importResults && (
            <Alert
              severity={importResults.failed === 0 ? 'success' : 'warning'}
              sx={{ mb: 2 }}
            >
              {language === 'ko'
                ? `완료! 성공: ${importResults.success}개, 실패: ${importResults.failed}개`
                : `Done! Success: ${importResults.success}, Failed: ${importResults.failed}`}
            </Alert>
          )}

          {importing && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={importProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ff6b35',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {Math.round(importProgress)}%
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Preview Table */}
        {postItems.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {language === 'ko' ? `미리보기 (${postItems.length}개)` : `Preview (${postItems.length} items)`}
              </Typography>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={importing || postItems.every((n) => n.status === 'success')}
                sx={{
                  bgcolor: '#ff6b35',
                  '&:hover': { bgcolor: '#e55a2b' },
                }}
              >
                {importing
                  ? (language === 'ko' ? '업로드 중...' : 'Uploading...')
                  : (language === 'ko' ? '전체 업로드' : 'Upload All')}
              </Button>
            </Box>

            <Divider />

            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 50 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {language === 'ko' ? '제목' : 'Title'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 200 }}>
                      {language === 'ko' ? '태그' : 'Tags'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>
                      {language === 'ko' ? '상태' : 'Status'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 60 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {postItems.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Tooltip title={item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '')} arrow>
                          <Typography
                            sx={{
                              maxWidth: 400,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {item.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: subCategoryColors[tag] || '#666',
                                color: '#fff',
                              }}
                            />
                          ))}
                          {item.tags.length > 3 && (
                            <Chip
                              label={`+${item.tags.length - 3}`}
                              size="small"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {item.status === 'success' && (
                          <Chip
                            icon={<CheckIcon sx={{ fontSize: 14 }} />}
                            label={language === 'ko' ? '성공' : 'Done'}
                            size="small"
                            color="success"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {item.status === 'error' && (
                          <Tooltip title={item.error || ''}>
                            <Chip
                              icon={<ErrorIcon sx={{ fontSize: 14 }} />}
                              label={language === 'ko' ? '실패' : 'Failed'}
                              size="small"
                              color="error"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Tooltip>
                        )}
                        {item.status === 'pending' && (
                          <Chip
                            label={language === 'ko' ? '대기' : 'Pending'}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(index)}
                          disabled={importing || item.status === 'success'}
                          sx={{ color: 'text.disabled' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      <Footer />
    </>
  );
}
