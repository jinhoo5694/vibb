import { supabase } from './client';
import {
  Content,
  ContentWithRelations,
  Tag,
  Profile,
  Review,
  ReviewWithUser,
  ReviewReplyWithUser,
  SkillWithCategory,
  Category,
  License,
  LegacyContent,
  contentToSkill,
  contentToLicense,
  contentToLegacyContents,
} from '@/types/database';
import { isDebugMode } from '@/lib/debug';

// ============================================
// Content (Skills) Functions
// ============================================

// Search skills by query
export async function searchSkills(query: string, language?: 'ko' | 'en'): Promise<SkillWithCategory[]> {
  if (!query.trim()) {
    return [];
  }

  const { data: contents, error } = await supabase
    .from('contents')
    .select(`
      *,
      content_tags (
        tag_id,
        tags:tag_id (id, name)
      )
    `)
    .eq('type', 'skill')
    .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
    .order('view_count', { ascending: false })
    .limit(10);

  if (error || !contents) {
    console.error('Error searching skills:', error);
    return [];
  }

  // Get reviews count for each content
  const contentIds = contents.map(c => c.id);
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('content_id')
    .in('content_id', contentIds);

  const reviewsCountMap: Record<string, number> = {};
  reviewsData?.forEach(review => {
    reviewsCountMap[review.content_id] = (reviewsCountMap[review.content_id] || 0) + 1;
  });

  // Transform to ContentWithRelations and then to legacy format
  const skillsWithRelations: ContentWithRelations[] = contents.map(content => {
    const tags = content.content_tags
      ?.map((ct: { tags: Tag | Tag[] | null }) => {
        if (Array.isArray(ct.tags)) return ct.tags[0];
        return ct.tags;
      })
      .filter((t: Tag | null): t is Tag => t !== null) || [];

    return {
      ...content,
      author: null,
      tags,
      upvote_count: content.upvote_count || 0,
      downvote_count: content.downvote_count || 0,
      reviews_count: reviewsCountMap[content.id] || 0,
    };
  });

  return skillsWithRelations.map(contentToSkill);
}

// Fetch all skills (contents with type='skill')
export async function getSkills(): Promise<SkillWithCategory[]> {
  // In debug mode, always return mock data
  if (isDebugMode()) {
    return getMockSkills();
  }

  const { data: contents, error } = await supabase
    .from('contents')
    .select(`
      *,
      content_tags (
        tag_id,
        tags:tag_id (id, name)
      )
    `)
    .eq('type', 'skill')
    .order('view_count', { ascending: false });

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  if (!contents || contents.length === 0) {
    return [];
  }

  // Get reviews count for each content
  const contentIds = contents.map(c => c.id);
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('content_id')
    .in('content_id', contentIds);

  const reviewsCountMap: Record<string, number> = {};
  reviewsData?.forEach(review => {
    reviewsCountMap[review.content_id] = (reviewsCountMap[review.content_id] || 0) + 1;
  });

  // Transform to ContentWithRelations and then to legacy format
  const skillsWithRelations: ContentWithRelations[] = contents.map(content => {
    const tags = content.content_tags
      ?.map((ct: { tags: Tag | Tag[] | null }) => {
        if (Array.isArray(ct.tags)) return ct.tags[0];
        return ct.tags;
      })
      .filter((t: Tag | null): t is Tag => t !== null) || [];

    return {
      ...content,
      author: null,
      tags,
      upvote_count: content.upvote_count || 0,
      downvote_count: content.downvote_count || 0,
      reviews_count: reviewsCountMap[content.id] || 0,
    };
  });

  return skillsWithRelations.map(contentToSkill);
}

