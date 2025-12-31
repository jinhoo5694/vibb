import { supabase } from './client';
import { Content, ContentWithRelations, Profile, Tag } from '@/types/database';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  variables?: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'pending' | 'published' | 'blocked';
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  downvotes: number;
  viewCount: number;
  commentCount: number;
  tags: string[];
}

// Convert database content to Prompt format
function contentToPrompt(content: ContentWithRelations): Prompt {
  const metadata = (content.metadata || {}) as Record<string, unknown>;

  return {
    id: content.id,
    title: content.title,
    description: content.body || '',
    promptText: (metadata.prompt_text as string) || '',
    variables: (metadata.variables as string[]) || [],
    author: {
      id: content.author?.id || content.author_id || '',
      name: content.author?.nickname || content.author?.email?.split('@')[0] || 'Anonymous',
      avatar: content.author?.avatar_url || undefined,
    },
    status: content.status,
    createdAt: new Date(content.created_at || Date.now()),
    upvotes: content.upvote_count || 0,
    downvotes: content.downvote_count || 0,
    viewCount: content.view_count || 0,
    commentCount: content.reviews_count || 0,
    tags: content.tags?.map(t => t.name) || [],
  };
}

// Get published prompts for the hub
export async function getPrompts(options?: {
  limit?: number;
  offset?: number;
  sortBy?: 'new' | 'popular' | 'top';
  searchQuery?: string;
}): Promise<Prompt[]> {
  const { limit = 20, offset = 0, sortBy = 'new', searchQuery } = options || {};

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
    .eq('type', 'prompt')
    .eq('content_status', 'published');

  // Apply search if provided
  if (searchQuery?.trim()) {
    query = query.ilike('title', `%${searchQuery.trim()}%`);
  }

  // Apply sorting
  switch (sortBy) {
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('view_count', { ascending: false });
      break;
    case 'top':
      query = query.order('upvote_count', { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data: contents, error } = await query;

  if (error || !contents) {
    console.error('Error fetching prompts:', error);
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
  const promptsWithRelations: ContentWithRelations[] = contents.map(content => {
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

  return promptsWithRelations.map(contentToPrompt);
}

// Get pending prompts for admin review
export async function getPendingPrompts(options?: {
  limit?: number;
  offset?: number;
}): Promise<Prompt[]> {
  const { limit = 50, offset = 0 } = options || {};

  const { data: contents, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:author_id (id, nickname, avatar_url, email),
      content_tags (
        tag_id,
        tags:tag_id (id, name)
      )
    `)
    .eq('type', 'prompt')
    .eq('content_status', 'pending')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !contents) {
    console.error('Error fetching pending prompts:', error);
    return [];
  }

  // Transform to ContentWithRelations
  const promptsWithRelations: ContentWithRelations[] = contents.map(content => {
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
      reviews_count: 0,
    };
  });

  return promptsWithRelations.map(contentToPrompt);
}

// Get prompt by ID
export async function getPromptById(promptId: string): Promise<Prompt | null> {
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
    .eq('id', promptId)
    .eq('type', 'prompt')
    .single();

  if (error || !content) {
    console.error('Error fetching prompt:', error);
    return null;
  }

  // Get reviews count
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', promptId);

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

  return contentToPrompt(contentWithRelations);
}

// Create a new prompt (always with pending status)
export async function createPrompt(
  userId: string,
  data: {
    title: string;
    description: string;
    promptText: string;
    variables?: string[];
    tags?: string[];
  }
): Promise<Content | null> {
  const { data: content, error } = await supabase
    .from('contents')
    .insert({
      author_id: userId,
      type: 'prompt',
      title: data.title,
      body: data.description,
      content_status: 'pending', // Always pending until admin approves
      metadata: {
        prompt_text: data.promptText,
        variables: data.variables || [],
      },
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating prompt:', error);
    return null;
  }

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
          .insert({ name: tagName, tag_category: 'prompt' })
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

// Approve a prompt (admin only)
export async function approvePrompt(promptId: string): Promise<boolean> {
  const { error } = await supabase.rpc('approve_content', {
    content_id: promptId,
    action: 'approve',
  });

  if (error) {
    console.error('Error approving prompt:', error);
    return false;
  }

  return true;
}

// Reject a prompt (admin only) - reason is required
export async function rejectPrompt(promptId: string, reason: string): Promise<boolean> {
  if (!reason.trim()) {
    console.error('Reject reason is required');
    return false;
  }

  const { error } = await supabase.rpc('approve_content', {
    content_id: promptId,
    action: 'reject',
    reject_reason: reason.trim(),
  });

  if (error) {
    console.error('Error rejecting prompt:', error);
    return false;
  }

  return true;
}

// Delete a prompt (admin only)
export async function deletePrompt(promptId: string): Promise<boolean> {
  // Delete related data first
  await Promise.all([
    supabase.from('content_votes').delete().eq('content_id', promptId),
    supabase.from('content_tags').delete().eq('content_id', promptId),
    supabase.from('reviews').delete().eq('content_id', promptId),
    supabase.from('bookmarks').delete().eq('content_id', promptId),
    supabase.from('content_views').delete().eq('content_id', promptId),
  ]);

  // Delete the prompt
  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', promptId);

  if (error) {
    console.error('Error deleting prompt:', error);
    return false;
  }

  return true;
}

// Get all prompts for admin management
export async function getPromptsForAdmin(options?: {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  status?: 'all' | 'published' | 'pending' | 'blocked';
}): Promise<Prompt[]> {
  const { limit = 100, offset = 0, searchQuery, status = 'all' } = options || {};

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
    .eq('type', 'prompt');

  // Apply status filter
  if (status !== 'all') {
    query = query.eq('content_status', status);
  }

  // Apply search if provided
  if (searchQuery?.trim()) {
    query = query.ilike('title', `%${searchQuery.trim()}%`);
  }

  query = query.order('created_at', { ascending: false });
  query = query.range(offset, offset + limit - 1);

  const { data: contents, error } = await query;

  if (error || !contents) {
    console.error('Error fetching prompts for admin:', error);
    return [];
  }

  // Transform to ContentWithRelations
  const promptsWithRelations: ContentWithRelations[] = contents.map(content => {
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
      reviews_count: 0,
    };
  });

  return promptsWithRelations.map(contentToPrompt);
}

// Update a prompt (admin only)
export async function updatePrompt(
  promptId: string,
  data: {
    title?: string;
    description?: string;
    promptText?: string;
    variables?: string[];
    tags?: string[];
    status?: 'draft' | 'pending' | 'published' | 'blocked';
  }
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.body = data.description;
  if (data.status !== undefined) updateData.content_status = data.status;
  if (data.promptText !== undefined || data.variables !== undefined) {
    // Fetch current metadata first
    const { data: current } = await supabase
      .from('contents')
      .select('metadata')
      .eq('id', promptId)
      .single();

    const currentMetadata = (current?.metadata || {}) as Record<string, unknown>;
    updateData.metadata = {
      ...currentMetadata,
      ...(data.promptText !== undefined && { prompt_text: data.promptText }),
      ...(data.variables !== undefined && { variables: data.variables }),
    };
  }

  const { error } = await supabase
    .from('contents')
    .update(updateData)
    .eq('id', promptId);

  if (error) {
    console.error('Error updating prompt:', error);
    return false;
  }

  // Update tags if provided
  if (data.tags !== undefined) {
    // Remove existing tags
    await supabase.from('content_tags').delete().eq('content_id', promptId);

    // Add new tags
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
          .insert({ name: tagName, tag_category: 'prompt' })
          .select('id')
          .single();
        tagId = newTag?.id;
      }

      // Link tag to content
      if (tagId) {
        await supabase
          .from('content_tags')
          .insert({ content_id: promptId, tag_id: tagId });
      }
    }
  }

  return true;
}
