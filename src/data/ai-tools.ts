export type ToolCategory = 'editor' | 'cli' | 'web';

export interface AITool {
  id: string;
  name: string;
  category: ToolCategory;
  logo: string;
  brandColor: string;
  tagline: { ko: string; en: string };
  description: { ko: string; en: string };
  officialUrl: string;
}

export const categoryInfo: Record<ToolCategory, {
  labelKo: string;
  labelEn: string;
  descriptionKo: string;
  descriptionEn: string;
  icon: string;
  color: string;
}> = {
  editor: {
    labelKo: 'IDE/에디터 기반',
    labelEn: 'IDE/Editor Based',
    descriptionKo: 'VS Code 등 에디터에 추가 또는 직접 설치해서 사용',
    descriptionEn: 'Install and use in editors like VS Code',
    icon: 'Code',
    color: '#6366f1',
  },
  cli: {
    labelKo: 'CLI/터미널 기반',
    labelEn: 'CLI/Terminal Based',
    descriptionKo: '터미널에서 명령어로 직접 실행',
    descriptionEn: 'Run directly from terminal with commands',
    icon: 'Terminal',
    color: '#10b981',
  },
  web: {
    labelKo: '웹/클라우드 기반',
    labelEn: 'Web/Cloud Based',
    descriptionKo: '브라우저에서 바로 사용 가능',
    descriptionEn: 'Use directly in your browser',
    icon: 'Language',
    color: '#f59e0b',
  },
};