// Fetch skill by ID
export async function getSkillById(skillId: string): Promise<SkillWithCategory | null> {
  // In debug mode, return from mock data
  if (isDebugMode()) {
    const mockSkill = getMockSkills().find(s => s.id === skillId);
    return mockSkill || null;
  }

  const { data: content, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:author_id (id, nickname, avatar_url, email),
      content_tags (
        tag_id,
        tags:tag_id (id, name)
      )
    `)
    .eq('id', skillId)
    .single();

  if (error || !content) {
    console.error('Error fetching skill:', error);
    return null;
  }

  // Get reviews count
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', skillId);

  const tags = content.content_tags
    ?.map((ct: { tags: Tag | Tag[] | null }) => {
      if (Array.isArray(ct.tags)) return ct.tags[0];
      return ct.tags;
    })
    .filter((t: Tag | null): t is Tag => t !== null) || [];

  const contentWithRelations: ContentWithRelations = {
    ...content,
    author: content.author as Profile | null,
    tags,
    upvote_count: content.upvote_count || 0,
    downvote_count: content.downvote_count || 0,
    reviews_count: reviewsCount || 0,
  };

  return contentToSkill(contentWithRelations);
}

// Get skills by tag (category)
export async function getSkillsByCategory(tagId: string): Promise<SkillWithCategory[]> {
  const { data: contentTags, error } = await supabase
    .from('content_tags')
    .select(`
      content_id,
      contents:content_id (
        *,
        content_tags (
          tag_id,
          tags:tag_id (id, name)
        )
      )
    `)
    .eq('tag_id', parseInt(tagId));

  if (error || !contentTags) {
    console.error('Error fetching skills by category:', error);
    return [];
  }

  const contents: Array<Content & { content_tags: Array<{ tags: Tag | null }> }> = [];
  for (const ct of contentTags) {
    const c = ct.contents;
    if (c && typeof c === 'object' && !Array.isArray(c) &&
        (c as Content).type === 'skill') {
      contents.push(c as Content & { content_tags: Array<{ tags: Tag | null }> });
    }
  }

  // Get reviews counts
  const contentIds = contents.map(c => c.id);

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('content_id')
    .in('content_id', contentIds);

  const reviewsCountMap: Record<string, number> = {};
  reviewsData?.forEach(review => {
    reviewsCountMap[review.content_id] = (reviewsCountMap[review.content_id] || 0) + 1;
  });

  const skillsWithRelations: ContentWithRelations[] = contents.map(content => {
    const tags = content.content_tags
      ?.map((ct: { tags: Tag | null }) => ct.tags)
      .filter((t: Tag | null): t is Tag => t !== null) || [];

    return {
      ...content,
      author: null,
      tags,
      upvote_count: content.upvote_count || 0,
      downvote_count: content.downvote_count || 0,
      reviews_count: reviewsCountMap[content.id] || 0,
    };
  });

  return skillsWithRelations.map(contentToSkill);
}

// ============================================
// Categories (Tags) Functions
// ============================================

// Fetch all categories (tags)
export async function getCategories(): Promise<Category[]> {
  // In debug mode, return mock categories
  if (isDebugMode()) {
    return getMockCategories();
  }

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error || !tags || tags.length === 0) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Convert tags to legacy category format
  return tags.map(tag => ({
    id: tag.id.toString(),
    icon: null,
    category_name_ko: tag.name,
    category_name_en: tag.name,
  }));
}

// ============================================
// Skill Content Functions
// ============================================

// Get skill contents (what_is, how_to_use, key_features from metadata)
export async function getSkillContents(skillId: string): Promise<LegacyContent[]> {
  // In debug mode, return mock skill contents
  if (isDebugMode()) {
    return getMockSkillContents(skillId);
  }

  const { data: content, error } = await supabase
    .from('contents')
    .select('id, metadata, body')
    .eq('id', skillId)
    .single();

  if (error || !content) {
    console.error('Error fetching skill contents:', error);
    return [];
  }

  return contentToLegacyContents(content as Content);
}

// ============================================
// License Functions
// ============================================

// Get skill license (from metadata)
export async function getSkillLicense(skillId: string): Promise<License | null> {
  const { data: content, error } = await supabase
    .from('contents')
    .select('id, metadata')
    .eq('id', skillId)
    .single();

  if (error || !content) {
    console.error('Error fetching skill license:', error);
    return null;
  }

  return contentToLicense(content as Content);
}

// ============================================
// View Count Functions
// ============================================

export async function incrementViewCount(skillId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', { content_id: skillId });

  if (error) {
    // Fallback: manual increment
    const { data: content } = await supabase
      .from('contents')
      .select('view_count')
      .eq('id', skillId)
      .single();

    if (content) {
      await supabase
        .from('contents')
        .update({ view_count: (content.view_count || 0) + 1 })
        .eq('id', skillId);
    }
  }
}

// ============================================
// Vote Functions
// ============================================

export async function toggleVote(
  userId: string,
  contentId: string,
  voteType: 'upvote' | 'downvote'
): Promise<{ voted: 'upvote' | 'downvote' | null; upvoteCount: number; downvoteCount: number; action: 'added' | 'removed' | 'changed' }> {
  // Use RPC for voting
  const { data, error } = await supabase.rpc('toggle_vote', {
    target_content_id: contentId,
    vote: voteType,
  });

  if (error) {
    console.error('Error toggling vote:', error);
    // Return current state on error
    const { data: content } = await supabase
      .from('contents')
      .select('upvote_count, downvote_count')
      .eq('id', contentId)
      .single();

    return {
      voted: null,
      upvoteCount: content?.upvote_count || 0,
      downvoteCount: content?.downvote_count || 0,
      action: 'removed',
    };
  }

  // Fetch updated counts after successful vote
  const { data: content } = await supabase
    .from('contents')
    .select('upvote_count, downvote_count')
    .eq('id', contentId)
    .single();

  const voted = data?.action === 'removed' ? null : voteType;

  return {
    voted,
    upvoteCount: content?.upvote_count || 0,
    downvoteCount: content?.downvote_count || 0,
    action: data?.action || 'added',
  };
}

// Legacy function - toggles upvote for backward compatibility
export async function toggleLike(
  userId: string,
  contentId: string
): Promise<{ liked: boolean; likesCount: number }> {
  const result = await toggleVote(userId, contentId, 'upvote');
  return {
    liked: result.voted === 'upvote',
    likesCount: result.upvoteCount - result.downvoteCount,
  };
}

export async function getUserVote(userId: string, contentId: string): Promise<'upvote' | 'downvote' | null> {
  const { data } = await supabase
    .from('content_votes')
    .select('vote_type')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .maybeSingle();

  return data?.vote_type || null;
}

// Legacy function for backward compatibility
export async function hasUserLikedSkill(userId: string, contentId: string): Promise<boolean> {
  const vote = await getUserVote(userId, contentId);
  return vote === 'upvote';
}

// ============================================
// Review (Comment) Functions
// ============================================

export async function getSkillComments(skillId: string): Promise<ReviewWithUser[]> {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:user_id (id, nickname, avatar_url, email),
      replies:review_replies (
        id,
        review_id,
        user_id,
        content,
        created_at,
        user:user_id (id, nickname, avatar_url, email)
      )
    `)
    .eq('content_id', skillId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return (reviews || []).map(review => ({
    ...review,
    user: review.user as Profile | null,
    replies: (review.replies || []).map((reply: ReviewReplyWithUser & { user: Profile | null }) => ({
      ...reply,
      user: reply.user as Profile | null,
    })),
  }));
}

export async function addComment(
  userId: string,
  contentId: string,
  content: string,
  rating: number
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      content_id: contentId,
      content,
      rating,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding review:', error);
    return null;
  }

  return data;
}

