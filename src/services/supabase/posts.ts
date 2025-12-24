import { supabase } from './client';
import { Content, ContentWithRelations, Profile, Tag, Review, ReviewWithUser, ReviewReply, ReviewReplyWithUser } from '@/types/database';
import { Post, PostCategory, MainCategory, SubCategoryTag } from '@/types/post';
import { isDebugMode } from '@/lib/debug';
import { samplePosts } from '@/data/posts';

// Map PostCategory to ContentType
const categoryToContentType: Record<PostCategory, string> = {
  '스킬': 'skill',
  'MCP': 'mcp',
  '프롬프트': 'prompt',
  'AI 코딩 툴': 'ai_tool',
  '커뮤니티': 'post',
  '질문': 'post',
};

// Convert database content to Post format
function contentToPost(content: ContentWithRelations): Post {
  const metadata = (content.metadata || {}) as Record<string, unknown>;

  // Determine category from content type and metadata
  let category: PostCategory = '커뮤니티';
  if (content.type === 'skill') category = '스킬';
  else if (content.type === 'mcp') category = 'MCP';
  else if (content.type === 'prompt') category = '프롬프트';
  else if (content.type === 'ai_tool') category = 'AI 코딩 툴';
  else if (metadata.post_category === 'question') category = '질문';

  return {
    id: content.id,
    title: content.title,
    content: content.body || '',
    author: {
      id: content.author?.id || content.author_id || undefined,
      name: content.author?.nickname || content.author?.email?.split('@')[0] || 'Anonymous',
      avatar: content.author?.avatar_url || undefined,
    },
    category,
    mainCategory: metadata.mainCategory as MainCategory | undefined,
    subCategoryTag: metadata.subCategoryTag as SubCategoryTag | undefined,
    createdAt: new Date(content.created_at || Date.now()),
    upvotes: content.upvote_count || 0,
    downvotes: content.downvote_count || 0,
    commentCount: content.reviews_count || 0,
    viewCount: content.view_count || 0,
    tags: content.tags?.map(t => t.name) || [],
    isPinned: (metadata.is_pinned as boolean) || false,
  };
}

// Helper function to filter and sort sample posts
function filterSamplePosts(
  contentType: string | undefined,
  sortBy: 'hot' | 'new' | 'top',
  limit: number,
  offset: number
): Post[] {
  let filtered = [...samplePosts];

  // Filter by content type if specified
  if (contentType && contentType !== 'all') {
    const typeToCategory: Record<string, PostCategory> = {
      'skill': '스킬',
      'mcp': 'MCP',
      'prompt': '프롬프트',
      'ai_tool': 'AI 코딩 툴',
      'post': '커뮤니티',
    };
    const category = typeToCategory[contentType];
    if (category) {
      filtered = filtered.filter(p => p.category === category || (contentType === 'post' && (p.category === '커뮤니티' || p.category === '질문')));
    }
  }

  // Sort
  const now = Date.now();
  switch (sortBy) {
    case 'hot':
      filtered.sort((a, b) => {
        const hoursA = (now - a.createdAt.getTime()) / (1000 * 60 * 60) + 2;
        const hoursB = (now - b.createdAt.getTime()) / (1000 * 60 * 60) + 2;
        const scoreA = (a.upvotes - a.downvotes) / Math.pow(hoursA, 1.5);
        const scoreB = (b.upvotes - b.downvotes) / Math.pow(hoursB, 1.5);
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return scoreB - scoreA;
      });
      break;
    case 'new':
      filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      break;
    case 'top':
      filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      });
      break;
  }

  return filtered.slice(offset, offset + limit);
}

