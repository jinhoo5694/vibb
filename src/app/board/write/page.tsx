'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Alert,
  Collapse,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  MainCategory,
  SubCategoryTag,
  mainCategoryConfig,
  subCategoryColors,
} from '@/types/post';
import { createPost } from '@/services/supabase';

export default function WritePostPage() {
  const theme = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubTag, setSelectedSubTag] = useState<SubCategoryTag | null>(null);
  const [expandedMainCategory, setExpandedMainCategory] = useState<MainCategory | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Code block insertion state
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [codeContent, setCodeContent] = useState('');

  // Link insertion state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Handle main category selection
  const handleMainCategoryClick = (category: MainCategory) => {
    if (selectedMainCategory === category) {
      // Toggle expand/collapse
      setExpandedMainCategory(expandedMainCategory === category ? null : category);
    } else {
      setSelectedMainCategory(category);
      setSelectedSubTag(null); // Reset sub-tag when main category changes
      setExpandedMainCategory(category);
    }
  };

  // Handle sub-tag selection
  const handleSubTagClick = (subTag: SubCategoryTag) => {
    setSelectedSubTag(selectedSubTag === subTag ? null : subTag);
  };

  // Insert code block
  const insertCodeBlock = () => {
    const codeBlock = `\n\`\`\`${codeLanguage}\n${codeContent}\n\`\`\`\n`;
    setContent(prev => prev + codeBlock);
    setCodeLanguage('');
    setCodeContent('');
    setShowCodeDialog(false);
  };

  // Insert link
  const insertLink = () => {
    const link = `[${linkText}](${linkUrl})`;
    setContent(prev => prev + link);
    setLinkText('');
    setLinkUrl('');
    setShowLinkDialog(false);
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

    if (!selectedMainCategory) {
      alert(language === 'ko' ? '카테고리를 선택해주세요.' : 'Please select a category.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build tags array
      const tags: string[] = [selectedMainCategory];
      if (selectedSubTag) {
        tags.push(selectedSubTag);
      }

      // Create post in Supabase
      const result = await createPost(user.id, {
        title: title.trim(),
        body: content.trim(),
        type: 'post', // Community post type
        tags,
        metadata: {
          mainCategory: selectedMainCategory,
          subCategoryTag: selectedSubTag,
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
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.05)',
              cursor: 'pointer',
            }}
            onClick={() => setShowGuidelines(!showGuidelines)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: '#ff6b35' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ff6b35' }}>
                {language === 'ko' ? '커뮤니티 권고사항' : 'Community Guidelines'}
              </Typography>
            </Box>
            <IconButton size="small">
              {showGuidelines ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={showGuidelines}>
            <Box sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1, color: 'text.secondary', fontSize: '0.9rem' } }}>
                <li>
                  {language === 'ko'
                    ? '서로를 존중하고 예의 바른 언어를 사용해주세요.'
                    : 'Respect others and use polite language.'}
                </li>
                <li>
                  {language === 'ko'
                    ? '광고, 스팸, 도배성 게시글은 삭제될 수 있습니다.'
                    : 'Advertisements, spam, and repetitive posts may be deleted.'}
                </li>
                <li>
                  {language === 'ko'
                    ? '개인정보를 포함한 민감한 정보는 공유하지 마세요.'
                    : 'Do not share sensitive information including personal data.'}
                </li>
                <li>
                  {language === 'ko'
                    ? '저작권을 존중하고, 출처를 명시해주세요.'
                    : 'Respect copyrights and cite your sources.'}
                </li>
                <li>
                  {language === 'ko'
                    ? 'AI 도구 관련 질문, 팁, 경험 공유를 환영합니다!'
                    : 'Questions, tips, and experiences about AI tools are welcome!'}
                </li>
              </Box>
            </Box>
          </Collapse>
        </Paper>

        {/* Tag Selection */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            {language === 'ko' ? '태그 선택' : 'Select Tags'}
            <Typography component="span" variant="body2" color="error" sx={{ ml: 0.5 }}>*</Typography>
          </Typography>

          {/* Main Categories */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', mb: 1, display: 'block' }}>
              {language === 'ko' ? '메인 카테고리' : 'Main Category'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {(Object.keys(mainCategoryConfig) as MainCategory[]).map((mainCat) => {
                const config = mainCategoryConfig[mainCat];
                const isSelected = selectedMainCategory === mainCat;
                const isExpanded = expandedMainCategory === mainCat;

                return (
                  <Chip
                    key={mainCat}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{config.icon}</span>
                        <span>{mainCat}</span>
                        {isSelected && (
                          isExpanded ? <ExpandLessIcon sx={{ fontSize: 14, ml: 0.25 }} /> : <ExpandMoreIcon sx={{ fontSize: 14, ml: 0.25 }} />
                        )}
                      </Box>
                    }
                    size="small"
                    variant={isSelected ? 'filled' : 'outlined'}
                    onClick={() => handleMainCategoryClick(mainCat)}
                    sx={{
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.8rem',
                      height: 28,
                      bgcolor: isSelected ? config.color : 'transparent',
                      color: isSelected ? '#fff' : 'text.secondary',
                      borderColor: isSelected ? config.color : theme.palette.divider,
                      '&:hover': {
                        bgcolor: isSelected ? config.color : `${config.color}20`,
                        borderColor: config.color,
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Sub-category Tags */}
          {expandedMainCategory && (
            <Box
              sx={{
                pt: 2,
                borderTop: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, fontSize: '0.7rem', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>{mainCategoryConfig[expandedMainCategory].icon}</span>
                <span>{expandedMainCategory} - {language === 'ko' ? '세부 태그 (선택사항)' : 'Sub-tag (Optional)'}</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {mainCategoryConfig[expandedMainCategory].subCategories.map((subTag) => {
                  const isSelected = selectedSubTag === subTag;
                  const color = subCategoryColors[subTag];

                  return (
                    <Chip
                      key={subTag}
                      label={subTag}
                      size="small"
                      variant={isSelected ? 'filled' : 'outlined'}
                      onClick={() => handleSubTagClick(subTag)}
                      sx={{
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: '0.75rem',
                        height: 24,
                        bgcolor: isSelected ? color : 'transparent',
                        color: isSelected ? '#fff' : 'text.secondary',
                        borderColor: isSelected ? color : theme.palette.divider,
                        '&:hover': {
                          bgcolor: isSelected ? color : `${color}20`,
                          borderColor: color,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Selected Tags Display */}
          {selectedMainCategory && (
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, fontSize: '0.7rem', mb: 1, display: 'block' }}>
                {language === 'ko' ? '선택된 태그' : 'Selected Tags'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{mainCategoryConfig[selectedMainCategory].icon}</span>
                      <span>{selectedMainCategory}</span>
                    </Box>
                  }
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                    bgcolor: mainCategoryConfig[selectedMainCategory].color,
                    color: '#fff',
                  }}
                />
                {selectedSubTag && (
                  <Chip
                    label={selectedSubTag}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      bgcolor: subCategoryColors[selectedSubTag],
                      color: '#fff',
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Title Input */}
        <TextField
          fullWidth
          label={language === 'ko' ? '제목' : 'Title'}
          placeholder={language === 'ko' ? '제목을 입력하세요' : 'Enter title'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 3 }}
          inputProps={{ maxLength: 100 }}
          helperText={`${title.length}/100`}
        />

        {/* Content Editor */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Editor Toolbar */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Button
              size="small"
              startIcon={<CodeIcon />}
              variant={showCodeDialog ? 'contained' : 'outlined'}
              onClick={() => {
                setShowCodeDialog(!showCodeDialog);
                setShowLinkDialog(false);
              }}
              sx={{ textTransform: 'none' }}
            >
              {language === 'ko' ? '코드 블록' : 'Code Block'}
            </Button>
            <Button
              size="small"
              startIcon={<LinkIcon />}
              variant={showLinkDialog ? 'contained' : 'outlined'}
              onClick={() => {
                setShowLinkDialog(!showLinkDialog);
                setShowCodeDialog(false);
              }}
              sx={{ textTransform: 'none' }}
            >
              {language === 'ko' ? '링크' : 'Link'}
            </Button>
          </Box>

          {/* Code Block Dialog */}
          <Collapse in={showCodeDialog}>
            <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderBottom: `1px solid ${theme.palette.divider}` }}>
              <TextField
                size="small"
                label={language === 'ko' ? '언어 (예: javascript, python)' : 'Language (e.g., javascript, python)'}
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label={language === 'ko' ? '코드' : 'Code'}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 1.5, fontFamily: 'monospace' }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={insertCodeBlock}
                disabled={!codeContent.trim()}
                sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}
              >
                {language === 'ko' ? '코드 삽입' : 'Insert Code'}
              </Button>
            </Box>
          </Collapse>

          {/* Link Dialog */}
          <Collapse in={showLinkDialog}>
            <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderBottom: `1px solid ${theme.palette.divider}` }}>
              <TextField
                size="small"
                label={language === 'ko' ? '링크 텍스트' : 'Link Text'}
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label={language === 'ko' ? 'URL' : 'URL'}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                fullWidth
                placeholder="https://"
                sx={{ mb: 1.5 }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={insertLink}
                disabled={!linkText.trim() || !linkUrl.trim()}
                sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}
              >
                {language === 'ko' ? '링크 삽입' : 'Insert Link'}
              </Button>
            </Box>
          </Collapse>

          {/* Content Textarea */}
          <TextField
            fullWidth
            multiline
            rows={12}
            placeholder={language === 'ko'
              ? '내용을 입력하세요...\n\n코드 블록과 링크만 지원됩니다.'
              : 'Enter your content...\n\nOnly code blocks and links are supported.'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '& fieldset': { border: 'none' },
              },
              '& .MuiInputBase-input': {
                p: 2,
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              },
            }}
          />

          {/* Character count */}
          <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" color="text.disabled">
              {content.length} {language === 'ko' ? '자' : 'characters'}
            </Typography>
          </Box>
        </Paper>

        {/* Preview hint */}
        <Alert severity="info" sx={{ mb: 3 }}>
          {language === 'ko'
            ? '마크다운 문법 중 코드 블록(```)과 링크([텍스트](URL))만 지원됩니다.'
            : 'Only code blocks (```) and links ([text](URL)) are supported in markdown.'}
        </Alert>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            sx={{ px: 4 }}
          >
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim() || !selectedMainCategory}
            sx={{
              px: 4,
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e55a2b' },
              '&:disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {isSubmitting
              ? (language === 'ko' ? '등록 중...' : 'Submitting...')
              : (language === 'ko' ? '게시하기' : 'Submit')}
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
}
