// Plugin service for Claude Marketplace

import { supabase } from './client';
import { Content, Tag, Profile } from '@/types/database';
import {
  PluginWithCategory,
  PluginContent,
  PluginLicense,
  contentToPlugin,
  contentToPluginContents,
  contentToPluginLicense,
} from '@/types/plugin';
import { isDebugMode } from '@/lib/debug';

// Type definitions for Supabase query results
interface ContentTagRow {
  tag_id: number;
  content_id?: string;
}

interface ReviewCountRow {
  count: number;
}

// Mock data for debug mode - Official Claude Code Plugins from anthropics/claude-code
const mockPlugins: PluginWithCategory[] = [
  // Core Development Plugins
  {
    id: 'code-review',
    title: 'Code Review',
    subtitle: '5개의 병렬 에이전트를 활용한 자동화된 PR 코드 리뷰',
    subtitle_en: 'Automated PR code review with 5 parallel agents for compliance, bugs, context, history, and comments',
    icon: '🔍',
    body: 'PR(Pull Request)을 자동으로 리뷰하는 플러그인입니다. 5개의 전문 에이전트가 병렬로 동작하여 규정 준수, 버그, 컨텍스트, 히스토리, 코멘트를 분석합니다.',
    view_count: 3250,
    upvote_count: 289,
    downvote_count: 5,
    comments_count: 42,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/code-review',
    install_command: '/plugin install code-review',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Development,Code Review,Automation',
    category: 'Development',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'feature-dev',
    title: 'Feature Development',
    subtitle: '7단계 기능 개발 워크플로우 자동화',
    subtitle_en: '7-phase feature development workflow with code explorer, architect, and reviewer agents',
    icon: '🚀',
    body: '기능 개발을 위한 7단계 워크플로우를 제공합니다. 코드 탐색기, 설계자, 리뷰어 에이전트가 협력하여 체계적인 개발을 지원합니다.',
    view_count: 2890,
    upvote_count: 234,
    downvote_count: 3,
    comments_count: 38,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/feature-dev',
    install_command: '/plugin install feature-dev',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Development,Workflow,Feature',
    category: 'Development',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'plugin-dev',
    title: 'Plugin Development',
    subtitle: '7가지 전문 스킬을 갖춘 플러그인 개발 도구',
    subtitle_en: 'Plugin development toolkit with 7 expert skills and /plugin-dev:create-plugin command',
    icon: '🔌',
    body: 'Claude Code 플러그인을 개발하기 위한 종합 도구입니다. /plugin-dev:create-plugin 명령어와 7가지 전문 스킬을 제공합니다.',
    view_count: 1980,
    upvote_count: 178,
    downvote_count: 2,
    comments_count: 25,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/plugin-dev',
    install_command: '/plugin install plugin-dev',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Development,Plugin,Tools',
    category: 'Development',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'commit-commands',
    title: 'Commit Commands',
    subtitle: 'Git 워크플로우 자동화 명령어',
    subtitle_en: 'Git workflow automation with /commit, /commit-push-pr, /clean_gone commands',
    icon: '📦',
    body: 'Git 작업을 자동화하는 플러그인입니다. /commit, /commit-push-pr, /clean_gone 등의 명령어를 제공합니다.',
    view_count: 2450,
    upvote_count: 198,
    downvote_count: 4,
    comments_count: 31,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/commit-commands',
    install_command: '/plugin install commit-commands',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Git,Automation,Workflow',
    category: 'Automation',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'frontend-design',
    title: 'Frontend Design',
    subtitle: '프로덕션급 프론트엔드 인터페이스 디자인 가이드',
    subtitle_en: 'Production-grade frontend interface design guidance for bold and modern UI components',
    icon: '🎨',
    body: '현대적이고 세련된 UI 컴포넌트를 위한 프론트엔드 디자인 가이드라인을 제공합니다.',
    view_count: 1650,
    upvote_count: 145,
    downvote_count: 2,
    comments_count: 18,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/frontend-design',
    install_command: '/plugin install frontend-design',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Design,Frontend,UI',
    category: 'Design',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'agent-sdk-dev',
    title: 'Agent SDK Development',
    subtitle: 'Claude Agent SDK 개발 도구',
    subtitle_en: 'Development kit for Claude Agent SDK with /new-sdk-app command and verifiers',
    icon: '🤖',
    body: 'Claude Agent SDK 프로젝트를 위한 개발 도구입니다. /new-sdk-app 명령어로 인터랙티브 설정과 Python & TypeScript 검증 도구를 제공합니다.',
    view_count: 1420,
    upvote_count: 134,
    downvote_count: 1,
    comments_count: 22,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/agent-sdk-dev',
    install_command: '/plugin install agent-sdk-dev',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'SDK,Agent,Development',
    category: 'Development',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'security-guidance',
    title: 'Security Guidance',
    subtitle: '9가지 보안 패턴 모니터링',
    subtitle_en: 'Automated security monitoring with 9 security patterns and PreToolUse hook integration',
    icon: '🔒',
    body: '보안 취약점과 안전하지 않은 패턴에 대해 경고하는 플러그인입니다. 9가지 보안 패턴을 모니터링하고 PreToolUse 훅과 통합됩니다.',
    view_count: 1890,
    upvote_count: 167,
    downvote_count: 2,
    comments_count: 28,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/security-guidance',
    install_command: '/plugin install security-guidance',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Security,Safety,Monitoring',
    category: 'Security',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'pr-review-toolkit',
    title: 'PR Review Toolkit',
    subtitle: '6개의 전문화된 에이전트를 활용한 PR 리뷰',
    subtitle_en: 'Specialized PR review with 6 agents and /pr-review-toolkit:review-pr command',
    icon: '📋',
    body: 'PR 리뷰를 위한 전문 도구입니다. /pr-review-toolkit:review-pr 명령어와 6개의 전문화된 에이전트를 제공합니다.',
    view_count: 1560,
    upvote_count: 143,
    downvote_count: 1,
    comments_count: 19,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/pr-review-toolkit',
    install_command: '/plugin install pr-review-toolkit',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'PR,Review,Agents',
    category: 'Development',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  // LSP Plugins
  {
    id: 'typescript-lsp',
    title: 'TypeScript Language Server',
    subtitle: 'TypeScript/JavaScript 시맨틱 분석',
    subtitle_en: 'TypeScript/JavaScript semantic analysis with definition lookup, references, and rename',
    icon: '📘',
    body: 'TypeScript와 JavaScript를 위한 언어 서버입니다. 정의 바로가기, 참조 찾기, 심볼 이름 변경 기능을 제공합니다.',
    view_count: 2780,
    upvote_count: 245,
    downvote_count: 3,
    comments_count: 35,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/typescript-lsp',
    install_command: '/plugin install typescript-lsp',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'LSP,TypeScript,JavaScript',
    category: 'LSP',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'pyright-lsp',
    title: 'Python Language Server',
    subtitle: 'Python 실시간 진단 및 코드 완성',
    subtitle_en: 'Python semantic analysis with real-time diagnostics and code completion',
    icon: '🐍',
    body: 'Python을 위한 언어 서버입니다. Pyright 기반으로 실시간 진단과 코드 완성 기능을 제공합니다.',
    view_count: 2450,
    upvote_count: 212,
    downvote_count: 2,
    comments_count: 29,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/pyright-lsp',
    install_command: '/plugin install pyright-lsp',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'LSP,Python',
    category: 'LSP',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'rust-analyzer-lsp',
    title: 'Rust Language Server',
    subtitle: 'Rust 시맨틱 분석 및 리팩토링',
    subtitle_en: 'Rust semantic analysis with code navigation and refactoring capabilities',
    icon: '🦀',
    body: 'Rust를 위한 언어 서버입니다. rust-analyzer 기반으로 시맨틱 분석과 코드 탐색, 리팩토링 기능을 제공합니다.',
    view_count: 1890,
    upvote_count: 178,
    downvote_count: 1,
    comments_count: 24,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/rust-analyzer-lsp',
    install_command: '/plugin install rust-analyzer-lsp',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'LSP,Rust',
    category: 'LSP',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'gopls-lsp',
    title: 'Go Language Server',
    subtitle: 'Go 언어 시맨틱 분석',
    subtitle_en: 'Go language semantics with gopls integration',
    icon: '🐹',
    body: 'Go 언어를 위한 언어 서버입니다. gopls 기반으로 Go 코드의 시맨틱 분석을 제공합니다.',
    view_count: 1560,
    upvote_count: 145,
    downvote_count: 1,
    comments_count: 18,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/gopls-lsp',
    install_command: '/plugin install gopls-lsp',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'LSP,Go',
    category: 'LSP',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  // Enhancement Plugins
  {
    id: 'hookify',
    title: 'Hookify',
    subtitle: '커스텀 훅 생성 및 관리',
    subtitle_en: 'Create custom hooks for behavior control with /hookify commands',
    icon: '🪝',
    body: 'Claude Code의 동작을 제어하는 커스텀 훅을 생성하고 관리하는 플러그인입니다.',
    view_count: 1230,
    upvote_count: 112,
    downvote_count: 2,
    comments_count: 15,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/hookify',
    install_command: '/plugin install hookify',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Hooks,Customization',
    category: 'Utility',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'explanatory-output-style',
    title: 'Explanatory Output Style',
    subtitle: '코드 선택에 대한 교육적 인사이트',
    subtitle_en: 'Educational insights about code choices with SessionStart hook',
    icon: '📚',
    body: '코드 작성 시 왜 그런 선택을 했는지에 대한 교육적 설명을 제공하는 플러그인입니다.',
    view_count: 980,
    upvote_count: 89,
    downvote_count: 1,
    comments_count: 12,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/explanatory-output-style',
    install_command: '/plugin install explanatory-output-style',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Education,Style',
    category: 'Utility',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
  {
    id: 'learning-output-style',
    title: 'Learning Output Style',
    subtitle: '인터랙티브 학습 모드',
    subtitle_en: 'Interactive learning mode with SessionStart hook for learning insights',
    icon: '🎓',
    body: '코드 작성 중 학습 인사이트를 제공하는 인터랙티브 학습 모드 플러그인입니다.',
    view_count: 890,
    upvote_count: 78,
    downvote_count: 1,
    comments_count: 10,
    github_url: 'https://github.com/anthropics/claude-code',
    license_type: 'MIT',
    download_url: null,
    documentation_url: 'https://docs.anthropic.com/claude-code/plugins/learning-output-style',
    install_command: '/plugin install learning-output-style',
    plugin_url: null,
    version: '1.0.0',
    author_name: 'Anthropic',
    compatibility: 'Claude Code',
    tags: 'Education,Learning',
    category: 'Utility',
    created_at: '2024-12-01T00:00:00Z',
    author: null,
  },
];

// Get all plugins
export async function getPlugins(): Promise<PluginWithCategory[]> {
  // Debug mode: return mock data
  if (isDebugMode()) {
    console.log('[DEBUG] getPlugins: Returning mock data');
    return mockPlugins;
  }

  try {
    // Fetch plugins with tags and review counts
    const { data: contents, error } = await supabase
      .from('contents')
      .select(`
        *,
        author:profiles!contents_author_id_fkey(id, nickname, avatar_url),
        content_tags(tag_id),
        reviews:reviews(count)
      `)
      .eq('type', 'plugin')
      .eq('status', 'published')
      .order('view_count', { ascending: false });

    if (error) {
      console.error('Error fetching plugins:', error);
      return [];
    }

    if (!contents || contents.length === 0) {
      return [];
    }

    // Get all tag IDs
    const tagIds = contents.flatMap(c =>
      (c.content_tags as { tag_id: number }[])?.map(ct => ct.tag_id) || []
    );

    // Fetch tags
    let tagsMap: Record<number, Tag> = {};
    if (tagIds.length > 0) {
      const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .in('id', [...new Set(tagIds)]);

      if (tags) {
        tagsMap = Object.fromEntries(tags.map(t => [t.id, t]));
      }
    }

    // Transform to PluginWithCategory
    return contents.map(content => {
      const contentTags = (content.content_tags as { tag_id: number }[])?.map(
        ct => tagsMap[ct.tag_id]
      ).filter(Boolean) as Tag[];

      const reviewsCount = Array.isArray(content.reviews)
        ? content.reviews[0]?.count || 0
        : 0;

      return contentToPlugin({
        ...content,
        author: content.author as Profile | null,
        tags: contentTags,
        reviews_count: reviewsCount,
      });
    });
  } catch (err) {
    console.error('Error in getPlugins:', err);
    return [];
  }
}

// Get single plugin by ID
export async function getPluginById(id: string): Promise<PluginWithCategory | null> {
  // Debug mode: return mock data
  if (isDebugMode()) {
    const plugin = mockPlugins.find(p => p.id === id);
    return plugin || mockPlugins[0];
  }

  try {
    const { data: content, error } = await supabase
      .from('contents')
      .select(`
        *,
        author:profiles!contents_author_id_fkey(id, nickname, avatar_url),
        content_tags(tag_id),
        reviews:reviews(count)
      `)
      .eq('id', id)
      .eq('type', 'plugin')
      .single();

    if (error || !content) {
      console.error('Error fetching plugin:', error);
      return null;
    }

    // Fetch tags
    const tagIds = (content.content_tags as { tag_id: number }[])?.map(ct => ct.tag_id) || [];
    let tags: Tag[] = [];

    if (tagIds.length > 0) {
      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .in('id', tagIds);

      tags = tagsData || [];
    }

    const reviewsCount = Array.isArray(content.reviews)
      ? content.reviews[0]?.count || 0
      : 0;

    return contentToPlugin({
      ...content,
      author: content.author as Profile | null,
      tags,
      reviews_count: reviewsCount,
    });
  } catch (err) {
    console.error('Error in getPluginById:', err);
    return null;
  }
}

// Search plugins
export async function searchPlugins(query: string): Promise<PluginWithCategory[]> {
  if (isDebugMode()) {
    const lowerQuery = query.toLowerCase();
    return mockPlugins.filter(
      p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.subtitle?.toLowerCase().includes(lowerQuery) ||
        p.body?.toLowerCase().includes(lowerQuery)
    );
  }

  try {
    const { data: contents, error } = await supabase
      .from('contents')
      .select(`
        *,
        author:profiles!contents_author_id_fkey(id, nickname, avatar_url),
        content_tags(tag_id),
        reviews:reviews(count)
      `)
      .eq('type', 'plugin')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching plugins:', error);
      return [];
    }

    if (!contents) return [];

    // Same tag fetching logic as getPlugins
    const tagIds = contents.flatMap(c =>
      (c.content_tags as { tag_id: number }[])?.map(ct => ct.tag_id) || []
    );

    let tagsMap: Record<number, Tag> = {};
    if (tagIds.length > 0) {
      const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .in('id', [...new Set(tagIds)]);

      if (tags) {
        tagsMap = Object.fromEntries(tags.map(t => [t.id, t]));
      }
    }

    return contents.map(content => {
      const contentTags = (content.content_tags as { tag_id: number }[])?.map(
        ct => tagsMap[ct.tag_id]
      ).filter(Boolean) as Tag[];

      const reviewsCount = Array.isArray(content.reviews)
        ? content.reviews[0]?.count || 0
        : 0;

      return contentToPlugin({
        ...content,
        author: content.author as Profile | null,
        tags: contentTags,
        reviews_count: reviewsCount,
      });
    });
  } catch (err) {
    console.error('Error in searchPlugins:', err);
    return [];
  }
}

// Get plugins by tag/category
export async function getPluginsByTag(tagId: number): Promise<PluginWithCategory[]> {
  if (isDebugMode()) {
    return mockPlugins;
  }

  try {
    // First get content IDs that have this tag
    const { data: contentTags, error: tagError } = await supabase
      .from('content_tags')
      .select('content_id')
      .eq('tag_id', tagId);

    if (tagError || !contentTags) return [];

    const contentIds = contentTags.map(ct => ct.content_id);
    if (contentIds.length === 0) return [];

    // Fetch the plugins
    const { data: contents, error } = await supabase
      .from('contents')
      .select(`
        *,
        author:profiles!contents_author_id_fkey(id, nickname, avatar_url),
        content_tags(tag_id),
        reviews:reviews(count)
      `)
      .eq('type', 'plugin')
      .eq('status', 'published')
      .in('id', contentIds)
      .order('view_count', { ascending: false });

    if (error || !contents) return [];

    // Fetch all tags for these contents
    const allTagIds = contents.flatMap(c =>
      (c.content_tags as { tag_id: number }[])?.map(ct => ct.tag_id) || []
    );

    let tagsMap: Record<number, Tag> = {};
    if (allTagIds.length > 0) {
      const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .in('id', [...new Set(allTagIds)]);

      if (tags) {
        tagsMap = Object.fromEntries(tags.map(t => [t.id, t]));
      }
    }

    return contents.map(content => {
      const contentTags = (content.content_tags as { tag_id: number }[])?.map(
        ct => tagsMap[ct.tag_id]
      ).filter(Boolean) as Tag[];

      const reviewsCount = Array.isArray(content.reviews)
        ? content.reviews[0]?.count || 0
        : 0;

      return contentToPlugin({
        ...content,
        author: content.author as Profile | null,
        tags: contentTags,
        reviews_count: reviewsCount,
      });
    });
  } catch (err) {
    console.error('Error in getPluginsByTag:', err);
    return [];
  }
}

// Get plugin content sections
export async function getPluginContents(pluginId: string): Promise<PluginContent[]> {
  if (isDebugMode()) {
    // Find the plugin to get its details for more relevant content
    const plugin = mockPlugins.find(p => p.id === pluginId);
    if (plugin) {
      return [
        {
          title: '소개',
          content: plugin.body || `${plugin.title}은(는) Claude Code를 위한 확장 플러그인입니다.`,
        },
        {
          title: '사용 방법',
          content: `1. 플러그인 설치: ${plugin.install_command || `/plugin install ${plugin.title.toLowerCase().replace(/\s+/g, '-')}`}\n2. 설치 완료 후 명령어 확인: /${plugin.title.toLowerCase().replace(/\s+/g, '-')}:help\n3. 필요한 명령어를 사용하여 작업 수행`,
        },
        {
          title: '주요 기능',
          content: plugin.subtitle || '이 플러그인의 주요 기능입니다.',
        },
      ];
    }
    return [
      { title: '소개', content: '이 플러그인에 대한 설명입니다.' },
      { title: '사용 방법', content: '1. 플러그인 설치\n2. 설정 구성\n3. 사용 시작!' },
      { title: '주요 기능', content: '• 기능 1\n• 기능 2\n• 기능 3' },
    ];
  }

  const { data: content, error } = await supabase
    .from('contents')
    .select('*')
    .eq('id', pluginId)
    .eq('type', 'plugin')
    .single();

  if (error || !content) {
    return [];
  }

  return contentToPluginContents(content);
}

// Get plugin license
export async function getPluginLicense(pluginId: string): Promise<PluginLicense | null> {
  if (isDebugMode()) {
    return { type: 'MIT', url: 'https://github.com/example/plugin' };
  }

  const { data: content, error } = await supabase
    .from('contents')
    .select('metadata')
    .eq('id', pluginId)
    .eq('type', 'plugin')
    .single();

  if (error || !content) {
    return null;
  }

  return contentToPluginLicense(content as Content);
}

// Increment view count
export async function incrementPluginViewCount(pluginId: string): Promise<void> {
  if (isDebugMode()) {
    console.log('[DEBUG] incrementPluginViewCount:', pluginId);
    return;
  }

  try {
    // Try RPC first
    const { error: rpcError } = await supabase.rpc('increment_view_count', {
      content_id: pluginId,
    });

    if (rpcError) {
      // Fallback to manual increment
      const { data: current } = await supabase
        .from('contents')
        .select('view_count')
        .eq('id', pluginId)
        .single();

      if (current) {
        await supabase
          .from('contents')
          .update({ view_count: (current.view_count || 0) + 1 })
          .eq('id', pluginId);
      }
    }
  } catch (err) {
    console.error('Error incrementing view count:', err);
  }
}

// Get average rating for plugin
export async function getPluginAverageRating(pluginId: string): Promise<number> {
  if (isDebugMode()) {
    return 4.5;
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('content_id', pluginId);

  if (error || !data || data.length === 0) {
    return 0;
  }

  const sum = data.reduce((acc, review) => acc + (review.rating || 0), 0);
  return sum / data.length;
}

// Re-export voting and bookmark functions from skills.ts (they work with any content)
export { toggleVote, getUserVote, toggleBookmark, hasUserBookmarked } from './skills';
