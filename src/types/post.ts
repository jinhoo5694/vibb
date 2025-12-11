export type PostCategory = '스킬' | 'MCP' | '프롬프트' | 'AI 코딩 툴' | '커뮤니티' | '질문';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: PostCategory;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount?: number;
  tags?: string[];
  isPinned?: boolean;
}

export type SortOption = 'hot' | 'new' | 'top';

export const categoryColors: Record<PostCategory, string> = {
  '스킬': '#ff6b35',
  'MCP': '#3b82f6',
  '프롬프트': '#f59e0b',
  'AI 코딩 툴': '#10b981',
  '커뮤니티': '#8b5cf6',
  '질문': '#ec4899',
};

export const categoryIcons: Record<PostCategory, string> = {
  '스킬': '🎯',
  'MCP': '🔌',
  '프롬프트': '💬',
  'AI 코딩 툴': '🛠️',
  '커뮤니티': '📝',
  '질문': '❓',
};
