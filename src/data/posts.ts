import { Post } from '@/types/post';

// Sample posts data - in production this would come from Supabase
export const samplePosts: Post[] = [
  {
    id: '1',
    title: '🔥 Claude Code 처음 사용하시는 분들을 위한 완벽 가이드',
    content: '안녕하세요! Claude Code를 처음 접하시는 분들을 위해 설치부터 기본 사용법까지 정리해봤습니다. 터미널에서 claude 명령어로 시작하시면 됩니다...',
    author: { name: '바이브마스터', avatar: '' },
    category: '스킬',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    upvotes: 127,
    downvotes: 3,
    commentCount: 42,
    viewCount: 2847,
    tags: ['초보자', '가이드', 'Claude Code'],
    isPinned: true,
  },
  {
    id: '2',
    title: 'MCP 서버 구축 경험 공유합니다 (Notion + Slack 연동)',
    content: 'Notion과 Slack을 MCP로 연동해서 사용중인데, 생산성이 정말 많이 올랐어요. 구축 과정과 팁을 공유합니다...',
    author: { name: '개발자김', avatar: '' },
    category: 'MCP',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    upvotes: 89,
    downvotes: 2,
    commentCount: 28,
    viewCount: 1523,
    tags: ['MCP', 'Notion', 'Slack', '자동화'],
  },
  {
    id: '3',
    title: '코드 리뷰 받을 때 사용하는 프롬프트 템플릿',
    content: 'Claude에게 코드 리뷰를 요청할 때 더 좋은 피드백을 받을 수 있는 프롬프트를 공유합니다. 보안, 성능, 가독성 등 다양한 관점에서...',
    author: { name: '프롬프트장인', avatar: '' },
    category: '프롬프트',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    upvotes: 156,
    downvotes: 5,
    commentCount: 67,
    viewCount: 3241,
    tags: ['프롬프트', '코드리뷰', '템플릿'],
  },
  {
    id: '4',
    title: 'Cursor vs Claude Code, 6개월 사용 후기',
    content: '둘 다 써본 입장에서 상황별 추천을 드립니다. Cursor는 IDE 통합이 강점이고, Claude Code는...',
    author: { name: 'AI도구덕후', avatar: '' },
    category: 'AI 코딩 툴',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    upvotes: 234,
    downvotes: 12,
    commentCount: 89,
    viewCount: 5672,
    tags: ['Cursor', 'Claude Code', '비교', '후기'],
  },
  {
    id: '5',
    title: '바이브 코딩으로 사이드 프로젝트 2주만에 완성한 후기',
    content: '혼자서 2주만에 풀스택 웹앱을 완성했습니다. AI 어시스턴트 없이는 불가능했을 것 같아요. 과정을 공유합니다...',
    author: { name: '사이드허슬러', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    upvotes: 312,
    downvotes: 8,
    commentCount: 95,
    viewCount: 7891,
    tags: ['사이드프로젝트', '후기', '바이브코딩'],
  },
  {
    id: '6',
    title: 'Claude가 자꾸 같은 실수를 반복하는데 어떻게 해야 할까요?',
    content: '특정 패턴의 코드를 작성할 때 계속 같은 실수를 하는데, 어떻게 하면 더 정확하게 지시할 수 있을까요?',
    author: { name: '초보개발자', avatar: '' },
    category: '질문',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    upvotes: 45,
    downvotes: 1,
    commentCount: 23,
    viewCount: 892,
    tags: ['질문', '프롬프트', '팁'],
  },
  {
    id: '7',
    title: 'PDF 처리 스킬 업데이트 - 이제 한글 OCR도 지원합니다',
    content: 'Anthropic 공식 PDF 스킬이 업데이트되어서 한글 OCR도 잘 됩니다. 테스트 결과를 공유드립니다...',
    author: { name: '스킬헌터', avatar: '' },
    category: '스킬',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    upvotes: 78,
    downvotes: 2,
    commentCount: 31,
    viewCount: 1847,
    tags: ['PDF', 'OCR', '스킬', '업데이트'],
  },
  {
    id: '8',
    title: 'GitHub MCP 서버 설정하는 방법 (초간단)',
    content: 'GitHub API를 MCP로 연동하면 레포 관리가 정말 편해집니다. 설정 방법을 단계별로 알려드릴게요...',
    author: { name: 'MCP전문가', avatar: '' },
    category: 'MCP',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    upvotes: 167,
    downvotes: 4,
    commentCount: 45,
    viewCount: 4523,
    tags: ['GitHub', 'MCP', '튜토리얼'],
  },
  {
    id: '9',
    title: '시스템 프롬프트 작성의 기술 - 10가지 핵심 원칙',
    content: '효과적인 시스템 프롬프트를 작성하기 위한 10가지 원칙을 정리했습니다. 1. 역할을 명확히 정의하기...',
    author: { name: '프롬프트엔지니어', avatar: '' },
    category: '프롬프트',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    upvotes: 289,
    downvotes: 7,
    commentCount: 72,
    viewCount: 6234,
    tags: ['시스템프롬프트', '팁', '가이드'],
  },
  {
    id: '10',
    title: 'v0 + Claude Code 조합이 최강인 이유',
    content: 'UI는 v0로 빠르게 생성하고, 로직은 Claude Code로 구현하면 개발 속도가 미쳤습니다...',
    author: { name: '풀스택러', avatar: '' },
    category: 'AI 코딩 툴',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    upvotes: 198,
    downvotes: 15,
    commentCount: 63,
    viewCount: 4892,
    tags: ['v0', 'Claude Code', '워크플로우'],
  },
  // 커뮤니티 posts - DC Inside 개념글 style with realistic engagement
  {
    id: '11',
    title: 'Claude Code 3개월 사용 후기 ㄹㅇ 정리...txt',
    content: '진짜 객관적으로 정리함. 장점: 코드 품질 상승, 개발 속도 2배, 야근 감소. 단점: 가끔 헛소리함, 컨텍스트 날아가면 빡침. 결론: 안 쓰면 손해',
    author: { name: '업햄', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    upvotes: 408,
    downvotes: 12,
    commentCount: 104,
    viewCount: 8934,
    tags: ['후기', 'Claude Code'],
  },
  {
    id: '12',
    title: '개발자 채용공고에 "AI 도구 활용 능력" 추가되는거 ㄷㄷ',
    content: '요즘 채용공고 보면 AI 도구 활용 능력 우대라고 써있는 곳 많아짐... 시대가 변했다',
    author: { name: 'ㅇㅇ(211.235)', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    upvotes: 258,
    downvotes: 8,
    commentCount: 122,
    viewCount: 5621,
    tags: ['채용', 'AI'],
  },
  {
    id: '13',
    title: '바이브코딩으로 사이드 프로젝트 2주만에 런칭한 후기...jpg',
    content: '혼자서 풀스택 웹앱 완성함. Next.js + Supabase 조합인데 Claude가 거의 다 해줌 ㅋㅋ 나는 감독만 했음',
    author: { name: '칠삼칠삼', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    upvotes: 383,
    downvotes: 15,
    commentCount: 119,
    viewCount: 7823,
    tags: ['사이드프로젝트', '후기'],
  },
  {
    id: '14',
    title: 'GPT-4 vs Claude 3.5 코딩 비교 테스트 결과 ㄹㅇ...jpg',
    content: '같은 문제 10개 줘봤는데 Claude가 7:3으로 이김. 특히 긴 코드 작성할 때 Claude가 압도적임. GPT는 중간에 끊기는 경우 많음',
    author: { name: 'Adidas', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    upvotes: 468,
    downvotes: 23,
    commentCount: 98,
    viewCount: 12453,
    tags: ['GPT', 'Claude', '비교'],
  },
  {
    id: '15',
    title: '회사에서 AI 코딩 금지령 내렸는데 어떻게 해야함?',
    content: '보안 문제로 AI 도구 사용 금지됨... 근데 이미 적응해버려서 생산성 반토막남. 이직 알아봐야하나',
    author: { name: 'ㅇㅇ(118.235)', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    upvotes: 192,
    downvotes: 18,
    commentCount: 218,
    viewCount: 9234,
    tags: ['회사', 'AI금지'],
  },
  {
    id: '16',
    title: 'Cursor vs Claude Code 뭐가 더 나음?',
    content: '둘 다 써본 사람 의견 좀. Cursor는 IDE 통합이 좋고, Claude Code는 터미널에서 바로 쓸 수 있어서 좋음. 근데 결제는 하나만 하고싶음',
    author: { name: '포흐애액', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    upvotes: 276,
    downvotes: 8,
    commentCount: 157,
    viewCount: 6789,
    tags: ['Cursor', 'Claude Code'],
  },
  {
    id: '17',
    title: '10년차 시니어인데 신입한테 바이브코딩 배우는 중...JPG',
    content: '자존심 상하지만 인정할건 인정해야함. 신입이 Claude로 나보다 2배 빠르게 개발함. 이제 나도 배워야겠다 싶음',
    author: { name: '포흐애액', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    upvotes: 296,
    downvotes: 12,
    commentCount: 167,
    viewCount: 7234,
    tags: ['시니어', '신입'],
  },
  {
    id: '18',
    title: 'Claude한테 코드리뷰 시켰더니 내 코드 개까는중 ㅋㅋ',
    content: '"이 함수는 너무 많은 책임을 가지고 있습니다" "변수명이 의미를 전달하지 못합니다" AI한테 혼나는 기분 처음이네',
    author: { name: '포흐애액', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    upvotes: 218,
    downvotes: 5,
    commentCount: 80,
    viewCount: 4532,
    tags: ['코드리뷰', '웃김'],
  },
  {
    id: '19',
    title: '바이브코딩 하고나서 야근이 사라진 이유 ㄹㅇ...jpg',
    content: '반복작업 Claude한테 시키고, 보일러플레이트 자동생성하고, 디버깅도 같이하니까 일이 빨리 끝남. 워라밸 찾음',
    author: { name: 'Adidas', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    upvotes: 200,
    downvotes: 8,
    commentCount: 153,
    viewCount: 5123,
    tags: ['야근', '워라밸'],
  },
  {
    id: '20',
    title: 'MCP 서버 구축하다가 멘탈 나감...JPG',
    content: 'Notion이랑 연동하려고 하루종일 삽질함. 결국 성공했는데 공식 문서가 너무 부실함. 누가 정리 좀 해줘',
    author: { name: '포흐애액', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    upvotes: 196,
    downvotes: 4,
    commentCount: 58,
    viewCount: 3421,
    tags: ['MCP', 'Notion'],
  },
  {
    id: '21',
    title: '면접에서 "AI 도구 사용하시나요?" 질문 받음',
    content: '정직하게 Claude 쓴다고 했더니 면접관이 되게 관심있어함. 오히려 플러스 요인이 된 듯?',
    author: { name: '업햄', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
    upvotes: 233,
    downvotes: 7,
    commentCount: 133,
    viewCount: 5678,
    tags: ['면접', 'AI'],
  },
  {
    id: '22',
    title: 'Claude Max 결제각인가? 무료로 버티는 사람?',
    content: '무료 티어로 버티다가 한계 느껴서 결제 고민중. 월 2만원이 아깝지 않을까? 결제한 사람들 후기 좀',
    author: { name: 'ㅇㅇ(118.37)', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    upvotes: 150,
    downvotes: 5,
    commentCount: 58,
    viewCount: 2987,
    tags: ['Claude Max', '결제'],
  },
  {
    id: '23',
    title: '프롬프트 엔지니어링 진짜 중요하더라...txt',
    content: '같은 질문이라도 어떻게 물어보느냐에 따라 결과가 천차만별임. 시스템 프롬프트 잘 짜면 생산성 2배는 올라감',
    author: { name: 'ㅇㅇ(14.37)', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    upvotes: 154,
    downvotes: 6,
    commentCount: 120,
    viewCount: 4123,
    tags: ['프롬프트', '팁'],
  },
  {
    id: '24',
    title: '비전공자인데 바이브코딩으로 앱 만들었다...jpg',
    content: '디자이너인데 개발 1도 모르는 상태에서 시작함. Claude한테 하나하나 물어보면서 3주만에 iOS 앱 출시함. 세상 좋아졌다',
    author: { name: 'Rose', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    upvotes: 172,
    downvotes: 8,
    commentCount: 100,
    viewCount: 3876,
    tags: ['비전공자', '앱개발'],
  },
  {
    id: '25',
    title: 'v0 + Claude Code 조합이 사기인 이유 ㄹㅇ...jpg',
    content: 'UI는 v0로 생성하고, 로직은 Claude Code로 구현하면 진짜 개발속도 미침. 이 조합 모르면 손해',
    author: { name: 'Adidas', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
    upvotes: 193,
    downvotes: 5,
    commentCount: 59,
    viewCount: 3654,
    tags: ['v0', 'Claude Code'],
  },
  {
    id: '26',
    title: '회사에서 Claude 쓰다 들킴 ㅋㅋㅋㅋ',
    content: '팀장님이 갑자기 "야 그거 AI로 짠거지?" 하길래 솔직하게 인정함. 근데 팀장님도 쓰고있었음 ㅋㅋㅋㅋ',
    author: { name: '포흐애액', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
    upvotes: 162,
    downvotes: 3,
    commentCount: 79,
    viewCount: 3234,
    tags: ['회사', '웃김'],
  },
  {
    id: '27',
    title: '개발자 연봉 협상할 때 AI 활용 능력 어필하면 됨?',
    content: 'AI 도구로 생산성 2배 올렸다고 어필하면 연봉 협상에 도움될까? 아니면 "대체 가능하네" 이렇게 생각할까?',
    author: { name: 'ㅇㅇ(211.235)', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    upvotes: 163,
    downvotes: 7,
    commentCount: 77,
    viewCount: 2987,
    tags: ['연봉', '협상'],
  },
  {
    id: '28',
    title: 'Claude가 거짓말하다 걸린 사건...jpg',
    content: '분명 안된다고 했는데 다시 물어보니까 됨 ㅋㅋㅋ AI도 귀찮으면 대충 대답하나봄',
    author: { name: '포흐애액', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    upvotes: 150,
    downvotes: 4,
    commentCount: 61,
    viewCount: 2543,
    tags: ['Claude', '웃김'],
  },
  {
    id: '29',
    title: '2025년 개발자 필수 스킬이 바이브코딩인 이유...txt',
    content: 'AI 도구 활용 못하면 도태됨. 이제 코딩 실력보다 AI랑 협업하는 능력이 더 중요해지는 시대. 적응 못하면 끝',
    author: { name: 'Adidas', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    upvotes: 182,
    downvotes: 15,
    commentCount: 64,
    viewCount: 3421,
    tags: ['2025', '트렌드'],
  },
  {
    id: '30',
    title: 'Claude Opus 4.5 나왔는데 써본사람?',
    content: '새 모델 나왔다는데 기존이랑 뭐가 다른지 모르겠음. 체감되는 차이 있음?',
    author: { name: 'Rose', avatar: '' },
    category: '커뮤니티',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
    upvotes: 44,
    downvotes: 2,
    commentCount: 21,
    viewCount: 1234,
    tags: ['Opus', '신모델'],
  },
];

// Helper functions
export const getHotPosts = (posts: Post[]): Post[] => {
  const now = Date.now();
  return [...posts].sort((a, b) => {
    // Hot score = (upvotes - downvotes) / (hours since posted + 2)^1.5
    const hoursA = (now - a.createdAt.getTime()) / (1000 * 60 * 60) + 2;
    const hoursB = (now - b.createdAt.getTime()) / (1000 * 60 * 60) + 2;
    const scoreA = (a.upvotes - a.downvotes) / Math.pow(hoursA, 1.5);
    const scoreB = (b.upvotes - b.downvotes) / Math.pow(hoursB, 1.5);

    // Pinned posts always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    return scoreB - scoreA;
  });
};

export const getNewPosts = (posts: Post[]): Post[] => {
  return [...posts].sort((a, b) => {
    // Pinned posts always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

export const getTopPosts = (posts: Post[]): Post[] => {
  return [...posts].sort((a, b) => {
    // Pinned posts always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
  });
};

export const filterByCategory = (posts: Post[], category: string | null): Post[] => {
  if (!category || category === 'all') return posts;
  return posts.filter(post => post.category === category);
};
