'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Code as CodeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useExternalLink } from '@/contexts/ExternalLinkContext';

interface MarkdownPreviewProps {
  content: string;
  isDark?: boolean;
}

export function MarkdownPreview({ content, isDark: isDarkProp }: MarkdownPreviewProps) {
  const theme = useTheme();
  const { openExternalLink } = useExternalLink();
  const isDark = isDarkProp ?? theme.palette.mode === 'dark';

  // Helper to parse text and convert raw URLs to clickable links
  const parseTextWithUrls = (text: string, keyStart: number): { elements: React.ReactNode[]; keyEnd: number } => {
    const elements: React.ReactNode[] = [];
    let key = keyStart;

    // Regex to match raw URLs (not inside markdown link syntax)
    const urlRegex = /(https?:\/\/[^\s<>[\]()]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        elements.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
      }

      const url = match[1];
      elements.push(
        <Typography
          key={key++}
          component="span"
          onClick={() => {
            openExternalLink(url);
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#ff6b35',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <LinkIcon sx={{ fontSize: 14 }} />
          {url.length > 50 ? url.slice(0, 50) + '...' : url}
        </Typography>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    return { elements, keyEnd: key };
  };

  const parseContent = (text: string) => {
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'code', content: match[2], language: match[1] || 'text' });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    parts.forEach((part) => {
      if (part.type === 'code') {
        elements.push(
          <Box key={key++} sx={{ my: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '4px 4px 0 0',
                border: `1px solid ${theme.palette.divider}`,
                borderBottom: 'none',
              }}
            >
              <CodeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {part.language}
              </Typography>
            </Box>
            <SyntaxHighlighter
              language={part.language}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0 0 4px 4px',
                border: `1px solid ${theme.palette.divider}`,
                borderTop: 'none',
                fontSize: '0.85rem',
              }}
            >
              {part.content.trim()}
            </SyntaxHighlighter>
          </Box>
        );
      } else {
        const textContent = part.content;
        const textElements: React.ReactNode[] = [];
        let textLastIndex = 0;
        let linkMatch;

        // Helper to add text with raw URL parsing
        const addTextWithUrls = (text: string) => {
          text.split('\n').forEach((line, i, arr) => {
            if (line.trim()) {
              const { elements: lineElements, keyEnd } = parseTextWithUrls(line, key);
              textElements.push(...lineElements);
              key = keyEnd;
            }
            if (i < arr.length - 1) {
              textElements.push(<br key={key++} />);
            }
          });
        };

        const linkRegexLocal = /\[([^\]]+)\]\(([^)]+)\)/g;
        while ((linkMatch = linkRegexLocal.exec(textContent)) !== null) {
          if (linkMatch.index > textLastIndex) {
            const beforeText = textContent.slice(textLastIndex, linkMatch.index);
            addTextWithUrls(beforeText);
          }
          const linkUrl = linkMatch[2];
          const linkText = linkMatch[1];
          const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');

          textElements.push(
            <Typography
              key={key++}
              component="span"
              onClick={() => {
                if (isExternal) {
                  openExternalLink(linkUrl);
                } else {
                  window.location.href = linkUrl;
                }
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#ff6b35',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <LinkIcon sx={{ fontSize: 14 }} />
              {linkText}
            </Typography>
          );
          textLastIndex = linkMatch.index + linkMatch[0].length;
        }

        if (textLastIndex < textContent.length) {
          const remainingText = textContent.slice(textLastIndex);
          addTextWithUrls(remainingText);
        }

        if (textElements.length > 0) {
          elements.push(
            <Typography key={key++} component="div" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {textElements}
            </Typography>
          );
        }
      }
    });

    return elements;
  };

  if (!content.trim()) {
    return null;
  }

  return <Box>{parseContent(content)}</Box>;
}
