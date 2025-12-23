'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Chip,
  Button,
  Container,
  Paper,
  useTheme,
  IconButton,
  Rating,
  Snackbar,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import { SkillCard } from '@/components/SkillCard/SkillCard';
import { CommentSection } from '@/components/Comments/CommentSection';
import { SkillDetailSkeleton } from '@/components/Skeletons';
import {
  getSkillById,
  getSkillContents,
  getSkillLicense,
  getSkills,
  incrementViewCount,
  toggleLike,
  hasUserLikedSkill,
  getSkillAverageRating,
} from '@/services/supabase';
import {
  SkillWithCategory,
  LegacyContent,
  License,
  getLocalizedValue,
  parseTags,
} from '@/types/database';

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const theme = useTheme();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // State
  const [skill, setSkill] = useState<SkillWithCategory | null>(null);
  const [contents, setContents] = useState<LegacyContent[]>([]);
  const [license, setLicense] = useState<License | null>(null);
  const [relatedSkills, setRelatedSkills] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch skill data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [skillData, contentsData, licenseData, allSkills, rating] = await Promise.all([
          getSkillById(id),
          getSkillContents(id),
          getSkillLicense(id),
          getSkills(),
          getSkillAverageRating(id),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1s loading
        ]);

        if (skillData) {
          setSkill(skillData);
          setLikesCount(skillData.likes_count || 0);
          // Increment view count
          incrementViewCount(id);
        }
        setContents(contentsData);
        setLicense(licenseData);
        setAverageRating(rating);

        // Get related skills (random 3, excluding current)
        const related = allSkills
          .filter((s) => s.id !== id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setRelatedSkills(related);

        // Check if user has liked this skill
        if (user) {
          const isLiked = await hasUserLikedSkill(user.id, id);
          setLiked(isLiked);
        }
      } catch (error) {
        console.error('Error fetching skill:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, user]);

  // Get content by type
  const getContentByType = (type: string) => {
    return contents.find((c) => c.content_type === type)?.content_text || '';
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!user) {
      alert(t('common.loginRequired'));
      return;
    }

    try {
      const result = await toggleLike(user.id, id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (skill?.download_url) {
      window.open(skill.download_url, '_blank');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <SkillDetailSkeleton />
      </>
    );
  }

  if (!skill) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4">{t('skillDetail.notFound')}</Typography>
          <Button onClick={() => router.push('/skills/explore')} sx={{ mt: 2 }}>
            {t('skillDetail.backToSkills')}
          </Button>
        </Container>
      </>
    );
  }

  // Get localized values
  const title = getLocalizedValue(skill.title_ko, skill.title_en, language as 'ko' | 'en');
  const description = getLocalizedValue(skill.sub_title_ko, skill.sub_title_en, language as 'ko' | 'en');
  const categoryName = skill.category
    ? getLocalizedValue(skill.category.category_name_ko, skill.category.category_name_en, language as 'ko' | 'en')
    : '';
  const tags = parseTags(skill.tags);

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Icon and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 'bold',
                color: 'white',
                boxShadow: theme.shadows[8],
              }}
            >
              {skill.icon || title.charAt(0)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                  mb: 1,
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* License, Git, Owner, Download, Share buttons */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flex: 1 }}>
            {license && (
              <>
                <Chip label={`License: ${license.license_type}`} variant="outlined" />
                {license.owner_id && <Chip label={`Owner: ${license.owner_id}`} variant="outlined" />}
              </>
            )}
            <Chip
              icon={<FavoriteIcon />}
              label={`${likesCount.toLocaleString()} likes`}
              color="error"
              variant="outlined"
            />
            <Chip
              icon={<ViewIcon />}
              label={`${(skill.views_count || 0).toLocaleString()} views`}
              variant="outlined"
            />
            <Chip
              icon={<CommentIcon />}
              label={`${(skill.comments_count || 0).toLocaleString()} comments`}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {skill.download_url && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                size="large"
              >
                {t('skillDetail.download')}
              </Button>
            )}
            {license?.github_url && (
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href={license.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('skillDetail.github')}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              {t('skillDetail.share')}
            </Button>
          </Box>
        </Paper>

        {/* Category, Subtitle, Tags, Ratings */}
        <Box sx={{ mb: 4 }}>
          {/* Category */}
          {categoryName && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={categoryName}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}

          {/* Subtitle/Description */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.7 }}
          >
            {description}
          </Typography>

          {/* Tags */}
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          )}

          {/* Ratings */}
          {averageRating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={averageRating} precision={0.5} readOnly size="large" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({skill.comments_count || 0} {t('skillDetail.reviews')})
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main Contents */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: theme.palette.background.default }}>
          {getContentByType('what_is') && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {t('skillDetail.whatIsIt.title')}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}>
                {getContentByType('what_is')}
              </Typography>
            </Box>
          )}

          {getContentByType('how_to_use') && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {t('skillDetail.howToUse.title')}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}>
                {getContentByType('how_to_use')}
              </Typography>
            </Box>
          )}

          {getContentByType('key_features') && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {t('skillDetail.keyFeatures.title')}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary, whiteSpace: 'pre-line' }}>
                {getContentByType('key_features')}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Like Button */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleLikeToggle}
              color={liked ? 'error' : 'default'}
              size="large"
            >
              {liked ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
            </IconButton>
            <Typography variant="caption" display="block">
              {liked ? t('skillDetail.liked') : t('skillDetail.like')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {likesCount}
            </Typography>
          </Box>
        </Paper>

        {/* Comments */}
        <CommentSection contentId={skill.id} />
      </Container>

      {/* Discover More */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 3, md: 4 },
          my: { xs: 4, md: 6 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 184, 77, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(255, 107, 157, 0.05) 0%, rgba(255, 184, 77, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontWeight: 600,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('discover.moreSkills.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              mt: 1,
            }}
          >
            {t('discover.moreSkills.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Related Skills */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {relatedSkills.map((relatedSkill, index) => (
            <motion.div
              key={relatedSkill.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SkillCard skill={relatedSkill} linkPrefix="/skills" />
            </motion.div>
          ))}
        </Box>
      </Container>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={t('common.linkCopied')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#ff6b35',
            color: '#fff',
            fontWeight: 500,
            borderRadius: 2,
            minWidth: 'auto',
          },
        }}
      />
    </>
  );
}