// Fetch posts by content type
export async function getPosts(
  contentType?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'hot' | 'new' | 'top';
  }
): Promise<Post[]> {
  const { limit = 20, offset = 0, sortBy = 'hot' } = options || {};

  // In debug mode, return sample posts
  if (isDebugMode()) {
    return filterSamplePosts(contentType, sortBy, limit, offset);
  }

  let query = supabase
    .from('contents')
    .select(`
      *,
      author:author_id (id, nickname, avatar_url, email),
      content_tags (
        tag_id,
        tags:tag_id (id, name)
      )
    `);

  // Filter by content type if specified
  if (contentType && contentType !== 'all') {
    query = query.eq('type', contentType);
  }

  // Apply sorting
  switch (sortBy) {
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    case 'top':
      query = query.order('upvote_count', { ascending: false });
      break;
    case 'hot':
    default:
      // Hot sorting will be done client-side for now
      query = query.order('created_at', { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data: contents, error } = await query;

  if (error || !contents) {
    console.error('Error fetching posts:', error);
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

  // Transform to ContentWithRelations
  const postsWithRelations: ContentWithRelations[] = contents.map(content => {
    const tags = content.content_tags
      ?.map((ct: { tags: Tag | Tag[] | null }) => {
        if (Array.isArray(ct.tags)) return ct.tags[0];
        return ct.tags;
      })
      .filter((t: Tag | null): t is Tag => t !== null) || [];

    return {
      ...content,
      author: content.author as Profile | null,
      tags,
      upvote_count: content.upvote_count || 0,
      downvote_count: content.downvote_count || 0,
      reviews_count: reviewsCountMap[content.id] || 0,
    };
  });

  // Convert to Post format
  let posts = postsWithRelations.map(contentToPost);

  // Apply hot sorting client-side if needed
  if (sortBy === 'hot') {
    const now = Date.now();
    posts = posts.sort((a, b) => {
      const hoursA = (now - a.createdAt.getTime()) / (1000 * 60 * 60) + 2;
      const hoursB = (now - b.createdAt.getTime()) / (1000 * 60 * 60) + 2;
      const scoreA = (a.upvotes - a.downvotes) / Math.pow(hoursA, 1.5);
      const scoreB = (b.upvotes - b.downvotes) / Math.pow(hoursB, 1.5);

      // Pinned posts always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      return scoreB - scoreA;
    });
  }

  return posts;
}

// Fetch posts for a specific category board
export async function getBoardPosts(
  boardType: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'general',
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'hot' | 'new' | 'top';
  }
): Promise<Post[]> {
  // For general board, fetch 'post' type content
  const contentType = boardType === 'general' ? 'post' : boardType;
  return getPosts(contentType, options);
}

// Create a new post
export async function createPost(
  userId: string,
  data: {
    title: string;
    body: string;
    type: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
  }
): Promise<Content | null> {
  const insertData = {
    author_id: userId,
    type: data.type,
    title: data.title,
    body: data.body,
    metadata: data.metadata || {},
  };

  console.log('[createPost] Sending request with data:', {
    userId,
    insertData,
    tags: data.tags,
  });

  const { data: content, error } = await supabase
    .from('contents')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[createPost] Error creating post:', error);
    return null;
  }

  console.log('[createPost] Post created successfully:', content);

  // Add tags if provided
  if (data.tags && data.tags.length > 0 && content) {
    for (const tagName of data.tags) {
      // Check if tag exists
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single();

      let tagId = existingTag?.id;

      // Create tag if it doesn't exist
      if (!tagId) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: tagName, tag_category: 'topic' })
          .select('id')
          .single();
        tagId = newTag?.id;
      }

      // Link tag to content
      if (tagId) {
        await supabase
          .from('content_tags')
          .insert({ content_id: content.id, tag_id: tagId });
      }
    }
  }

  return content;
}

// Vote on a post (upvote/downvote) using RPC
export async function votePost(
  userId: string,
  contentId: string,
  voteType: 'up' | 'down'
): Promise<{ success: boolean; action: 'added' | 'removed' | 'changed'; vote: 'upvote' | 'downvote' | null }> {
  const voteValue = voteType === 'up' ? 'upvote' : 'downvote';

  const { data, error } = await supabase.rpc('toggle_vote', {
    target_content_id: contentId,
    vote: voteValue,
  });

  if (error) {
    console.error('Error voting:', error);
    return { success: false, action: 'removed', vote: null };
  }

  return {
    success: true,
    action: data?.action || 'added',
    vote: data?.action === 'removed' ? null : voteValue,
  };
}

// Get post by ID
export async function getPostById(postId: string): Promise<Post | null> {
  // In debug mode, return from sample posts
  if (isDebugMode()) {
    const post = samplePosts.find(p => p.id === postId);
    return post || null;
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
    .eq('id', postId)
    .single();

  if (error || !content) {
    console.error('Error fetching post:', error);
    return null;
  }

  // Get reviews count
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', postId);

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

  return contentToPost(contentWithRelations);
}

// Update an existing post
export async function updatePost(
  postId: string,
  userId: string,
  data: {
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
  }
): Promise<boolean> {
  // Verify ownership
  const { data: content } = await supabase
    .from('contents')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (!content || content.author_id !== userId) {
    console.error('[updatePost] User does not own this post');
    return false;
  }

  const { error } = await supabase
    .from('contents')
    .update({
      title: data.title,
      body: data.body,
      metadata: data.metadata || {},
    })
    .eq('id', postId);

  if (error) {
    console.error('[updatePost] Error updating post:', error);
    return false;
  }

  console.log('[updatePost] Post updated successfully');
  return true;
}

// Delete a post
export async function deletePost(postId: string, userId: string, isAdmin: boolean = false): Promise<boolean> {
  // Verify ownership unless admin
  if (!isAdmin) {
    const { data: content } = await supabase
      .from('contents')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!content || content.author_id !== userId) {
      return false;
    }
  }

  // Delete related data first
  await supabase.from('content_votes').delete().eq('content_id', postId);
  await supabase.from('content_tags').delete().eq('content_id', postId);
  await supabase.from('reviews').delete().eq('content_id', postId);
  await supabase.from('bookmarks').delete().eq('content_id', postId);

  // Delete the post
  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', postId);

  return !error;
}