export const aiTools: AITool[] = [
  // IDE/에디터 기반
  {
    id: 'antigravity',
    name: 'Antigravity',
    category: 'editor',
    logo: 'https://i.namu.wiki/i/kARx1nP9GHaTktx_4yTI4HXLOjmd3JZaKJkHTXgE2bv4UATWXkVlvoE6ktFO4MFI6yMcV50x6z-pisOEDBOUOQ.webp',
    brandColor: '#4285F4',
    tagline: {
      ko: 'Google의 AI 코딩 에이전트',
      en: 'Google\'s AI Coding Agent',
    },
    description: {
      ko: 'Google이 개발한 AI 기반 자율 코딩 에이전트로, 복잡한 코딩 작업을 자동으로 수행합니다.',
      en: 'An AI-powered autonomous coding agent developed by Google that automatically performs complex coding tasks.',
    },
    officialUrl: 'https://www.antigravity.google/',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'editor',
    logo: 'https://cdn.brandfetch.io/ideKwS9dxx/w/400/h/400/theme/dark/icon.jpeg',
    brandColor: '#000000',
    tagline: {
      ko: 'AI 네이티브 코드 에디터',
      en: 'AI-native Code Editor',
    },
    description: {
      ko: 'VS Code 기반의 AI 네이티브 코드 에디터로, 강력한 AI 코딩 어시스턴트 기능을 제공합니다.',
      en: 'An AI-native code editor based on VS Code with powerful AI coding assistant features.',
    },
    officialUrl: 'https://cursor.com',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'editor',
    logo: 'https://exafunction.github.io/public/brand/windsurf-black-symbol.svg',
    brandColor: '#09B6A2',
    tagline: {
      ko: 'Codeium의 AI IDE',
      en: 'AI IDE by Codeium',
    },
    description: {
      ko: 'Codeium에서 개발한 AI 기반 통합 개발 환경으로, 지능형 코드 완성과 편집 기능을 제공합니다.',
      en: 'An AI-powered IDE by Codeium offering intelligent code completion and editing features.',
    },
    officialUrl: 'https://codeium.com/windsurf',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'editor',
    logo: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.svg',
    brandColor: '#6E40C9',
    tagline: {
      ko: 'AI 페어 프로그래머',
      en: 'Your AI Pair Programmer',
    },
    description: {
      ko: 'GitHub과 OpenAI가 개발한 AI 페어 프로그래머로, 실시간 코드 제안과 자동 완성을 제공합니다.',
      en: 'An AI pair programmer by GitHub and OpenAI providing real-time code suggestions and auto-completion.',
    },
    officialUrl: 'https://github.com/features/copilot',
  },

  // CLI/터미널 기반
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'cli',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg',
    brandColor: '#DA7756',
    tagline: {
      ko: 'Anthropic 공식 CLI 에이전트',
      en: 'Official Anthropic CLI Agent',
    },
    description: {
      ko: 'Anthropic의 공식 CLI 도구로, 터미널에서 Claude의 강력한 코딩 능력을 활용할 수 있습니다.',
      en: 'Anthropic\'s official CLI tool that brings Claude\'s powerful coding capabilities to your terminal.',
    },
    officialUrl: 'https://docs.anthropic.com/en/docs/claude-code',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex CLI',
    category: 'cli',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    brandColor: '#10a37f',
    tagline: {
      ko: 'OpenAI의 코딩 CLI',
      en: 'OpenAI\'s Coding CLI',
    },
    description: {
      ko: 'OpenAI의 Codex 모델을 기반으로 한 CLI 도구로, 자연어를 코드로 변환합니다.',
      en: 'A CLI tool based on OpenAI\'s Codex model that converts natural language to code.',
    },
    officialUrl: 'https://github.com/openai/codex',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    category: 'cli',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    brandColor: '#4285F4',
    tagline: {
      ko: 'Google Gemini CLI 도구',
      en: 'Google Gemini CLI Tool',
    },
    description: {
      ko: 'Google의 Gemini 모델을 터미널에서 직접 사용할 수 있는 CLI 도구입니다.',
      en: 'A CLI tool that brings Google\'s Gemini model directly to your terminal.',
    },
    officialUrl: 'https://github.com/google-gemini/gemini-cli',
  },

  // 웹/클라우드 기반
  {
    id: 'replit',
    name: 'Replit',
    category: 'web',
    logo: 'https://cdn.brandfetch.io/ido8Wu58rI/theme/dark/symbol.svg',
    brandColor: '#F26207',
    tagline: {
      ko: '클라우드 AI IDE',
      en: 'Cloud AI IDE',
    },
    description: {
      ko: '브라우저에서 바로 사용할 수 있는 클라우드 기반 AI 통합 개발 환경입니다.',
      en: 'A cloud-based AI-powered IDE that you can use directly in your browser.',
    },
    officialUrl: 'https://replit.com',
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    category: 'web',
    logo: 'https://developer.stackblitz.com/img/logo/stackblitz-bolt-blue.svg',
    brandColor: '#3B82F6',
    tagline: {
      ko: 'AI 풀스택 개발 플랫폼',
      en: 'AI Full-stack Development',
    },
    description: {
      ko: '프롬프트만으로 풀스택 웹 애플리케이션을 생성하고 배포할 수 있는 AI 플랫폼입니다.',
      en: 'An AI platform that creates and deploys full-stack web applications from prompts.',
    },
    officialUrl: 'https://bolt.new',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    category: 'web',
    logo: 'https://lovable.dev/icon.svg',
    brandColor: '#FF1B8D',
    tagline: {
      ko: 'AI 앱 빌더',
      en: 'AI App Builder',
    },
    description: {
      ko: '대화형 AI를 통해 아이디어를 실제 애플리케이션으로 빠르게 변환합니다.',
      en: 'Quickly transform ideas into real applications through conversational AI.',
    },
    officialUrl: 'https://lovable.dev',
  },
  {
    id: 'v0',
    name: 'v0',
    category: 'web',
    logo: 'https://cdn.brandfetch.io/idDpCfN4VD/w/400/h/400/theme/dark/icon.png',
    brandColor: '#000000',
    tagline: {
      ko: 'Vercel의 AI UI 생성기',
      en: 'Vercel\'s AI UI Generator',
    },
    description: {
      ko: 'Vercel이 만든 AI 기반 UI 생성 도구로, 텍스트 프롬프트로 React 컴포넌트를 생성합니다.',
      en: 'An AI-powered UI generator by Vercel that creates React components from text prompts.',
    },
    officialUrl: 'https://v0.dev',
  },
];

export const getToolById = (id: string): AITool | undefined => {
  return aiTools.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: ToolCategory): AITool[] => {
  return aiTools.filter(tool => tool.category === category);
};
