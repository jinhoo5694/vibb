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
import { getUserProfile } from '@/services/supabase';
import { createNews, CreateNewsInput } from '@/services/newsService';
import { NewsCategory, categoryColors, categoryIcons } from '@/types/news';

interface NewsUploadItem {
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  category: NewsCategory;
  status?: 'pending' | 'success' | 'error';
  error?: string;
}

const VALID_CATEGORIES: NewsCategory[] = ['AI', '개발', '스타트업', '트렌드', '튜토리얼'];

// Sample template for download
const sampleTemplate: NewsUploadItem[] = [
  {
    title: 'Claude 3.5 Sonnet 업데이트: 코딩 성능 대폭 향상',
    content: 'Anthropic이 Claude 3.5 Sonnet의 새로운 버전을 출시했습니다.\n\n## 주요 개선사항\n\n- 코딩 벤치마크에서 이전 버전 대비 30% 향상\n- 멀티파일 프로젝트 처리 능력 개선\n\n```javascript\n// 예시 코드\nconst result = await claude.complete(prompt);\n```',
    source: 'Anthropic Blog',
    sourceUrl: 'https://www.anthropic.com/news',
    category: 'AI',
  },
  {
    title: 'React 19 정식 출시',
    content: 'React 팀이 React 19를 정식 출시했습니다. 서버 컴포넌트가 정식으로 지원됩니다.\n\n## 새로운 기능\n\n- Server Components\n- use() 훅\n- 향상된 Suspense',
    source: 'React Blog',
    sourceUrl: 'https://react.dev/blog',
    category: '개발',
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
  const [newsItems, setNewsItems] = useState<NewsUploadItem[]>([]);
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
        const validatedItems: NewsUploadItem[] = [];
        const errors: string[] = [];

        data.forEach((item, index) => {
          const itemErrors: string[] = [];

          if (!item.title?.trim()) {
            itemErrors.push('title');
          }
          if (!item.content?.trim()) {
            itemErrors.push('content');
          }
          if (!item.source?.trim()) {
            itemErrors.push('source');
          }
          if (!item.sourceUrl?.trim()) {
            itemErrors.push('sourceUrl');
          }
          if (!item.category || !VALID_CATEGORIES.includes(item.category)) {
            itemErrors.push(`category (must be one of: ${VALID_CATEGORIES.join(', ')})`);
          }

          if (itemErrors.length > 0) {
            errors.push(`Item ${index + 1}: Missing or invalid fields - ${itemErrors.join(', ')}`);
          } else {
            validatedItems.push({
              title: item.title.trim(),
              content: item.content.trim(),
              source: item.source.trim(),
              sourceUrl: item.sourceUrl.trim(),
              category: item.category,
              status: 'pending',
            });
          }
        });

        if (errors.length > 0) {
          setError(errors.join('\n'));
        }

        if (validatedItems.length > 0) {
          setNewsItems(validatedItems);
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
    setNewsItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (!user || newsItems.length === 0) return;

    setImporting(true);
    setImportProgress(0);
    setImportResults(null);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < newsItems.length; i++) {
      const item = newsItems[i];

      try {
        const input: CreateNewsInput = {
          title: item.title,
          content: item.content,
          source: item.source,
          sourceUrl: item.sourceUrl,
          category: item.category,
          authorId: user.id,
        };

        const result = await createNews(input);

        if (result) {
          successCount++;
          setNewsItems((prev) =>
            prev.map((n, idx) =>
              idx === i ? { ...n, status: 'success' as const } : n
            )
          );
        } else {
          failedCount++;
          setNewsItems((prev) =>
            prev.map((n, idx) =>
              idx === i ? { ...n, status: 'error' as const, error: 'Failed to create' } : n
            )
          );
        }
      } catch (err) {
        failedCount++;
        setNewsItems((prev) =>
          prev.map((n, idx) =>
            idx === i ? { ...n, status: 'error' as const, error: String(err) } : n
          )
        );
      }

      setImportProgress(((i + 1) / newsItems.length) * 100);
    }

    setImporting(false);
    setImportResults({ success: successCount, failed: failedCount });
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(sampleTemplate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setNewsItems([]);
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
          onClick={() => router.push('/news')}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {language === 'ko' ? '뉴스 목록' : 'Back to News'}
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
            {language === 'ko' ? '뉴스 일괄 업로드' : 'Bulk Upload News'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? 'JSON 파일을 업로드하여 여러 뉴스를 한 번에 등록하세요.'
              : 'Upload a JSON file to add multiple news articles at once.'}
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

            {newsItems.length > 0 && (
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
    "title": "뉴스 제목",
    "content": "뉴스 본문 (마크다운 지원)\\n## 제목\\n- 목록\\n\`\`\`js\\ncode\\n\`\`\`",
    "source": "출처 (예: Anthropic Blog)",
    "sourceUrl": "https://원문-링크.com",
    "category": "AI" // AI, 개발, 스타트업, 트렌드, 튜토리얼
  }
]`}
            </Box>
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
        {newsItems.length > 0 && (
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
                {language === 'ko' ? `미리보기 (${newsItems.length}개)` : `Preview (${newsItems.length} items)`}
              </Typography>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={importing || newsItems.every((n) => n.status === 'success')}
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
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>
                      {language === 'ko' ? '카테고리' : 'Category'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>
                      {language === 'ko' ? '출처' : 'Source'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>
                      {language === 'ko' ? '상태' : 'Status'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 60 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newsItems.map((item, index) => (
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
                        <Typography variant="body2" color="text.secondary">
                          {item.source}
                        </Typography>
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
