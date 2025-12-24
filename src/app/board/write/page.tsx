'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Collapse,
  IconButton,
  useTheme,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  InputBase,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { TagSelector } from '@/components/Community/TagSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { SubCategoryTag, subCategoryColors } from '@/types/post';
import { createPost } from '@/services/supabase';

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

// Parse markdown to render preview
function MarkdownPreview({ content, isDark }: { content: string; isDark: boolean }) {
  const theme = useTheme();

  const parseContent = (text: string) => {
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'code', content: match[2], language: match[1] || 'text' });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    parts.forEach((part) => {
      if (part.type === 'code') {
        elements.push(
          <Box key={key++} sx={{ my: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '4px 4px 0 0',
                border: `1px solid ${theme.palette.divider}`,
                borderBottom: 'none',
              }}
            >
              <CodeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {part.language}
              </Typography>
            </Box>
            <SyntaxHighlighter
              language={part.language}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0 0 4px 4px',
                border: `1px solid ${theme.palette.divider}`,
                borderTop: 'none',
                fontSize: '0.85rem',
              }}
            >
              {part.content.trim()}
            </SyntaxHighlighter>
          </Box>
        );
      } else {
        const textContent = part.content;
        const textElements: React.ReactNode[] = [];
        let textLastIndex = 0;
        let linkMatch;

        const linkRegexLocal = /\[([^\]]+)\]\(([^)]+)\)/g;
        while ((linkMatch = linkRegexLocal.exec(textContent)) !== null) {
          if (linkMatch.index > textLastIndex) {
            const beforeText = textContent.slice(textLastIndex, linkMatch.index);
            beforeText.split('\n').forEach((line, i, arr) => {
              if (line.trim()) {
                textElements.push(<span key={key++}>{line}</span>);
              }
              if (i < arr.length - 1) {
                textElements.push(<br key={key++} />);
              }
            });
          }
          textElements.push(
            <Box
              key={key++}
              component="a"
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#ff6b35',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <LinkIcon sx={{ fontSize: 14 }} />
              {linkMatch[1]}
            </Box>
          );
          textLastIndex = linkMatch.index + linkMatch[0].length;
        }

        if (textLastIndex < textContent.length) {
          const remainingText = textContent.slice(textLastIndex);
          remainingText.split('\n').forEach((line, i, arr) => {
            if (line.trim()) {
              textElements.push(<span key={key++}>{line}</span>);
            }
            if (i < arr.length - 1) {
              textElements.push(<br key={key++} />);
            }
          });
        }

        if (textElements.length > 0) {
          elements.push(
            <Typography key={key++} sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {textElements}
            </Typography>
          );
        }
      }
    });

    return elements;
  };

  if (!content.trim()) {
    return (
      <Typography color="text.disabled" sx={{ fontStyle: 'italic' }}>
        미리보기할 내용이 없습니다.
      </Typography>
    );
  }

  return <Box>{parseContent(content)}</Box>;
}

