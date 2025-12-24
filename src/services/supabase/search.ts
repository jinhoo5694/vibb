import { supabase } from './client';
import { ContentType, ContentWithRelations, Tag, Profile } from '@/types/database';
import { Post, PostCategory } from '@/types/post';
import { samplePosts } from '@/data/posts';

// Search result type
export interface SearchResult {
  id: string;
  type: 'skill' | 'mcp' | 'prompt' | 'ai_tool' | 'post' | 'plugin';
  title: string;
  description: string;
  category: string;
  icon: string;
  href: string;
  viewCount: number;
  likesCount: number;
}

// Map content type to display info
const contentTypeInfo: Record<ContentType, { label: string; labelEn: string; icon: string; basePath: string }> = {
  skill: { label: '스킬', labelEn: 'Skill', icon: '🎯', basePath: '/skills/skill' },
  mcp: { label: 'MCP', labelEn: 'MCP', icon: '🔌', basePath: '/board' },
  prompt: { label: '프롬프트', labelEn: 'Prompt', icon: '💬', basePath: '/board' },
  ai_tool: { label: 'AI 코딩 툴', labelEn: 'AI Coding Tool', icon: '🛠️', basePath: '/board' },
  post: { label: '게시글', labelEn: 'Post', icon: '📝', basePath: '/board' },
  plugin: { label: '플러그인', labelEn: 'Plugin', icon: '🧩', basePath: '/marketplace' },
};

// Search all content types
export async function searchAll(query: string, language: 'ko' | 'en' = 'ko'): Promise<SearchResult[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  try {
    // Search in database
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
      .eq('is_public', true)
      .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching:', error);
      // Fall back to sample data search
      return searchSampleData(query, language);
    }

    if (!contents || contents.length === 0) {
      // Fall back to sample data search
      return searchSampleData(query, language);
    }

    // Get likes count for each content
    const contentIds = contents.map(c => c.id);
    const { data: likesData } = await supabase
      .from('content_likes')
      .select('content_id')
      .in('content_id', contentIds);

    const likesCountMap: Record<string, number> = {};
    likesData?.forEach(like => {
      likesCountMap[like.content_id] = (likesCountMap[like.content_id] || 0) + 1;
    });

    // Transform to search results
    const results: SearchResult[] = contents.map(content => {
      const typeInfo = contentTypeInfo[content.type as ContentType];
      const metadata = content.metadata || {};

      // Determine the href based on content type
      let href = `/board/${content.id}`;
      if (content.type === 'skill') {
        href = `/skills/skill/${content.id}`;
      } else if (content.type === 'plugin') {
        href = `/marketplace/plugin/${content.id}`;
      }

      return {
        id: content.id,
        type: content.type as SearchResult['type'],
        title: content.title,
        description: content.body?.substring(0, 100) || metadata.subtitle || '',
        category: language === 'ko' ? typeInfo.label : typeInfo.labelEn,
        icon: metadata.icon || typeInfo.icon,
        href,
        viewCount: content.view_count || 0,
        likesCount: likesCountMap[content.id] || 0,
      };
    });

    return results;
  } catch (err) {
    console.error('Search error:', err);
    return searchSampleData(query, language);
  }
}

// Search in sample data (fallback)
function searchSampleData(query: string, language: 'ko' | 'en'): SearchResult[] {
  const lowerQuery = query.toLowerCase();

  const matchingPosts = samplePosts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );

  // Map PostCategory to content type
  const categoryToType: Record<PostCategory, SearchResult['type']> = {
    '스킬': 'skill',
    'MCP': 'mcp',
    '프롬프트': 'prompt',
    'AI 코딩 툴': 'ai_tool',
    '커뮤니티': 'post',
    '질문': 'post',
  };

  const categoryIcons: Record<PostCategory, string> = {
    '스킬': '🎯',
    'MCP': '🔌',
    '프롬프트': '💬',
    'AI 코딩 툴': '🛠️',
    '커뮤니티': '📝',
    '질문': '❓',
  };

  return matchingPosts.slice(0, 20).map(post => ({
    id: post.id,
    type: categoryToType[post.category] || 'post',
    title: post.title,
    description: post.content.substring(0, 100),
    category: post.category,
    icon: categoryIcons[post.category] || '📝',
    href: `/board/${post.id}`,
    viewCount: 0,
    likesCount: post.upvotes,
  }));
}

// Quick search for autocomplete (lighter query)
export async function quickSearch(query: string, language: 'ko' | 'en' = 'ko'): Promise<SearchResult[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  // First try sample data for instant results
  const sampleResults = searchSampleData(query, language).slice(0, 8);

  // Then try database
  try {
    const { data: contents, error } = await supabase
      .from('contents')
      .select('id, type, title, body, metadata, view_count')
      .eq('is_public', true)
      .or(`title.ilike.%${query}%`)
      .order('view_count', { ascending: false })
      .limit(8);

    if (!error && contents && contents.length > 0) {
      const dbResults: SearchResult[] = contents.map(content => {
        const typeInfo = contentTypeInfo[content.type as ContentType];
        const metadata = content.metadata || {};

        let href = `/board/${content.id}`;
        if (content.type === 'skill') {
          href = `/skills/skill/${content.id}`;
        } else if (content.type === 'plugin') {
          href = `/marketplace/plugin/${content.id}`;
        }

        return {
          id: content.id,
          type: content.type as SearchResult['type'],
          title: content.title,
          description: content.body?.substring(0, 80) || metadata.subtitle || '',
          category: language === 'ko' ? typeInfo.label : typeInfo.labelEn,
          icon: metadata.icon || typeInfo.icon,
          href,
          viewCount: content.view_count || 0,
          likesCount: 0,
        };
      });

      // Combine and deduplicate
      const allResults = [...dbResults, ...sampleResults];
      const uniqueResults = allResults.filter((result, index, self) =>
        index === self.findIndex(r => r.id === result.id)
      );

      return uniqueResults.slice(0, 10);
    }
  } catch (err) {
    console.error('Quick search error:', err);
  }

  return sampleResults;
}
