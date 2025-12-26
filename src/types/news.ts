// News types based on Supabase contents table schema

export type NewsCategory = 'AI' | '개발' | '스타트업' | '트렌드' | '튜토리얼';

export type ContentStatus = 'draft' | 'pending' | 'published' | 'archived';

// Database row type matching contents table
export interface NewsRow {
  id: string; // uuid
  author_id: string | null; // uuid
  type: 'news'; // content type
  title: string;
  body: string | null; // summary/content
  metadata: {
    source?: string;
    source_url?: string;
    category?: NewsCategory;
    image_url?: string;
  } | null;
  view_count: number;
  created_at: string; // timestamp
  content_status: ContentStatus;
  upvote_count: number;
  downvote_count: number;
}

// Joined type with author profile
export interface NewsWithAuthor extends NewsRow {
  author: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  } | null;
  comment_count?: number;
  tags?: string[];
}

// Frontend display type
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: NewsCategory;
  createdAt: Date;
  viewCount: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  imageUrl?: string;
  author?: {
    id: string;
    nickname: string;
    avatarUrl: string | null;
  };
  status: ContentStatus;
}

// Transform database row to frontend type
export function transformNewsRow(row: NewsWithAuthor): NewsItem {
  return {
    id: row.id,
    title: row.title,
    summary: row.body || '',
    source: row.metadata?.source || 'Unknown',
    sourceUrl: row.metadata?.source_url || '#',
    category: row.metadata?.category || 'AI',
    createdAt: new Date(row.created_at),
    viewCount: row.view_count,
    upvoteCount: row.upvote_count,
    downvoteCount: row.downvote_count,
    commentCount: row.comment_count || 0,
    imageUrl: row.metadata?.image_url,
    author: row.author ? {
      id: row.author.id,
      nickname: row.author.nickname,
      avatarUrl: row.author.avatar_url,
    } : undefined,
    status: row.content_status,
  };
}

export const categoryColors: Record<NewsCategory | 'all', string> = {
  'all': '#ff6b35',
  'AI': '#8b5cf6',
  '개발': '#3b82f6',
  '스타트업': '#10b981',
  '트렌드': '#f59e0b',
  '튜토리얼': '#ec4899',
};

export const categoryIcons: Record<NewsCategory | 'all', string> = {
  'all': '🏠',
  'AI': '🤖',
  '개발': '💻',
  '스타트업': '🚀',
  '트렌드': '📈',
  '튜토리얼': '📚',
};
