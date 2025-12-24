// Plugin types for Claude Marketplace

import { Content, Tag, Profile } from './database';

// Plugin with category/tag info (similar to SkillWithCategory)
export interface PluginWithCategory {
  id: string;
  title: string;
  subtitle: string | null;
  subtitle_en: string | null;
  icon: string | null;
  body: string | null;
  view_count: number;
  upvote_count: number;
  downvote_count: number;
  comments_count: number;
  github_url: string | null;
  license_type: string | null;
  download_url: string | null;
  documentation_url: string | null;
  install_command: string | null;
  plugin_url: string | null;
  version: string | null;
  author_name: string | null;
  compatibility: string | null;
  tags: string | null;
  category: string | null;
  created_at: string | null;
  author?: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  } | null;
}

// Plugin content sections (for detail page)
export interface PluginContent {
  title: string;
  content: string;
}

// Plugin license info
export interface PluginLicense {
  type: string;
  url?: string;
}

// Convert Content to PluginWithCategory
export function contentToPlugin(
  content: Content & {
    author?: Profile | null;
    tags?: Tag[];
    reviews_count?: number;
  }
): PluginWithCategory {
  const metadata = content.metadata || {};

  return {
    id: content.id,
    title: content.title,
    subtitle: metadata.subtitle || null,
    subtitle_en: metadata.subtitle_en || null,
    icon: metadata.icon || null,
    body: content.body,
    view_count: content.view_count,
    upvote_count: content.upvote_count,
    downvote_count: content.downvote_count,
    comments_count: content.reviews_count || 0,
    github_url: metadata.github_url || null,
    license_type: metadata.license_type || null,
    download_url: metadata.download_url || null,
    documentation_url: metadata.documentation_url || null,
    install_command: metadata.install_command || null,
    plugin_url: metadata.plugin_url || null,
    version: metadata.version || null,
    author_name: metadata.author_name || null,
    compatibility: metadata.compatibility || null,
    tags: content.tags?.map(t => t.name).join(',') || null,
    category: content.tags?.[0]?.name || null,
    created_at: content.created_at,
    author: content.author ? {
      id: content.author.id,
      nickname: content.author.nickname,
      avatar_url: content.author.avatar_url,
    } : null,
  };
}

// Extract plugin contents from metadata
export function contentToPluginContents(content: Content): PluginContent[] {
  const metadata = content.metadata || {};
  const contents: PluginContent[] = [];

  if (metadata.what_is) {
    contents.push({
      title: 'What is it?',
      content: metadata.what_is,
    });
  }

  if (metadata.how_to_use) {
    contents.push({
      title: 'How to use',
      content: metadata.how_to_use,
    });
  }

  if (metadata.key_features && metadata.key_features.length > 0) {
    contents.push({
      title: 'Key Features',
      content: metadata.key_features.join('\n'),
    });
  }

  return contents;
}

// Extract license info from content
export function contentToPluginLicense(content: Content): PluginLicense | null {
  const metadata = content.metadata || {};

  if (!metadata.license_type) {
    return null;
  }

  return {
    type: metadata.license_type,
    url: metadata.github_url || undefined,
  };
}
