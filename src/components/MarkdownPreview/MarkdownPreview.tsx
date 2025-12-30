'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Code as CodeIcon,
  Link as LinkIcon,
  FormatQuote as QuoteIcon,
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

  // Parse inline formatting (bold, italic, inline code, links, images)
  const parseInlineFormatting = (text: string, keyStart: number): { elements: React.ReactNode[]; keyEnd: number } => {
    const elements: React.ReactNode[] = [];
    let key = keyStart;
    let remaining = text;

    // Combined regex for all inline elements
    // Order matters: images before links, bold before italic
    const inlineRegex = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|(https?:\/\/[^\s<>[\]()]+)/g;

    let lastIndex = 0;
    let match;

    while ((match = inlineRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        elements.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
      }

      if (match[1] !== undefined || match[2] !== undefined) {
        // Image: ![alt](url)
        const altText = match[1] || '';
        const imageUrl = match[2];
        elements.push(
          <Box
            key={key++}
            component="span"
            sx={{
              display: 'block',
              my: 2,
              textAlign: 'center',
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={altText}
              sx={{
                maxWidth: '100%',
                maxHeight: 400,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {altText && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                }}
              >
                {altText}
              </Typography>
            )}
          </Box>
        );
      } else if (match[3] !== undefined && match[4] !== undefined) {
        // Link: [text](url)
        const linkText = match[3];
        const linkUrl = match[4];
        const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
        elements.push(
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
      } else if (match[5] !== undefined) {
        // Bold: **text**
        elements.push(
          <Typography
            key={key++}
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {match[5]}
          </Typography>
        );
      } else if (match[6] !== undefined) {
        // Italic: *text*
        elements.push(
          <Typography
            key={key++}
            component="span"
            sx={{ fontStyle: 'italic' }}
          >
            {match[6]}
          </Typography>
        );
      } else if (match[7] !== undefined) {
        // Inline code: `code`
        elements.push(
          <Typography
            key={key++}
            component="code"
            sx={{
              px: 0.5,
              py: 0.25,
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 0.5,
              fontFamily: 'monospace',
              fontSize: '0.9em',
            }}
          >
            {match[7]}
          </Typography>
        );
      } else if (match[8] !== undefined) {
        // Raw URL
        const url = match[8];
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
      }

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
    let key = 0;

    // First, extract code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    let lastIndex = 0;
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
        // Code block rendering
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
        // Process text content line by line for block-level elements
        const lines = part.content.split('\n');
        let i = 0;

        while (i < lines.length) {
          const line = lines[i];
          const trimmedLine = line.trim();

          // Skip empty lines
          if (!trimmedLine) {
            i++;
            continue;
          }

          // Header 1: # text
          if (trimmedLine.startsWith('# ')) {
            const headerText = trimmedLine.slice(2);
            const { elements: inlineElements, keyEnd } = parseInlineFormatting(headerText, key);
            key = keyEnd;
            elements.push(
              <Typography
                key={key++}
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mt: 3,
                  mb: 1.5,
                  pb: 0.5,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                  color: 'text.primary',
                }}
              >
                {inlineElements}
              </Typography>
            );
            i++;
            continue;
          }

          // Header 2: ## text
          if (trimmedLine.startsWith('## ')) {
            const headerText = trimmedLine.slice(3);
            const { elements: inlineElements, keyEnd } = parseInlineFormatting(headerText, key);
            key = keyEnd;
            elements.push(
              <Typography
                key={key++}
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mt: 2.5,
                  mb: 1,
                  color: 'text.primary',
                }}
              >
                {inlineElements}
              </Typography>
            );
            i++;
            continue;
          }

          // Header 3: ### text
          if (trimmedLine.startsWith('### ')) {
            const headerText = trimmedLine.slice(4);
            const { elements: inlineElements, keyEnd } = parseInlineFormatting(headerText, key);
            key = keyEnd;
            elements.push(
              <Typography
                key={key++}
                variant="subtitle1"
                component="h3"
                sx={{
                  fontWeight: 600,
                  mt: 2,
                  mb: 0.75,
                  color: 'text.primary',
                }}
              >
                {inlineElements}
              </Typography>
            );
            i++;
            continue;
          }

          // Blockquote: > text (can span multiple lines)
          if (trimmedLine.startsWith('> ')) {
            const quoteLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('> ')) {
              quoteLines.push(lines[i].trim().slice(2));
              i++;
            }
            const quoteText = quoteLines.join('\n');
            const { elements: inlineElements, keyEnd } = parseInlineFormatting(quoteText, key);
            key = keyEnd;
            elements.push(
              <Box
                key={key++}
                sx={{
                  display: 'flex',
                  my: 2,
                  pl: 2,
                  py: 1.5,
                  borderLeft: `4px solid #ff6b35`,
                  bgcolor: isDark ? 'rgba(255, 107, 53, 0.08)' : 'rgba(255, 107, 53, 0.05)',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <QuoteIcon
                  sx={{
                    fontSize: 20,
                    color: '#ff6b35',
                    mr: 1.5,
                    mt: 0.25,
                    opacity: 0.7,
                  }}
                />
                <Typography
                  component="blockquote"
                  sx={{
                    fontStyle: 'italic',
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    m: 0,
                  }}
                >
                  {inlineElements}
                </Typography>
              </Box>
            );
            continue;
          }

          // Horizontal rule: --- or ***
          if (trimmedLine === '---' || trimmedLine === '***') {
            elements.push(
              <Box
                key={key++}
                component="hr"
                sx={{
                  my: 2,
                  border: 'none',
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              />
            );
            i++;
            continue;
          }

          // Regular paragraph - collect consecutive non-empty lines
          const paragraphLines: string[] = [];
          while (
            i < lines.length &&
            lines[i].trim() &&
            !lines[i].trim().startsWith('#') &&
            !lines[i].trim().startsWith('>') &&
            lines[i].trim() !== '---' &&
            lines[i].trim() !== '***'
          ) {
            paragraphLines.push(lines[i]);
            i++;
          }

          if (paragraphLines.length > 0) {
            const paragraphText = paragraphLines.join('\n');
            const { elements: inlineElements, keyEnd } = parseInlineFormatting(paragraphText, key);
            key = keyEnd;
            elements.push(
              <Typography
                key={key++}
                component="p"
                sx={{
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  my: 1,
                }}
              >
                {inlineElements}
              </Typography>
            );
          }
        }
      }
    });

    return elements;
  };

  if (!content.trim()) {
    return null;
  }

  return <Box sx={{ '& > *:first-of-type': { mt: 0 } }}>{parseContent(content)}</Box>;
}
