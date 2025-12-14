import { supabase } from './client';
import { Content, ContentWithRelations, Profile, Tag } from '@/types/database';
import { Post, PostCategory, MainCategory, SubCategoryTag } from '@/types/post';

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

// Vote on a post (upvote/downvote)
export async function votePost(
  userId: string,
  contentId: string,
  voteType: 'up' | 'down'
): Promise<{ success: boolean; upvote_count: number; downvote_count: number }> {
  const voteValue = voteType === 'up' ? 'upvote' : 'downvote';

  // Check if already voted
  const { data: existingVote } = await supabase
    .from('content_votes')
    .select('vote_type')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .single();

  if (existingVote) {
    if (existingVote.vote_type === voteValue) {
      // Remove vote if same type
      await supabase
        .from('content_votes')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId);
    } else {
      // Change vote type
      await supabase
        .from('content_votes')
        .update({ vote_type: voteValue })
        .eq('user_id', userId)
        .eq('content_id', contentId);
    }
  } else {
    // Create new vote
    await supabase
      .from('content_votes')
      .insert({ user_id: userId, content_id: contentId, vote_type: voteValue });
  }

  // Get updated counts from contents table
  const { data: content } = await supabase
    .from('contents')
    .select('upvote_count, downvote_count')
    .eq('id', contentId)
    .single();

  return {
    success: true,
    upvote_count: content?.upvote_count || 0,
    downvote_count: content?.downvote_count || 0,
  };
}

// Get post by ID
export async function getPostById(postId: string): Promise<Post | null> {
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

// Delete a post
export async function deletePost(postId: string, userId: string): Promise<boolean> {
  // First verify ownership
  const { data: content } = await supabase
    .from('contents')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (!content || content.author_id !== userId) {
    return false;
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
