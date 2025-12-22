'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
  Button,
  Chip,
  alpha,
  Skeleton,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  MenuBook as GuideIcon,
  AttachMoney as PricingIcon,
  Forum as ForumIcon,
  RocketLaunch as RocketIcon,
  Construction as ConstructionIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  Visibility as ViewIcon,
  SearchOff as SearchOffIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getToolById, categoryInfo } from '@/data/ai-tools';
import { getPostsByTag } from '@/services/supabase/posts';
import { Post } from '@/types/post';

function ComingSoonPlaceholder({ language }: { language: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        color: 'text.secondary',
      }}
    >
      <ConstructionIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {language === 'ko' ? '콘텐츠 준비 중입니다...' : 'Content coming soon...'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
        {language === 'ko'
          ? '곧 유용한 정보를 제공해 드릴게요!'
          : 'We\'ll provide useful information soon!'}
      </Typography>
    </Box>
  );
}

interface RelatedPostsProps {
  toolName: string;
  brandColor: string;
  language: string;
}

function RelatedPosts({ toolName, brandColor, language }: RelatedPostsProps) {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const effectiveColor = brandColor === '#000000' ? theme.palette.text.primary : brandColor;

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const relatedPosts = await getPostsByTag(toolName, { limit: 4, sortBy: 'top' });
      setPosts(relatedPosts);
      setLoading(false);
    }
    fetchPosts();
  }, [toolName]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          {language === 'ko'
            ? `아직 ${toolName} 관련 게시물이 없습니다.`
            : `No posts about ${toolName} yet.`}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', opacity: 0.7 }}>
          {language === 'ko'
            ? '첫 번째로 경험과 팁을 공유해보세요!'
            : 'Be the first to share your experiences and tips!'}
        </Typography>
        <Button
          component={Link}
          href="/board"
          variant="outlined"
          size="large"
          sx={{
            borderColor: effectiveColor,
            color: effectiveColor,
            '&:hover': {
              borderColor: effectiveColor,
              bgcolor: alpha(effectiveColor, 0.05),
            },
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {language === 'ko' ? '커뮤니티에서 글 쓰기' : 'Write in Community'}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {posts.map((post) => (
        <Link key={post.id} href={`/board/${post.id}`} style={{ textDecoration: 'none' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#fafafa',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: effectiveColor,
                bgcolor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar
                src={post.author.avatar}
                sx={{ width: 40, height: 40, bgcolor: effectiveColor }}
              >
                {post.author.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.5,
                  }}
                >
                  {post.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    {post.author.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ThumbUpIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.upvotes}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CommentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.commentCount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ViewIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.viewCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Link>
      ))}

      {/* 더보기 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          component={Link}
          href={`/board?tag=${encodeURIComponent(toolName)}`}
          variant="outlined"
          sx={{
            borderColor: effectiveColor,
            color: effectiveColor,
            '&:hover': {
              borderColor: effectiveColor,
              bgcolor: alpha(effectiveColor, 0.05),
            },
            borderRadius: 2,
            px: 4,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {language === 'ko' ? '더보기' : 'View More'}
        </Button>
      </Box>
    </Box>
  );
}

interface GuideCardProps {
  icon: React.ReactNode;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  href: string;
  language: string;
  brandColor: string;
  delay?: number;
}

function GuideCard({ icon, titleKo, titleEn, descriptionKo, descriptionEn, href, language, brandColor, delay = 0 }: GuideCardProps) {
  const theme = useTheme();
  const effectiveColor = brandColor === '#000000' ? theme.palette.text.primary : brandColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ flex: 1 }}
    >
      <Link href={href} style={{ textDecoration: 'none' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: '100%',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&:hover': {
              borderColor: effectiveColor,
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: alpha(effectiveColor, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: effectiveColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              {language === 'ko' ? titleKo : titleEn}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {language === 'ko' ? descriptionKo : descriptionEn}
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
        </Paper>
      </Link>
    </motion.div>
  );
}

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const resolvedParams = use(params);
  const tool = getToolById(resolvedParams.toolId);
  const theme = useTheme();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'posts' | 'pricing'>('posts');

  if (!tool) {
    notFound();
  }

  const categoryMeta = categoryInfo[tool.category];
  const effectiveColor = tool.brandColor === '#000000' ? theme.palette.text.primary : tool.brandColor;

  const heroBackground =
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha(tool.brandColor, 0.25)} 0%, #1a1a1a 100%)`
      : `linear-gradient(135deg, ${alpha(tool.brandColor, 0.12)} 0%, #ffffff 100%)`;

  const handleTabChange = (_: React.MouseEvent<HTMLElement>, newValue: 'posts' | 'pricing' | null) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section with Brand Color */}
      <Box
        sx={{
          background: heroBackground,
          py: { xs: 6, md: 8 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Button
              component={Link}
              href="/ai-tools"
              startIcon={<ArrowBackIcon />}
              sx={{
                mb: 3,
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: alpha(effectiveColor, 0.05),
                },
              }}
            >
              {language === 'ko' ? '목록으로 돌아가기' : 'Back to List'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 4 }}>
              {/* Logo & Official Link */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: { xs: 100, md: 120 },
                    height: { xs: 100, md: 120 },
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#ffffff',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <Box
                    component="img"
                    src={tool.logo}
                    alt={tool.name}
                    sx={{
                      width: '70%',
                      height: '70%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                {/* Official Website Text Button */}
                <Button
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    color: effectiveColor,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: alpha(effectiveColor, 0.05),
                    },
                  }}
                >
                  {language === 'ko' ? '공식 홈페이지' : 'Official Website'}
                </Button>
              </Box>

              {/* Info */}
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
                <Chip
                  label={language === 'ko' ? categoryMeta.labelKo : categoryMeta.labelEn}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: `${categoryMeta.color}20`,
                    color: categoryMeta.color,
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 2,
                    color: tool.brandColor === '#000000' ? 'text.primary' : tool.brandColor,
                  }}
                >
                  {tool.name}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    mb: 1.5,
                    maxWidth: 600,
                    lineHeight: 1.6,
                  }}
                >
                  {language === 'ko' ? tool.tagline.ko : tool.tagline.en}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    maxWidth: 600,
                    lineHeight: 1.8,
                  }}
                >
                  {language === 'ko' ? tool.description.ko : tool.description.en}
                </Typography>

                {/* Guide Cards */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <GuideCard
                    icon={<GuideIcon sx={{ fontSize: 28 }} />}
                    titleKo="시작하기"
                    titleEn="Getting Started"
                    descriptionKo="상세한 가이드로 시작해보세요"
                    descriptionEn="Start with detailed guides"
                    href={`/ai-tools/${resolvedParams.toolId}/guide`}
                    language={language}
                    brandColor={tool.brandColor}
                    delay={0.1}
                  />
                  <GuideCard
                    icon={<RocketIcon sx={{ fontSize: 28 }} />}
                    titleKo="Hello World!"
                    titleEn="Hello World!"
                    descriptionKo="Step-by-step 가이드로 간단한 앱을 만들어 보세요"
                    descriptionEn="Build a simple app with step-by-step guide"
                    href={`/ai-tools/${resolvedParams.toolId}/hello-world`}
                    language={language}
                    brandColor={tool.brandColor}
                    delay={0.2}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Posts & Pricing Section with Toggle */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            }}
          >
            {/* Toggle Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <ToggleButtonGroup
                value={activeTab}
                exclusive
                onChange={handleTabChange}
                aria-label="content toggle"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: '8px !important',
                    border: 'none',
                    bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5',
                    '&.Mui-selected': {
                      bgcolor: alpha(effectiveColor, 0.15),
                      color: effectiveColor,
                      '&:hover': {
                        bgcolor: alpha(effectiveColor, 0.2),
                      },
                    },
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? '#303030' : '#eeeeee',
                    },
                  },
                  '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                    ml: 1,
                    borderLeft: 'none',
                  },
                }}
              >
                <ToggleButton value="posts" aria-label="community">
                  <ForumIcon sx={{ mr: 1, fontSize: 20 }} />
                  {language === 'ko' ? '커뮤니티' : 'Community'}
                </ToggleButton>
                <ToggleButton value="pricing" aria-label="pricing">
                  <PricingIcon sx={{ mr: 1, fontSize: 20 }} />
                  {language === 'ko' ? '요금제 정보' : 'Pricing Info'}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Content based on active tab */}
            {activeTab === 'posts' ? (
              <RelatedPosts
                toolName={tool.name}
                brandColor={tool.brandColor}
                language={language}
              />
            ) : (
              <ComingSoonPlaceholder language={language} />
            )}
          </Paper>
        </motion.div>
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
