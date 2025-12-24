import { createClient } from '@/lib/supabase';
import { NewsItem, NewsWithAuthor, NewsCategory, transformNewsRow } from '@/types/news';

export type SortOption = 'hot' | 'new' | 'top';

interface GetNewsOptions {
  sortBy?: SortOption;
  category?: NewsCategory | 'all';
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

// Fetch news from Supabase
export async function getNews(options: GetNewsOptions = {}): Promise<NewsItem[]> {
  const {
    sortBy = 'new',
    category = 'all',
    searchQuery = '',
    limit = 20,
    offset = 0,
  } = options;

  const supabase = createClient();

  // Build query
  let query = supabase
    .from('contents')
    .select(`
      *,
      author:profiles!contents_author_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('type', 'news')
    .eq('content_status', 'published');

  // Filter by category
  if (category !== 'all') {
    query = query.eq('metadata->>category', category);
  }

  // Search in title and body
  if (searchQuery.trim()) {
    query = query.or(`title.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%`);
  }

  // Sorting
  switch (sortBy) {
    case 'hot':
      // Sort by view count (인기)
      query = query.order('view_count', { ascending: false });
      break;
    case 'top':
      // Sort by upvote count (추천)
      query = query.order('upvote_count', { ascending: false });
      break;
    case 'new':
    default:
      // Sort by created date (최신)
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  // Transform to frontend type
  return (data as NewsWithAuthor[]).map(transformNewsRow);
}

// Get total count of news for pagination
export async function getNewsCount(options: Pick<GetNewsOptions, 'category' | 'searchQuery'> = {}): Promise<number> {
  const { category = 'all', searchQuery = '' } = options;

  const supabase = createClient();

  let query = supabase
    .from('contents')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'news')
    .eq('content_status', 'published');

  if (category !== 'all') {
    query = query.eq('metadata->>category', category);
  }

  if (searchQuery.trim()) {
    query = query.or(`title.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%`);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error counting news:', error);
    return 0;
  }

  return count || 0;
}

// Get popular news (for sidebar)
export async function getPopularNews(limit: number = 5): Promise<NewsItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:profiles!contents_author_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('type', 'news')
    .eq('content_status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular news:', error);
    return [];
  }

  return (data as NewsWithAuthor[]).map(transformNewsRow);
}

// Increment view count
export async function incrementViewCount(newsId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('increment_view_count', {
    target_content_id: newsId
  });

  if (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }

  return data?.counted ?? false;
}

// Check if user has bookmarked news
export async function isBookmarked(userId: string, newsId: string): Promise<boolean> {
  const supabase = createClient();

  const { data } = await supabase
    .from('bookmarks')
    .select('user_id')
    .eq('user_id', userId)
    .eq('content_id', newsId)
    .maybeSingle();

  return !!data;
}

// Toggle bookmark using RPC
export async function toggleBookmark(newsId: string): Promise<{ action: 'added' | 'removed' }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('toggle_bookmark', {
    target_content_id: newsId,
  });

  if (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }

  return {
    action: data?.action || 'added',
  };
}

// Get user's bookmarked news IDs
export async function getUserBookmarks(userId: string): Promise<Set<string>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .select('content_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return new Set();
  }

  return new Set(data.map((b) => b.content_id));
}

// Get single news by ID
export async function getNewsById(newsId: string): Promise<NewsItem | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:profiles!contents_author_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('id', newsId)
    .eq('type', 'news')
    .single();

  if (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }

  return transformNewsRow(data as NewsWithAuthor);
}

// Create news (admin only)
export interface CreateNewsInput {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: NewsCategory;
  authorId: string;
}

export async function createNews(input: CreateNewsInput): Promise<{ id: string } | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contents')
    .insert({
      author_id: input.authorId,
      type: 'news',
      title: input.title,
      body: input.summary,
      content_status: 'published',
      metadata: {
        source: input.source,
        source_url: input.sourceUrl,
        category: input.category,
      },
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating news:', error);
    return null;
  }

  return { id: data.id };
}

// Update news (admin only)
export async function updateNews(newsId: string, input: CreateNewsInput): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('contents')
    .update({
      title: input.title,
      body: input.summary,
      metadata: {
        source: input.source,
        source_url: input.sourceUrl,
        category: input.category,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', newsId)
    .eq('type', 'news');

  if (error) {
    console.error('Error updating news:', error);
    return false;
  }

  return true;
}

// Delete news (admin only)
export async function deleteNews(newsId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', newsId)
    .eq('type', 'news');

  if (error) {
    console.error('Error deleting news:', error);
    return false;
  }

  return true;
}
