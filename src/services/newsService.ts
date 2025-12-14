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
export async function incrementViewCount(newsId: string): Promise<void> {
  const supabase = createClient();

  await supabase.rpc('increment_view_count', { content_id: newsId });
}

// Check if user has bookmarked news
export async function isBookmarked(userId: string, newsId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .select('user_id')
    .eq('user_id', userId)
    .eq('content_id', newsId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

// Toggle bookmark
export async function toggleBookmark(userId: string, newsId: string): Promise<boolean> {
  const supabase = createClient();

  const bookmarked = await isBookmarked(userId, newsId);

  if (bookmarked) {
    // Remove bookmark
    await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', newsId);
    return false;
  } else {
    // Add bookmark
    await supabase
      .from('bookmarks')
      .insert({ user_id: userId, content_id: newsId });
    return true;
  }
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
