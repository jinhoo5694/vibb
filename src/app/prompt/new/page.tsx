'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  useTheme,
  Alert,
  Autocomplete,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { createPrompt } from '@/services/supabase';

// Common prompt tags
const SUGGESTED_TAGS = [
  'GPT', 'Claude', 'Gemini', 'Copilot',
  '코딩', '글쓰기', '번역', '요약', '분석',
  '마케팅', '이메일', '보고서', '기획',
  'System Prompt', 'Few-shot', 'Chain of Thought',
];

export default function NewPromptPage() {
  const theme = useTheme();
  const router = useRouter();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  if (!authLoading && !user) {
    router.push('/');
    return null;
  }

  const handleAddVariable = () => {
    const trimmed = newVariable.trim();
    if (trimmed && !variables.includes(trimmed)) {
      setVariables([...variables, trimmed]);
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validation
    if (!title.trim()) {
      setError(language === 'ko' ? '제목을 입력해주세요.' : 'Please enter a title.');
      return;
    }
    if (!promptText.trim()) {
      setError(language === 'ko' ? '프롬프트를 입력해주세요.' : 'Please enter the prompt text.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await createPrompt(user.id, {
        title: title.trim(),
        description: description.trim(),
        promptText: promptText.trim(),
        variables,
        tags,
      });

      if (result) {
        setSuccess(true);
        // Redirect to mypage after 2 seconds
        setTimeout(() => {
          router.push('/mypage');
        }, 2000);
      } else {
        setError(language === 'ko' ? '등록에 실패했습니다.' : 'Failed to submit.');
      }
    } catch (err) {
      console.error('Error submitting prompt:', err);
      setError(language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, minHeight: '60vh' }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
              {language === 'ko' ? '프롬프트가 제출되었습니다!' : 'Prompt Submitted!'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {language === 'ko'
                ? '관리자 검토 후 승인되면 다른 사용자들에게 공개됩니다. 마이페이지에서 상태를 확인할 수 있습니다.'
                : 'Your prompt will be visible to others once approved by an admin. You can check the status on your My Page.'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/mypage')}
              sx={{
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' },
              }}
            >
              {language === 'ko' ? '마이페이지로 이동' : 'Go to My Page'}
            </Button>
          </Paper>
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {language === 'ko' ? '돌아가기' : 'Go Back'}
        </Button>

        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'ko' ? '프롬프트 등록' : 'Submit Prompt'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'ko'
              ? '나만의 프롬프트를 공유하세요. 관리자 검토 후 승인됩니다.'
              : 'Share your prompt with the community. It will be reviewed by an admin.'}
          </Typography>
        </Box>

        {/* Info Alert */}
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {language === 'ko'
            ? '등록된 프롬프트는 관리자 검토 후 승인되면 다른 사용자들에게 공개됩니다. 마이페이지에서 승인 상태를 확인할 수 있습니다.'
            : 'Submitted prompts will be visible to others once approved by an admin. You can check the approval status on your My Page.'}
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            bgcolor: isDark ? '#1a1a1a' : '#fff',
          }}
        >
          {/* Title */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {language === 'ko' ? '제목' : 'Title'} *
            </Typography>
            <TextField
              fullWidth
              placeholder={language === 'ko' ? '프롬프트 제목을 입력하세요' : 'Enter prompt title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {language === 'ko' ? '설명' : 'Description'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={language === 'ko' ? '이 프롬프트에 대한 간단한 설명을 입력하세요' : 'Enter a brief description of this prompt'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Prompt Text */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {language === 'ko' ? '프롬프트 내용' : 'Prompt Text'} *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder={language === 'ko'
                ? '프롬프트 내용을 입력하세요. 변수는 {{변수명}} 형식으로 표시할 수 있습니다.'
                : 'Enter your prompt text. You can use {{variable}} format for variables.'}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontFamily: 'monospace',
                },
              }}
            />
          </Box>

          {/* Variables */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {language === 'ko' ? '변수 (선택사항)' : 'Variables (Optional)'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {language === 'ko'
                ? '프롬프트에서 사용되는 변수 이름을 추가하세요.'
                : 'Add variable names used in your prompt.'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder={language === 'ko' ? '변수 이름' : 'Variable name'}
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddVariable()}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                variant="outlined"
                onClick={handleAddVariable}
                startIcon={<AddIcon />}
                sx={{
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  '&:hover': { borderColor: '#d97706', bgcolor: 'rgba(245, 158, 11, 0.05)' },
                }}
              >
                {language === 'ko' ? '추가' : 'Add'}
              </Button>
            </Box>
            {variables.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {variables.map((variable) => (
                  <Chip
                    key={variable}
                    label={`{{${variable}}}`}
                    onDelete={() => handleRemoveVariable(variable)}
                    sx={{
                      bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                      fontFamily: 'monospace',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Tags */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {language === 'ko' ? '태그' : 'Tags'}
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={SUGGESTED_TAGS}
              value={tags}
              onChange={(_, newValue) => setTags(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    sx={{
                      bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={language === 'ko' ? '태그 입력 (Enter로 추가)' : 'Enter tags (press Enter to add)'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !promptText.trim()}
              startIcon={<SendIcon />}
              sx={{
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' },
                borderRadius: 2,
                px: 4,
              }}
            >
              {submitting
                ? (language === 'ko' ? '제출 중...' : 'Submitting...')
                : (language === 'ko' ? '프롬프트 제출' : 'Submit Prompt')}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
}
