// Main categories for community posts
export type MainCategory = 'AI 개발사' | '코딩 툴' | 'LLM 서비스' | '분야';

// Sub-categories for each main category
export type AICompanyTag = 'Google' | 'Anthropic' | 'Microsoft' | 'OpenAI' | 'Meta' | '오픈소스';
export type CodingToolTag = 'Cursor' | 'Claude Code' | 'Windsurf' | 'Copilot' | 'Antigravity' | 'Replit' | 'v0';
export type LLMServiceTag = 'ChatGPT' | 'Claude' | 'Gemini' | 'Copilot' | 'Perplexity' | 'Grok';
export type FieldTag = 'PDF' | '이미지 생성' | '생산성' | '영상' | '음악' | '자동화' | '검색' | '기타';

export type SubCategoryTag = AICompanyTag | CodingToolTag | LLMServiceTag | FieldTag;

// Legacy category type for backward compatibility
export type PostCategory = '스킬' | 'MCP' | '프롬프트' | 'AI 코딩 툴' | '커뮤니티' | '질문';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
  };
  category: PostCategory; // Legacy, kept for backward compatibility
  mainCategory?: MainCategory; // New hierarchical category
  subCategoryTag?: SubCategoryTag; // New sub-category tag
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount?: number;
  tags?: string[];
  isPinned?: boolean;
}

export type SortOption = 'hot' | 'new' | 'top';

// Main category configuration
export const mainCategoryConfig: Record<MainCategory, {
  color: string;
  icon: string;
  subCategories: SubCategoryTag[];
}> = {
  'AI 개발사': {
    color: '#8b5cf6',
    icon: '🏢',
    subCategories: ['Google', 'Anthropic', 'Microsoft', 'OpenAI', 'Meta', '오픈소스'],
  },
  '코딩 툴': {
    color: '#10b981',
    icon: '🛠️',
    subCategories: ['Cursor', 'Claude Code', 'Windsurf', 'Copilot', 'Antigravity', 'Replit', 'v0'],
  },
  'LLM 서비스': {
    color: '#3b82f6',
    icon: '🤖',
    subCategories: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity', 'Grok'],
  },
  '분야': {
    color: '#f59e0b',
    icon: '📂',
    subCategories: ['PDF', '이미지 생성', '생산성', '영상', '음악', '자동화', '검색', '기타'],
  },
};

// Sub-category colors
export const subCategoryColors: Record<SubCategoryTag, string> = {
  // AI Companies
  'Google': '#4285f4',
  'Anthropic': '#d4a574',
  'Microsoft': '#00a4ef',
  'OpenAI': '#412991',
  'Meta': '#0668e1',
  '오픈소스': '#f05032',
  // Coding Tools
  'Cursor': '#00d4aa',
  'Claude Code': '#d4a574',
  'Windsurf': '#6366f1',
  'Copilot': '#000000',
  'Antigravity': '#ff6b35',
  'Replit': '#f26207',
  'v0': '#000000',
  // LLM Services
  'ChatGPT': '#10a37f',
  'Claude': '#d4a574',
  'Gemini': '#8e44ad',
  'Perplexity': '#20808d',
  'Grok': '#000000',
  // Fields
  'PDF': '#ff4444',
  '이미지 생성': '#e91e63',
  '생산성': '#4caf50',
  '영상': '#ff5722',
  '음악': '#9c27b0',
  '자동화': '#2196f3',
  '검색': '#ff9800',
  '기타': '#607d8b',
};

// Legacy category colors (kept for backward compatibility)
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