export default function WritePostPage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<SubCategoryTag[]>([]);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor mode: 'edit' or 'preview'
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  // Code dialog states
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState(CODE_LANGUAGES[0]);
  const [codeContent, setCodeContent] = useState('');

  // Link dialog states
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Preview tooltip state (show only once)
  const [showPreviewTooltip, setShowPreviewTooltip] = useState(true);

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

  // Handle submit
  const handleSubmit = async () => {
    if (!user) {
      alert(language === 'ko' ? '로그인이 필요합니다.' : 'Login required.');
      return;
    }

    if (!title.trim()) {
      alert(language === 'ko' ? '제목을 입력해주세요.' : 'Please enter a title.');
      return;
    }

    if (!content.trim()) {
      alert(language === 'ko' ? '내용을 입력해주세요.' : 'Please enter content.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags: string[] = [...selectedTags];

      const result = await createPost(user.id, {
        title: title.trim(),
        body: content,
        type: 'post',
        tags,
        metadata: {
          selectedTags,
        },
      });

      if (result) {
        alert(language === 'ko' ? '게시글이 등록되었습니다!' : 'Post submitted!');
        router.push('/board');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert(language === 'ko' ? '게시글 등록에 실패했습니다.' : 'Failed to submit post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCharCount = content.length;
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      <Header />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {language === 'ko' ? '돌아가기' : 'Go Back'}
        </Button>

        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {language === 'ko' ? '새 글 작성' : 'Write New Post'}
        </Typography>

        {/* Community Guidelines */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              bgcolor: isDark ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.05)',
              cursor: 'pointer',
            }}
            onClick={() => setShowGuidelines(!showGuidelines)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: '#ff6b35', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b35' }}>
                {language === 'ko' ? '커뮤니티 권고사항' : 'Community Guidelines'}
              </Typography>
            </Box>
            <IconButton size="small">
              {showGuidelines ? (
                <ExpandLessIcon sx={{ fontSize: 18 }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Box>
          <Collapse in={showGuidelines}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: theme.palette.background.paper }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {[
                  language === 'ko'
                    ? '서로를 존중하고 예의 바른 언어를 사용해주세요.'
                    : 'Respect others and use polite language.',
                  language === 'ko'
                    ? '광고, 스팸, 도배성 게시글은 삭제될 수 있습니다.'
                    : 'Advertisements, spam, and repetitive posts may be deleted.',
                  language === 'ko'
                    ? '개인정보를 포함한 민감한 정보는 공유하지 마세요.'
                    : 'Do not share sensitive information including personal data.',
                  language === 'ko'
                    ? '저작권을 존중하고, 출처를 명시해주세요.'
                    : 'Respect copyrights and cite your sources.',
                  language === 'ko'
                    ? 'AI 도구 관련 질문, 팁, 경험 공유를 환영합니다!'
                    : 'Questions, tips, and experiences about AI tools are welcome!',
                ].map((text, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                  >
                    <Typography
                      sx={{ color: '#ff6b35', fontSize: '0.8rem', lineHeight: 1.6 }}
                    >
                      •
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.6 }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Collapse>
        </Paper>

        {/* Editor */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: isDark ? '#1a1a1a' : '#ffffff',
          }}
        >
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
                disabled={editorMode === 'preview'}
                sx={{ textTransform: 'none' }}
              >
                {language === 'ko' ? '코드' : 'Code'}
              </Button>
              <Button
                size="small"
                startIcon={<LinkIcon />}
                variant="outlined"
                onClick={openLinkDialog}
                disabled={editorMode === 'preview'}
                sx={{ textTransform: 'none' }}
              >
                {language === 'ko' ? '링크' : 'Link'}
              </Button>
            </Box>

            <ToggleButtonGroup
              value={editorMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode) {
                  setEditorMode(newMode);
                  if (newMode === 'preview' && showPreviewTooltip) {
                    setShowPreviewTooltip(false);
                  }
                }
              }}
              size="small"
            >
              <ToggleButton value="edit" sx={{ textTransform: 'none', px: 2 }}>
                <EditIcon sx={{ fontSize: 18, mr: 0.5 }} />
                {language === 'ko' ? '편집' : 'Edit'}
              </ToggleButton>
              <Tooltip
                title={
                  language === 'ko'
                    ? '글이 어떻게 보이는지 확인해보세요'
                    : 'Preview how your post will look'
                }
                open={showPreviewTooltip}
                arrow
                placement="top"
              >
                <ToggleButton value="preview" sx={{ textTransform: 'none', px: 2 }}>
                  <VisibilityIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  {language === 'ko' ? '미리보기' : 'Preview'}
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>

          {/* Title Input - hidden in preview mode */}
          {editorMode === 'edit' && (
            <Box
              sx={{
                px: 2,
                pt: 2,
                pb: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? '#1a1a1a' : '#ffffff',
              }}
            >
              <InputBase
                fullWidth
                placeholder={language === 'ko' ? '제목을 입력하세요' : 'Enter title'}
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  '& .MuiInputBase-input': { p: 0 },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'text.disabled',
                    opacity: 1,
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 0.5, display: 'block' }}
              >
                {title.length}/100
              </Typography>
            </Box>
          )}

          {/* Editor Area */}
          <Box
            sx={{
              minHeight: 300,
              p: 2,
              bgcolor: isDark ? '#1a1a1a' : '#ffffff',
            }}
          >
            {editorMode === 'edit' ? (
              <TextField
                fullWidth
                multiline
                minRows={12}
                placeholder={
                  language === 'ko'
                    ? '나누고 싶은 이야기, 또는 물어보고 싶은 질문이 있으신가요?'
                    : 'Have a story to share or a question to ask?'
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                inputRef={textareaRef}
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
                {title.trim() && (
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {title}
                  </Typography>
                )}
                {selectedTags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {selectedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 20,
                          bgcolor: subCategoryColors[tag],
                          color: '#fff',
                        }}
                      />
                    ))}
                  </Box>
                )}
                <MarkdownPreview content={content} isDark={isDark} />
              </Box>
            )}
          </Box>

          {/* Tag Selection - hidden in preview mode */}
          {editorMode === 'edit' && (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? '#1a1a1a' : '#ffffff',
              }}
            >
              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                showHeader
              />
            </Box>
          )}

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
              {totalCharCount} {language === 'ko' ? '자' : 'characters'}
            </Typography>
          </Box>
        </Paper>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => router.back()} sx={{ px: 4 }}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            sx={{
              px: 4,
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e55a2b' },
              '&:disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {isSubmitting
              ? language === 'ko'
                ? '등록 중...'
                : 'Submitting...'
              : language === 'ko'
                ? '게시하기'
                : 'Submit'}
          </Button>
        </Box>
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
    </>
  );
}
