// Database types matching new Supabase schema

// Content type enum (matches USER-DEFINED type in database)
export type ContentType = 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post';

// App role enum
export type AppRole = 'user' | 'admin' | 'moderator';

// Profile (user) table
export interface Profile {
  id: string;
  email: string | null;
  nickname: string;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
}

// Tag table
export interface Tag {
  id: number;
  name: string;
}

// Content metadata structure (stored as JSONB)
export interface ContentMetadata {
  // Common fields
  subtitle?: string;
  subtitle_en?: string;
  icon?: string;
  is_pinned?: boolean;

  // For skills
  download_url?: string;
  license_type?: string;
  github_url?: string;
  owner_id?: string;
  what_is?: string;
  how_to_use?: string;
  key_features?: string[];

  // For MCP servers
  install_command?: string;
  documentation_url?: string;

  // For prompts
  prompt_text?: string;
  variables?: string[];

  // For AI tools
  tool_url?: string;
  pricing?: string;

  // For posts
  post_category?: 'general' | 'question';

  // Legacy support
  category_name_ko?: string;
  category_name_en?: string;
}

// Content table (main content - skills, mcp, prompts, ai_tools, posts)
export interface Content {
  id: string;
  author_id: string | null;
  type: ContentType;
  title: string;
  body: string | null;
  metadata: ContentMetadata | null;
  view_count: number;
  is_public: boolean;
  created_at: string | null;
}

// Content with related data
export interface ContentWithRelations extends Content {
  author: Profile | null;
  tags: Tag[];
  likes_count: number;
  reviews_count: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

// Review table
export interface Review {
  id: string;
  content_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string | null;
}

// Review with user
export interface ReviewWithUser extends Review {
  user: Profile | null;
  reply?: ReviewReply | null;
}

// Review reply table
export interface ReviewReply {
  id: string;
  content: string;
  created_at: string | null;
}

// Content like table
export interface ContentLike {
  user_id: string;
  content_id: string;
  created_at: string | null;
}

// Bookmark table
export interface Bookmark {
  user_id: string;
  content_id: string;
  created_at: string | null;
}

// Content tag junction table
export interface ContentTag {
  content_id: string;
  tag_id: number;
}

// Profile interest junction table
export interface ProfileInterest {
  user_id: string;
  tag_id: number;
  created_at: string | null;
}

// ============================================
// Legacy type aliases for backward compatibility
// ============================================

// Map old Skill type to Content
export interface Skill {
  id: string;
  title_ko: string;
  title_en: string | null;
  sub_title_ko: string | null;
  sub_title_en: string | null;
  icon: string | null;
  comments_count: number;
  views_count: number;
  likes_count: number;
  download_url: string | null;
  tags: string | null;
  categories: string;
}

// Map old Category type to Tag
export interface Category {
  id: string;
  icon: string | null;
  category_name_ko: string | null;
  category_name_en: string | null;
}

export interface SkillWithCategory extends Skill {
  category: Category | null;
}

// Old Comment type
export interface Comment {
  id: string;
  rating: number;
  comment_text: string | null;
  created_at: string | null;
  users: string | null;
  skills: string | null;
}

export interface CommentWithUser extends Comment {
  user: Profile | null;
}

// Old License type
export interface License {
  id: string;
  license_type: string;
  github_url: string | null;
  owner_id: string | null;
  skills: string | null;
}

// Old Like type
export interface Like {
  id: string;
  created_at: string;
  users: string | null;
  skills: string | null;
}

// Old Content type (for skill details)
export interface LegacyContent {
  id: string;
  content_type: string;
  content_text: string | null;
  skills: string | null;
}

// ============================================
// Utility functions
// ============================================

// Get localized value (Korean preferred)
export function getLocalizedValue(
  koValue: string | null | undefined,
  enValue: string | null | undefined,
  language: 'ko' | 'en'
): string {
  if (language === 'ko') {
    return koValue || enValue || '';
  }
  return enValue || koValue || '';
}

// Parse tags string to array
export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags.split(',').map(tag => tag.trim()).filter(Boolean);
}

// Convert Content to legacy Skill format
export function contentToSkill(content: ContentWithRelations): SkillWithCategory {
  const metadata = content.metadata || {};
  const primaryTag = content.tags[0];

  return {
    id: content.id,
    title_ko: content.title,
    title_en: metadata.subtitle_en || content.title,
    sub_title_ko: metadata.subtitle || content.body?.substring(0, 200) || null,
    sub_title_en: metadata.subtitle_en || null,
    icon: metadata.icon || null,
    comments_count: content.reviews_count,
    views_count: content.view_count,
    likes_count: content.likes_count,
    download_url: metadata.download_url || null,
    tags: content.tags.map(t => t.name).join(','),
    categories: primaryTag?.id.toString() || '',
    category: primaryTag ? {
      id: primaryTag.id.toString(),
      icon: null,
      category_name_ko: primaryTag.name,
      category_name_en: primaryTag.name,
    } : null,
  };
}

// Convert Content to legacy License format
export function contentToLicense(content: Content): License | null {
  const metadata = content.metadata;
  if (!metadata?.license_type) return null;

  return {
    id: `${content.id}-license`,
    license_type: metadata.license_type,
    github_url: metadata.github_url || null,
    owner_id: metadata.owner_id || null,
    skills: content.id,
  };
}

// Convert Content metadata to legacy Content array
export function contentToLegacyContents(content: Content): LegacyContent[] {
  const metadata = content.metadata || {};
  const result: LegacyContent[] = [];

  if (metadata.what_is) {
    result.push({
      id: `${content.id}-what-is`,
      content_type: 'what_is',
      content_text: metadata.what_is,
      skills: content.id,
    });
  }

  if (metadata.how_to_use) {
    result.push({
      id: `${content.id}-how-to-use`,
      content_type: 'how_to_use',
      content_text: metadata.how_to_use,
      skills: content.id,
    });
  }

  if (metadata.key_features && metadata.key_features.length > 0) {
    result.push({
      id: `${content.id}-key-features`,
      content_type: 'key_features',
      content_text: metadata.key_features.join('\n'),
      skills: content.id,
    });
  }

  return result;
}
