# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VIB Builders (vibb) - A Korean community website for vibe coding enthusiasts. All UI text should be in Korean.

Main sections:
- **스킬 (Skills)** - Claude skills hub (fully implemented, based on claudeHub)
- **MCP** - Model Context Protocol resources (coming soon)
- **프롬프트 (Prompt)** - Prompt templates and guides (coming soon)
- **AI 도구 (AI Tools)** - AI tool collection (coming soon)

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router with:
- React 19
- TypeScript (strict mode)
- Material UI v7 with Emotion for styling
- Tailwind CSS v4
- Framer Motion for animations
- Supabase for backend (auth, database)

### Design System

Uses ClaudeHub-inspired design tokens (defined in `src/theme/tokens.ts`):
- Primary: `#ff6b35` (orange)
- Secondary: `#ffc857` (golden yellow)
- Light background: `#FFFBF5`
- Dark background: `#2D3436`

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with hero, features, skills
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global styles
│   ├── skills/            # Skills listing page
│   ├── skill/[id]/        # Skill detail page
│   ├── categories/        # Categories browsing
│   ├── mcp/               # MCP section (placeholder)
│   ├── prompt/            # Prompt section (placeholder)
│   ├── ai-tools/          # AI Tools section (placeholder)
│   ├── about/             # About page
│   ├── guide/             # Usage guide
│   ├── benefits/          # Benefits page
│   └── auth/callback/     # OAuth callback
├── components/
│   ├── Layout/            # Header, Footer, FABs
│   ├── Dashboard/         # Home page components
│   ├── SkillCard/         # Skill card component
│   ├── Comments/          # Comment system
│   ├── Skeletons/         # Loading skeletons
│   └── Auth/              # Auth components
├── contexts/
│   ├── ThemeContext.tsx   # Dark/light mode
│   ├── LanguageContext.tsx # i18n (Korean/English)
│   └── AuthContext.tsx    # Supabase auth
├── services/
│   └── supabase/          # Database operations
├── theme/
│   ├── tokens.ts          # Design tokens
│   └── theme.ts           # MUI theme config
├── types/                 # TypeScript types
├── lib/                   # Utilities
└── data/                  # Static data
```

### Key Features

- Multi-language support (Korean default, English available)
- Dark/light theme toggle with localStorage persistence
- Google OAuth authentication via Supabase
- Real-time search for skills
- Comment system with ratings
- Skill likes and view counts
- Responsive design with mobile drawer navigation

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_GITHUB_TOKEN` - GitHub token for API access