export async function deleteComment(reviewId: string): Promise<boolean> {
  // First delete any replies
  await supabase
    .from('review_replies')
    .delete()
    .eq('review_id', reviewId);

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  return !error;
}

// ============================================
// Rating Functions
// ============================================

export async function getSkillAverageRating(skillId: string): Promise<number> {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('content_id', skillId);

  if (error || !reviews || reviews.length === 0) {
    return 0;
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

// ============================================
// Bookmark Functions
// ============================================

export async function toggleBookmark(
  userId: string,
  contentId: string
): Promise<{ bookmarked: boolean; action: 'added' | 'removed' }> {
  // Use RPC for toggling bookmark
  const { data, error } = await supabase.rpc('toggle_bookmark', {
    target_content_id: contentId,
  });

  if (error) {
    console.error('Error toggling bookmark:', error);
    // Return current state on error
    const isBookmarked = await hasUserBookmarked(userId, contentId);
    return { bookmarked: isBookmarked, action: isBookmarked ? 'added' : 'removed' };
  }

  const action = data?.action || 'added';
  return {
    bookmarked: action === 'added',
    action,
  };
}

export async function hasUserBookmarked(userId: string, contentId: string): Promise<boolean> {
  const { data } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .maybeSingle();

  return !!data;
}

// ============================================
// Mock Data (Fallback when DB is empty)
// ============================================

function getMockSkills(): SkillWithCategory[] {
  return [
    {
      id: 'mock-1',
      title_ko: '문서 작성 마스터',
      title_en: 'Document Writing Master',
      sub_title_ko: '전문적인 비즈니스 문서를 작성하는 스킬입니다.',
      sub_title_en: 'A skill for writing professional business documents.',
      icon: '📝',
      comments_count: 12,
      views_count: 1250,
      likes_count: 89,
      download_url: null,
      tags: '문서,비즈니스,오피스',
      categories: '1',
      category: {
        id: '1',
        icon: '📄',
        category_name_ko: '오피스',
        category_name_en: 'Office',
      },
    },
    {
      id: 'mock-2',
      title_ko: '코드 리뷰어',
      title_en: 'Code Reviewer',
      sub_title_ko: '코드를 분석하고 개선점을 제안하는 스킬입니다.',
      sub_title_en: 'A skill that analyzes code and suggests improvements.',
      icon: '💻',
      comments_count: 8,
      views_count: 890,
      likes_count: 67,
      download_url: null,
      tags: '개발,코드리뷰,프로그래밍',
      categories: '2',
      category: {
        id: '2',
        icon: '💻',
        category_name_ko: '개발',
        category_name_en: 'Development',
      },
    },
    {
      id: 'mock-3',
      title_ko: '창작 글쓰기',
      title_en: 'Creative Writing',
      sub_title_ko: '창의적인 스토리와 콘텐츠를 작성하는 스킬입니다.',
      sub_title_en: 'A skill for writing creative stories and content.',
      icon: '✍️',
      comments_count: 15,
      views_count: 2100,
      likes_count: 124,
      download_url: null,
      tags: '창작,글쓰기,스토리',
      categories: '3',
      category: {
        id: '3',
        icon: '🎨',
        category_name_ko: '창작',
        category_name_en: 'Creative',
      },
    },
  ];
}

function getMockCategories(): Category[] {
  return [
    { id: '1', icon: '📄', category_name_ko: '오피스', category_name_en: 'Office' },
    { id: '2', icon: '💻', category_name_ko: '개발', category_name_en: 'Development' },
    { id: '3', icon: '🎨', category_name_ko: '창작', category_name_en: 'Creative' },
    { id: '4', icon: '📈', category_name_ko: '생산성', category_name_en: 'Productivity' },
    { id: '5', icon: '💬', category_name_ko: '커뮤니케이션', category_name_en: 'Communication' },
  ];
}

function getMockSkillContents(skillId: string): LegacyContent[] {
  const mockContents: Record<string, LegacyContent[]> = {
    'mock-1': [
      {
        id: 'mock-1-what-is',
        content_type: 'what_is',
        content_text: '문서 작성 마스터는 전문적인 비즈니스 문서를 빠르고 정확하게 작성할 수 있도록 도와주는 클로드 스킬입니다.',
        skills: 'mock-1',
      },
      {
        id: 'mock-1-how-to-use',
        content_type: 'how_to_use',
        content_text: '스킬을 다운로드한 후 클로드에 추가하세요. 그런 다음 문서 작성을 요청하면 됩니다.',
        skills: 'mock-1',
      },
    ],
    'mock-2': [
      {
        id: 'mock-2-what-is',
        content_type: 'what_is',
        content_text: '코드 리뷰어는 코드의 품질을 분석하고 개선점을 제안하는 스킬입니다.',
        skills: 'mock-2',
      },
    ],
    'mock-3': [
      {
        id: 'mock-3-what-is',
        content_type: 'what_is',
        content_text: '창작 글쓰기 스킬은 소설, 시나리오, 블로그 포스트 등 다양한 창작 콘텐츠를 작성할 수 있도록 도와줍니다.',
        skills: 'mock-3',
      },
    ],
  };

  return mockContents[skillId] || [];
}