// ============================================
// Comment Functions
// ============================================

export async function getPostComments(postId: string): Promise<ReviewWithUser[]> {
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
    .eq('content_id', postId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
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

export async function addPostComment(
  userId: string,
  postId: string,
  content: string
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      content_id: postId,
      content,
      rating: 1, // Default rating (required field, minimum 1)
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  return data;
}

export async function deletePostComment(reviewId: string): Promise<boolean> {
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
// Reply Functions
// ============================================

export async function addReply(
  userId: string,
  reviewId: string,
  content: string
): Promise<ReviewReply | null> {
  const { data, error } = await supabase
    .from('review_replies')
    .insert({
      user_id: userId,
      review_id: reviewId,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding reply:', error);
    return null;
  }

  return data;
}

export async function deleteReply(replyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('review_replies')
    .delete()
    .eq('id', replyId);

  return !error;
}

// ============================================
// Review Like Functions
// ============================================

export async function toggleReviewLike(
  reviewId: string
): Promise<{ success: boolean; action: 'liked' | 'unliked' }> {
  const { data, error } = await supabase.rpc('toggle_review_like', {
    target_review_id: reviewId,
  });

  if (error) {
    console.error('Error toggling review like:', error);
    return { success: false, action: 'unliked' };
  }

  return {
    success: true,
    action: data?.action || 'liked',
  };
}

export async function hasUserLikedReview(userId: string, reviewId: string): Promise<boolean> {
  const { data } = await supabase
    .from('review_likes')
    .select('*')
    .eq('user_id', userId)
    .eq('review_id', reviewId)
    .maybeSingle();

  return !!data;
}

// Search posts by tag name (for tool-related posts)
export async function getPostsByTag(
  tagName: string,
  options?: {
    limit?: number;
    sortBy?: 'hot' | 'new' | 'top';
  }
): Promise<Post[]> {
  const { limit = 4, sortBy = 'top' } = options || {};

  // First, find the tag
  const { data: tag } = await supabase
    .from('tags')
    .select('id')
    .ilike('name', tagName)
    .single();

  if (!tag) {
    return [];
  }

  // Get content IDs that have this tag
  const { data: contentTags } = await supabase
    .from('content_tags')
    .select('content_id')
    .eq('tag_id', tag.id);

  if (!contentTags || contentTags.length === 0) {
    return [];
  }

  const contentIds = contentTags.map(ct => ct.content_id);

  // Fetch the contents
  let query = supabase
    .from('contents')
    .select(`
      *,
      author:author_id (id, nickname, avatar_url, email),
      content_tags (
        tag_id,
        tags:tag_id (id, name)
      )
    `)
    .in('id', contentIds);

  // Apply sorting
  switch (sortBy) {
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    case 'top':
      query = query.order('upvote_count', { ascending: false });
      break;
    case 'hot':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  query = query.limit(limit);

  const { data: contents, error } = await query;

  if (error || !contents) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }

  // Get reviews count for each content
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('content_id')
    .in('content_id', contentIds);

  const reviewsCountMap: Record<string, number> = {};
  reviewsData?.forEach(review => {
    reviewsCountMap[review.content_id] = (reviewsCountMap[review.content_id] || 0) + 1;
  });

  // Transform to ContentWithRelations
  const postsWithRelations: ContentWithRelations[] = contents.map(content => {
    const tags = content.content_tags
      ?.map((ct: { tags: Tag | Tag[] | null }) => {
        if (Array.isArray(ct.tags)) return ct.tags[0];
        return ct.tags;
      })
      .filter((t: Tag | null): t is Tag => t !== null) || [];

    return {
      ...content,
      author: content.author as Profile | null,
      tags,
      upvote_count: content.upvote_count || 0,
      downvote_count: content.downvote_count || 0,
      reviews_count: reviewsCountMap[content.id] || 0,
    };
  });

  // Convert to Post format
  let posts = postsWithRelations.map(contentToPost);

  // Apply hot sorting client-side if needed
  if (sortBy === 'hot') {
    const now = Date.now();
    posts = posts.sort((a, b) => {
      const hoursA = (now - a.createdAt.getTime()) / (1000 * 60 * 60) + 2;
      const hoursB = (now - b.createdAt.getTime()) / (1000 * 60 * 60) + 2;
      const scoreA = (a.upvotes - a.downvotes) / Math.pow(hoursA, 1.5);
      const scoreB = (b.upvotes - b.downvotes) / Math.pow(hoursB, 1.5);
      return scoreB - scoreA;
    });
  }

  return posts;
}
