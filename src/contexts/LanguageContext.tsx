"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// Korean translations (default)
const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    "header.home": "홈",
    "header.skills": "발견",
    "header.categories": "카테고리",
    "header.search.placeholder": "게시글, 스킬, 정보 검색...",
    "header.search.minChars": "검색하려면 최소 2자를 입력하세요",
    "header.search.noResults": "검색 결과가 없습니다",
    "header.search.tryDifferent": "다른 키워드를 시도해보세요",
    "header.search.featured": "추천",

    // Home
    "home.subtitle": "바이브 코딩 커뮤니티",
    "home.description": "AI와 함께하는 새로운 개발 경험을 공유하고, 함께 성장하세요",

    // Explore
    "explore.title": "발견",
    "explore.subtitle": "바로 사용 가능한 모든 스킬을 탐색해 보세요",
    "explore.searchPlaceholder": "이름, 설명 또는 태그로 스킬 검색...",
    "explore.filterByCategory": "카테고리",
    "explore.all": "전체",
    "explore.showing": "표시 중",
    "explore.skills": "스킬",
    "explore.skill": "스킬",
    "explore.in": "카테고리:",
    "explore.matching": "검색어:",
    "explore.noResults": "스킬을 찾을 수 없습니다",
    "explore.tryAdjusting": "검색 또는 필터 조건을 조정해보세요",

    // Skills
    "skills.sortBy": "정렬:",
    "skills.mostPopular": "인기순",
    "skills.mostViewed": "조회순",
    "skills.name": "이름순",
    "skills.view": "보기:",
    "skills.featuredSkills": "추천 스킬",
    "skills.allSkills": "모든 스킬",

    // Categories
    "categories.title": "카테고리",
    "categories.subtitle": "어떤 분야의 기술이 필요하신가요?",
    "categories.skillCount": "{count}개 스킬",
    "categories.backToAll": "← 모든 카테고리로 돌아가기",
    "categories.inCategory": "이 카테고리의 {count}개 스킬",

    // Skill Detail
    "skillDetail.notFound": "스킬을 찾을 수 없습니다",
    "skillDetail.backToSkills": "스킬 목록으로 돌아가기",
    "skillDetail.download": "다운로드",
    "skillDetail.github": "GitHub",
    "skillDetail.share": "공유",
    "skillDetail.reviews": "리뷰",
    "skillDetail.whatIsIt.title": "무엇인가요?",
    "skillDetail.howToUse.title": "사용 방법",
    "skillDetail.keyFeatures.title": "주요 기능",
    "skillDetail.liked": "좋아요 완료",
    "skillDetail.like": "좋아요",

    // Comments
    "comments.section.title": "댓글",
    "comments.section.subtitle": "이 스킬에 대한 생각을 공유하세요",
    "comments.section.addComment": "댓글 작성",
    "comments.section.signInPrompt": "댓글을 작성하려면 로그인하세요",
    "comments.section.signInButton": "로그인",
    "comments.section.loadError": "댓글을 불러오는 중 오류가 발생했습니다",
    "comments.form.placeholder": "댓글을 입력하세요...",
    "comments.form.emptyError": "댓글 내용을 입력하세요",
    "comments.form.tooLongError": "댓글은 2000자를 초과할 수 없습니다",
    "comments.form.submitError": "댓글 제출 중 오류가 발생했습니다",
    "comments.form.submit": "댓글 작성",
    "comments.form.update": "수정 완료",
    "comments.form.cancel": "취소",
    "comments.form.reply": "답글 작성",
    "comments.form.ratingLabel": "이 스킬을 평가해주세요",
    "comments.form.ratingRequired": "별점을 선택해주세요",
    "comments.form.alreadyCommented": "이미 이 스킬에 댓글을 작성하셨습니다",
    "comments.list.noComments": "아직 댓글이 없습니다",
    "comments.list.beFirst": "첫 번째 댓글을 작성해보세요!",
    "comments.item.edited": "수정됨",
    "comments.item.edit": "수정",
    "comments.item.delete": "삭제",
    "comments.item.deleteConfirm": "정말 이 댓글을 삭제하시겠습니까?",
    "comments.item.reply": "답글",

    // Common
    "common.loginRequired": "로그인이 필요합니다",
    "common.linkCopied": "링크가 복사되었습니다",

    // Inquiry
    "inquiry.title": "문의하기",
    "inquiry.name": "이름",
    "inquiry.email": "이메일",
    "inquiry.typeLabel": "문의 유형",
    "inquiry.message": "메시지",
    "inquiry.submit": "문의 보내기",
    "inquiry.cancel": "취소",
    "inquiry.close": "닫기",
    "inquiry.success":
      "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.",
    "inquiry.error": "문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.",
    "inquiry.signInRequired": "문의를 보내려면 로그인이 필요합니다.",
    "inquiry.signIn": "Google로 로그인",
    "inquiry.type.general": "일반 문의",
    "inquiry.type.bug": "버그 신고",
    "inquiry.type.feature": "기능 요청",
    "inquiry.type.partnership": "제휴 문의",
    "inquiry.type.other": "기타",

    // Feature Boxes
    "features.whatIs.title": "클로드 Skills란?",
    "features.whatIs.description":
      "더 나은 생산성과 창의성을 위해 클로드 AI에 장착할 수 있는 컬렉션이에요.",
    "features.howToUse.title": "어떻게 사용하나요?",
    "features.howToUse.description":
      "놀랍도록 빠르고 쉬워요. 기존 환경에 빠른 설치로 시작하세요.",
    "features.whyUse.title": "왜 사용하나요?",
    "features.whyUse.description":
      "반복적인 프롬프트 복사 붙여넣기 없이, 누구나 전문가 수준으로 AI를 활용할 수 있어요.",

    // Discover Section
    "discover.title": "추천 스킬 발견",
    "discover.subtitle": "선별된 강력한 AI 스킬을 탐색하세요",
    "discover.moreSkills.title": "더 많은 놀라운 스킬 발견",
    "discover.moreSkills.subtitle": "관심을 가질 만한 다른 스킬 탐색",

    // About Page - What is Claude Skill
    "about.hero.title": "클로드 스킬이란?",
    "about.hero.subtitle": "AI가 사용 가능한 도구",

    "about.whatIs.title": "클로드 스킬이란?",
    "about.whatIs.subtitle": "AI가 사용 가능한 도구",
    "about.whatIs.description":
      "클로드 스킬은 클로드 AI의 능력을 특정 작업에 맞게 확장하는 전문 지식 패키지에요.",
    "about.whatIs.analogy":
      "마치 스마트폰에 앱을 설치하듯이, 클로드에 스킬을 추가하면 더욱 전문적이고 정확한 작업을 수행할 수 있게 돼요.",

    "about.why.title": "왜 클로드 스킬이 필요할까요?",
    "about.why.intro":
      "클로드는 기본적으로도 똑똑하지만, 특정 작업을 할 때는 세부적인 가이드라인이 필요해요. 예를 들어,",
    "about.why.example1":
      "워드 문서를 만들 때: 어떤 형식으로 만들어야 할까요? 글꼴은? 여백은? 말투는?",
    "about.why.example2":
      "프레젠테이션을 제작할 때: 슬라이드 레이아웃은 어떻게 구성해야 할까요? 회사 로고는 어디에 넣나요?",
    "about.why.example3":
      "스프레드시트(엑셀)를 다룰 때: 수식은 어떻게 처리하고, 데이터는 어떻게 정리해야 할까요?",
    "about.why.conclusion":
      "클로드 스킬은 전문가들의 노하우와 모범 사례를 담은 설명서에요. 클로드는 스킬을 읽고, 마치 그 분야의 전문가처럼 작업을 수행할 수 있어요.",

    "about.example.title": "실제 예시",
    "about.example.intro": "문서 작성 스킬을 예로 들어볼까요?",
    "about.example.withoutSkill":
      "스킬이 없다면 클로드는 기본적인 워드 문서만 만들 수 있어요. 하지만 문서 작성 스킬을 활용한다면,",
    "about.example.feature1": "전문적인 서식과 스타일 적용",
    "about.example.feature2": "목차와 페이지 번호 자동 생성",
    "about.example.feature3": "표와 이미지의 적절한 배치",
    "about.example.feature4": "문서 편집 기록 추적",
    "about.example.conclusion":
      "이 모든 것을 높은 품질과 정확성으로 처리할 수 있습니다.",
    "about.example.before": "기존",
    "about.example.after": "클로드 스킬과 함께라면",

    "about.create.title": "누구나 스킬을 만들 수 있습니다",
    "about.create.subtitle":
      "클로드 스킬은 어떻게 일을 해야 하는지에 대한 설명서에요.",
    "about.create.description":
      "클로드 스킬의 가장 큰 장점은 누구나 만들 수 있다는 점입니다. 특정 분야의 전문가라면, 자신의 지식을 스킬로 만들어 다른 사람들과 공유할 수 있습니다. 디자이너, 마케터, 교사, 연구자 등 각자의 전문성을 담은 스킬을 만들 수 있어요.",

    "about.hub.title": "클로드 허브가 해결하는 문제",
    "about.hub.problem":
      "클로드 스킬이 많아지면 어떤 스킬이 좋은지, 신뢰할 수 있는지 알기 어려워져요. 검증되지 않은 스킬을 사용하면 원하는 결과를 얻지 못하거나, 오히려 작업이 더 복잡해질 수 있어요.",
    "about.hub.solution": "클로드 허브는 이렇게 다릅니다",
    "about.hub.description":
      "클로드 허브는 커뮤니티가 함께 만드는 검증된 스킬 라이브러리에요.",

    "about.hub.feature1.title": "신뢰성 검증",
    "about.hub.feature1.description":
      "사용자들의 리뷰와 평가를 통해 실제로 잘 작동하는 스킬만 추천해요. 직접 써본 사람들의 생생한 후기를 확인할 수 있어요.",
    "about.hub.feature2.title": "체계적인 분류",
    "about.hub.feature2.description":
      "업무용, 창작용, 학습용 등 목적별로 스킬을 쉽게 찾을 수 있어요. 내가 필요한 스킬을 몇 번의 클릭만으로 발견할 수 있죠.",
    "about.hub.feature3.title": "커뮤니티의 지혜",
    "about.hub.feature3.description":
      "다양한 사용자들이 스킬을 공유하고, 개선 아이디어를 나누며, 함께 더 나은 스킬을 만들어가고 있어요. 혼자서는 생각하지 못했던 활용법을 배울 수도 있겠죠?",
    "about.hub.feature4.title": "실전 활용 가이드",
    "about.hub.feature4.description":
      "단순히 스킬만 제공하는 게 아니라, 어떻게 사용하는지, 어떤 상황에서 유용한지에 대한 상세하고 친절한 가이드도 함께 제공해요.",

    "about.forEveryone.title": "모두를 위한 스킬 허브",
    "about.forEveryone.description":
      "클로드 허브는 개발자뿐만 아니라, 일반 사용자를 위한 공간이에요. 복잡한 기술 지식 없이도 필요한 스킬을 찾고, 클로드의 능력을 최대한 활용할 수 있도록 도와드릴게요.",
    "about.forEveryone.cta":
      "AI 시대, 클로드와 함께 더 스마트하게 일하고 싶으신가요? 클로드 허브에서 검증된 스킬을 만나보세요.",

    // Diagram labels
    "about.diagram.user": "User",
    "about.diagram.ai": "AI",
    "about.diagram.skill": "문서 작성 스킬",
    "about.diagram.request": "이번 분기 보고서 작성해줘.",
    "about.diagram.skillRef": "문서 작성 스킬을 참고해야지",
    "about.diagram.result.simple": "긴 설명 없이 완벽한 결과물",
    "about.diagram.result.unified": "매번 통일하고 정확한 문서 형식",
    "about.diagram.result.tracking": "매번 다른 결과물",
    "about.diagram.result.different": "사내 형식에 맞지 않은 문서",
    "about.diagram.result.history": "문서 편집 기록 부재",

    // Guide Page
    "guide.hero.title": "어떻게 사용하나요?",
    "guide.hero.subtitle": "3분 안에 바로 시작할 수 있어요",
    "guide.toggle.claudeAI": "클로드 AI",
    "guide.toggle.claudeAI.subtitle": "가장 간단함",
    "guide.toggle.claudeAI.description": "일반적이고 대중적인 클로드 AI 사용자",
    "guide.toggle.claudeCode": "클로드 코드",
    "guide.toggle.claudeCode.subtitle": "모든 개발자 전용",
    "guide.toggle.claudeCode.description": "클로드 코드를 사용 중인 개발자",
    "guide.toggle.claudeAPI": "클로드 API",
    "guide.toggle.claudeAPI.subtitle": "서비스 제공자 전용",
    "guide.toggle.claudeAPI.description": "더 스마트한 당신의 서비스",
    "guide.toggle.claudeAgenticSDK": "클로드 Agentic SDK",
    "guide.toggle.claudeAgenticSDK.subtitle": "AI 에이전트 개발자 전용",
    "guide.toggle.claudeAgenticSDK.description":
      "더 전문적인 당신의 AI 에이전트",
    "guide.content.claudeAI.title": "클로드 AI 사용자",
    "guide.content.claudeAI.alert.before": "",
    "guide.content.claudeAI.alert.after":
      "의 유료 사용자(Pro 이상)여야 합니다.",
    "guide.content.claudeAI.selectSkills": "스킬 선택하기",
    "guide.content.claudeAI.findSkill": "원하는 스킬을 찾았나요?",
    "guide.content.claudeAI.findSkillDesc1": "스킬 옆",
    "guide.content.claudeAI.findSkillDesc2":
      "버튼을 눌러 zip 형식의 파일을 다운받아 주세요.",
    "guide.content.claudeAI.addSkill": "스킬을 추가하세요",
    "guide.content.claudeAI.addSkillStep1": "claude.ai에 접속해 주세요.",
    "guide.content.claudeAI.addSkillStep2":
      "좌측 하단 내 프로필을 선택해주세요.",
    "guide.content.claudeAI.addSkillStep3": '"설정"을 선택해주세요.',
    "guide.content.claudeAI.addSkillStep4": '"기능" 탭을 선택해주세요.',
    "guide.content.claudeAI.addSkillStep5": "아래로 스크롤해주세요.",
    "guide.content.claudeAI.addSkillStep6": '"스킬 업로드" 버튼을 눌러주세요.',
    "guide.content.claudeAI.addSkillStep7":
      "다운로드 받았던 스킬을 추가해주세요.",
    "guide.content.claudeAI.addSkillStep8":
      "이제 모든 채팅에서 클로드가 스킬을 사용할 수 있어요. 👏",
    "guide.content.claudeAI.addSkillAlert":
      "추가가 되지 않나요? 이미 추가된 스킬은 추가할 수 없어요. 또, 일부 스킬(Anthropic 지원)은 기본적으로 추가되어 있어요.",
    "guide.content.claudeAI.faq": "FAQ",
    "guide.content.claudeAI.faq1Q": "스킬은 자동으로 사용되나요?",
    "guide.content.claudeAI.faq1A":
      "네! 클로드가 스스로 필요한 스킬을 선정하고 사용합니다. 특정 스킬을 사용하라고 명령할 수도 있어요.",
    "guide.content.claudeAI.faq2Q": "스킬을 사용한 게 맞는지 확인할 수 있나요?",
    "guide.content.claudeAI.faq2A":
      '클로드의 답변에서 스킬 사용 여부를 확인할 수 있어요. "~스킬"을 사용한다는 메시지가 나와요.',
    "guide.content.claudeAI.faq3Q": "추가한 스킬이 반영되지 않아요.",
    "guide.content.claudeAI.faq3A":
      '스킬을 추가한 이후, "새 채팅"을 통해 새로운 대화를 시작해주세요. 기존 대화에서는 신규 스킬을 알 수 없을 가능성이 있어요.',
    "guide.content.lastEdit": "최종 수정일",
    "guide.content.requestFix": "수정 요청",
    "guide.intro.title": "시작하기 쉽습니다",
    "guide.intro.subtitle":
      "다음 간단한 단계를 따라 프로젝트에서 ClaudeHub 사용을 시작하세요. 복잡한 설정이나 구성이 필요 없습니다. 설치하고 사용하세요!",
    "guide.step1.title": "스킬 찾기",
    "guide.step1.description":
      "조직된 카테고리를 탐색하거나 검색 바를 사용하여 필요에 맞는 스킬을 찾으세요. 각 스킬에는 자세한 문서와 예제가 함께 제공됩니다.",
    "guide.step1.tip1": "필터를 사용하여 결과 좁히기",
    "guide.step1.tip2": "평점과 리뷰 확인",
    "guide.step1.tip3": "문서 읽기",
    "guide.step2.title": "스킬 설치",
    "guide.step2.description":
      "스킬 페이지에서 설치 명령을 복사하여 Claude Code 터미널에서 실행하세요. 설치는 즉시 이루어지며 추가 구성이 필요 없습니다.",
    "guide.step2.tip1": "Claude Code가 실행 중인지 확인",
    "guide.step2.tip2": "터미널 권한 확인",
    "guide.step2.tip3": "설치 성공 확인",
    "guide.step3.title": "스킬 사용",
    "guide.step3.description":
      "설치되면 스킬을 즉시 사용할 수 있습니다. Claude Code 명령을 통해 호출하거나 작업과 관련이 있을 때 Claude가 제안하도록 하세요.",
    "guide.step3.tip1": "먼저 예제 시도",
    "guide.step3.tip2": "사용 가능한 모든 옵션 탐색",
    "guide.step3.tip3": "사용 팁 읽기",
    "guide.step4.title": "사용자 지정 및 확장",
    "guide.step4.description":
      "대부분의 스킬은 매개변수 및 구성 파일을 통한 사용자 지정을 지원합니다. 고급 사용자는 스킬을 포크하고 특정 요구 사항에 맞게 수정할 수 있습니다.",
    "guide.step4.tip1": "구성 옵션 확인",
    "guide.step4.tip2": "개선 사항 기여",
    "guide.step4.tip3": "사용자 지정 공유",
    "guide.proTips.title": "전문가 팁",
    "guide.proTips.tip1": "인기 있는 스킬부터 시작하여 플랫폼에 익숙해지세요",
    "guide.proTips.tip2":
      "커뮤니티 Discord에 참여하여 도움을 받고 경험을 공유하세요",
    "guide.proTips.tip3":
      "새 버전을 정기적으로 확인하여 스킬을 최신 상태로 유지하세요",
    "guide.proTips.tip4": "여러 스킬을 결합하여 강력한 워크플로 만들기",

    // Benefits Page
    "benefits.hero.title": "왜 ClaudeHub를 선택하나요?",
    "benefits.hero.subtitle": "검증되고 커뮤니티 기반 솔루션으로 개발 가속화",
    "benefits.intro.title": "현대 개발자를 위한 현명한 선택",
    "benefits.intro.subtitle":
      "오늘날의 빠른 속도의 개발 세계에서 효율성이 전부입니다. ClaudeHub는 수천 명의 개발자의 집단적 지혜를 활용하여 더 나은, 더 빠른, 더 스마트한 빌드를 가능하게 합니다.",
    "benefits.benefit1.title": "개발 시간 절약",
    "benefits.benefit1.description":
      "보일러플레이트를 건너뛰고 중요한 것에 집중하세요. 사전 구축된 스킬은 몇 시간의 설정과 구성을 제거하여 더 빠르게 기능을 제공할 수 있게 합니다.",
    "benefits.benefit1.stat": "80% 더 빠른",
    "benefits.benefit1.statLabel": "개발 속도",
    "benefits.benefit2.title": "검증된 품질",
    "benefits.benefit2.description":
      "모든 스킬은 우리 커뮤니티에서 검토, 테스트 및 유지 관리됩니다. 집단적 전문 지식의 혜택을 받고 일반적인 함정을 피하세요.",
    "benefits.benefit2.stat": "100%",
    "benefits.benefit2.statLabel": "코드 검토됨",
    "benefits.benefit3.title": "강력한 커뮤니티",
    "benefits.benefit3.description":
      "ClaudeHub로 빌드하는 수천 명의 개발자와 함께하세요. 지원을 받고, 지식을 공유하고, 성장하는 생태계에 기여하세요.",
    "benefits.benefit3.stat": "10K+",
    "benefits.benefit3.statLabel": "활성 개발자",
    "benefits.benefit4.title": "안전하고 신뢰할 수 있음",
    "benefits.benefit4.description":
      "모든 스킬은 보안 모범 사례를 따르며 정기적으로 업데이트됩니다. 신뢰할 수 있고 감사된 코드로 프로젝트를 안전하게 유지하세요.",
    "benefits.benefit4.stat": "99.9%",
    "benefits.benefit4.statLabel": "가동 시간 보장",
    "benefits.benefit5.title": "최첨단 AI",
    "benefits.benefit5.description":
      "특화된 스킬을 통해 최신 Claude AI 기능을 활용하세요. 연구 오버헤드 없이 AI 혁신의 최전선에 머무르세요.",
    "benefits.benefit5.stat": "최신",
    "benefits.benefit5.statLabel": "AI 모델",
    "benefits.benefit6.title": "지속적인 성장",
    "benefits.benefit6.description":
      "매주 새로운 스킬이 추가됩니다. 플랫폼은 귀하의 필요에 따라 진화하여 항상 최신 도구와 기술에 액세스할 수 있도록 합니다.",
    "benefits.benefit6.stat": "50+",
    "benefits.benefit6.statLabel": "월별 새 스킬",
    "benefits.testimonials.title": "전 세계 개발자가 사랑합니다",
    "benefits.testimonial1.quote":
      "ClaudeHub는 Claude로 빌드하는 방식을 변화시켰습니다. 며칠이 걸리던 일이 이제는 몇 시간이면 됩니다.",
    "benefits.testimonial1.author": "Sarah Chen",
    "benefits.testimonial1.role": "시니어 개발자",
    "benefits.testimonial2.quote":
      "품질과 문서가 뛰어납니다. 프로덕션에서 이러한 스킬을 신뢰할 수 있습니다.",
    "benefits.testimonial2.author": "Michael Rodriguez",
    "benefits.testimonial2.role": "테크 리드",
    "benefits.testimonial3.quote":
      "이 커뮤니티의 일원이 되어 학습이 가속화되고 더 나은 개발자가 되었습니다.",
    "benefits.testimonial3.author": "Aisha Patel",
    "benefits.testimonial3.role": "풀스택 엔지니어",

    // Search Bar
    "searchBar.placeholder": "어떤 기술이 필요하신가요?",
    "searchBar.hint": "엔터 키를 눌러 탐색",
  },
  en: {
    // Header
    "header.home": "Home",
    "header.skills": "Discover",
    "header.categories": "Categories",
    "header.search.placeholder": "Search posts, skills, and more...",
    "header.search.minChars": "Type at least 2 characters to search",
    "header.search.noResults": "No results found",
    "header.search.tryDifferent": "Try different keywords",
    "header.search.featured": "Featured",

    // Home
    "home.subtitle": "Vibe Coding Community",
    "home.description": "Share new development experiences with AI and grow together",

    // Explore
    "explore.title": "Explore Skills",
    "explore.subtitle": "Discover and search through all available AI skills",
    "explore.searchPlaceholder":
      "Search skills by name, description, or tags...",
    "explore.filterByCategory": "Filter by Category",
    "explore.all": "All",
    "explore.showing": "Showing",
    "explore.skills": "skills",
    "explore.skill": "skill",
    "explore.in": "in",
    "explore.matching": "matching",
    "explore.noResults": "No skills found",
    "explore.tryAdjusting": "Try adjusting your search or filter criteria",

    // Skills
    "skills.sortBy": "Sort by:",
    "skills.mostPopular": "Most Popular",
    "skills.mostViewed": "Most Viewed",
    "skills.name": "Name",
    "skills.view": "View:",
    "skills.featuredSkills": "Featured Skills",
    "skills.allSkills": "All Skills",

    // Categories
    "categories.title": "Browse by Category",
    "categories.subtitle":
      "Explore skills organized by {count} different categories",
    "categories.skillCount": "{count} skills",
    "categories.backToAll": "← Back to all categories",
    "categories.inCategory": "{count} skills in this category",

    // Skill Detail
    "skillDetail.notFound": "Skill not found",
    "skillDetail.backToSkills": "Back to Skills",
    "skillDetail.download": "Download",
    "skillDetail.github": "GitHub",
    "skillDetail.share": "Share",
    "skillDetail.reviews": "reviews",
    "skillDetail.whatIsIt.title": "What is it?",
    "skillDetail.howToUse.title": "How to Use",
    "skillDetail.keyFeatures.title": "Key Features",
    "skillDetail.liked": "Liked",
    "skillDetail.like": "Like",

    // Comments
    "comments.section.title": "Comments",
    "comments.section.subtitle": "Share your thoughts about this skill",
    "comments.section.addComment": "Add a comment",
    "comments.section.signInPrompt": "Sign in to leave a comment",
    "comments.section.signInButton": "Sign In",
    "comments.section.loadError": "Error loading comments",
    "comments.form.placeholder": "Write your comment...",
    "comments.form.emptyError": "Please enter a comment",
    "comments.form.tooLongError": "Comment cannot exceed 2000 characters",
    "comments.form.submitError": "Error submitting comment",
    "comments.form.submit": "Post Comment",
    "comments.form.update": "Update",
    "comments.form.cancel": "Cancel",
    "comments.form.reply": "Reply",
    "comments.form.ratingLabel": "Rate this skill",
    "comments.form.ratingRequired": "Please select a rating",
    "comments.form.alreadyCommented":
      "You have already commented on this skill",
    "comments.list.noComments": "No comments yet",
    "comments.list.beFirst": "Be the first to comment!",
    "comments.item.edited": "Edited",
    "comments.item.edit": "Edit",
    "comments.item.delete": "Delete",
    "comments.item.deleteConfirm":
      "Are you sure you want to delete this comment?",
    "comments.item.reply": "Reply",

    // Common
    "common.loginRequired": "Login required",
    "common.linkCopied": "Link copied to clipboard",

    // Inquiry
    "inquiry.title": "Contact Us",
    "inquiry.name": "Name",
    "inquiry.email": "Email",
    "inquiry.typeLabel": "Inquiry Type",
    "inquiry.message": "Message",
    "inquiry.submit": "Send Inquiry",
    "inquiry.cancel": "Cancel",
    "inquiry.close": "Close",
    "inquiry.success":
      "Your inquiry has been submitted successfully. We will respond shortly.",
    "inquiry.error":
      "An error occurred while sending your inquiry. Please try again.",
    "inquiry.signInRequired": "Please sign in to send an inquiry.",
    "inquiry.signIn": "Sign in with Google",
    "inquiry.type.general": "General Inquiry",
    "inquiry.type.bug": "Bug Report",
    "inquiry.type.feature": "Feature Request",
    "inquiry.type.partnership": "Partnership",
    "inquiry.type.other": "Other",

    // Feature Boxes
    "features.whatIs.title": "What are Claude Skills?",
    "features.whatIs.description":
      "A curated collection designed to supercharge your productivity and creativity on Claude AI",
    "features.howToUse.title": "Getting Started",
    "features.howToUse.description":
      "Seamless integration. Install and deploy to your workflow in seconds.",
    "features.whyUse.title": "Why Claude Hub?",
    "features.whyUse.description":
      "Stop Copy-Pasting. Leverage expert-level AI workflows without the manual grind.",

    // Discover Section
    "discover.title": "Discover Featured Skills",
    "discover.subtitle": "Explore our curated selection of powerful AI skills",
    "discover.moreSkills.title": "Discover More Amazing Skills",
    "discover.moreSkills.subtitle":
      "Explore other skills that might interest you",

    // About Page - What is Claude Skill
    "about.hero.title": "What is Claude Skill?",
    "about.hero.subtitle": "Tools that AI can use",

    "about.whatIs.title": "What is Claude Skill?",
    "about.whatIs.subtitle": "Tools that AI can use",
    "about.whatIs.description":
      "Claude Skills are expert knowledge packages that extend Claude AI's capabilities for specific tasks.",
    "about.whatIs.analogy":
      "Just like installing apps on your smartphone, adding skills to Claude enables more professional and accurate task execution.",

    "about.why.title": "Why do we need Claude Skills?",
    "about.why.intro":
      "Claude is smart by default, but specific tasks require detailed guidelines. For example,",
    "about.why.example1":
      "Creating Word documents: What format should be used? Which fonts? Margins? Tone?",
    "about.why.example2":
      "Making presentations: How should slide layouts be structured? Where should the company logo go?",
    "about.why.example3":
      "Working with spreadsheets: How to handle formulas, and organize data?",
    "about.why.conclusion":
      "Claude Skills are manuals containing expert know-how and best practices. Claude reads the skill and performs tasks like an expert in that field.",

    "about.example.title": "Real Example",
    "about.example.intro": "Let's take a document writing skill as an example.",
    "about.example.withoutSkill":
      "Without a skill, Claude can only create basic Word documents. But with a document writing skill,",
    "about.example.feature1": "Apply professional formatting and styles",
    "about.example.feature2":
      "Auto-generate table of contents and page numbers",
    "about.example.feature3": "Proper placement of tables and images",
    "about.example.feature4": "Track document editing history",
    "about.example.conclusion":
      "All of this can be handled with high quality and accuracy.",
    "about.example.before": "Before",
    "about.example.after": "With Claude Skills",

    "about.create.title": "Anyone can create skills",
    "about.create.subtitle": "Claude Skills are manuals on how to do the work.",
    "about.create.description":
      "The greatest advantage of Claude Skills is that anyone can create them. If you're an expert in a specific field, you can turn your knowledge into a skill and share it with others. Designers, marketers, teachers, researchers - everyone can create skills with their expertise.",

    "about.hub.title": "Problems Claude Hub Solves",
    "about.hub.problem":
      "As Claude Skills multiply, it becomes difficult to know which skills are good and trustworthy. Using unverified skills may not give you the results you want, or may even make your work more complicated.",
    "about.hub.solution": "Claude Hub is different",
    "about.hub.description":
      "Claude Hub is a verified skill library built together by the community.",

    "about.hub.feature1.title": "Reliability Verification",
    "about.hub.feature1.description":
      "Through user reviews and ratings, only skills that actually work well are recommended. You can check real reviews from people who have used them.",
    "about.hub.feature2.title": "Systematic Classification",
    "about.hub.feature2.description":
      "Skills are easy to find by purpose - for work, creation, learning, etc. You can discover the skills you need with just a few clicks.",
    "about.hub.feature3.title": "Community Wisdom",
    "about.hub.feature3.description":
      "Various users share skills, exchange improvement ideas, and create better skills together. You might learn usage methods you couldn't have thought of alone.",
    "about.hub.feature4.title": "Practical Usage Guide",
    "about.hub.feature4.description":
      "Not just providing skills, but also detailed and friendly guides on how to use them and in what situations they're useful.",

    "about.forEveryone.title": "A Skill Hub for Everyone",
    "about.forEveryone.description":
      "Claude Hub is a space not only for developers but also for general users. We help you find the skills you need and make the most of Claude's capabilities without complex technical knowledge.",
    "about.forEveryone.cta":
      "Want to work smarter with Claude in the AI era? Meet verified skills at Claude Hub.",

    // Diagram labels
    "about.diagram.user": "User",
    "about.diagram.ai": "AI",
    "about.diagram.skill": "Document Writing Skill",
    "about.diagram.request": "Write quarterly report.",
    "about.diagram.skillRef": "Let me check the document writing skill",
    "about.diagram.result.simple":
      "Perfect results without lengthy explanations",
    "about.diagram.result.unified":
      "Consistent and accurate document format every time",
    "about.diagram.result.tracking": "Different results every time",
    "about.diagram.result.different":
      "Documents that don't match company format",
    "about.diagram.result.history": "No document editing history",

    // Guide Page
    "guide.hero.title": "How to Use ClaudeHub",
    "guide.hero.subtitle":
      "Get started in minutes with our simple installation process",
    "guide.toggle.claudeAI": "Claude AI",
    "guide.toggle.claudeAI.subtitle": "The Simplest",
    "guide.toggle.claudeAI.description": "For general Claude AI users",
    "guide.toggle.claudeCode": "Claude Code",
    "guide.toggle.claudeCode.subtitle": "For All Developers",
    "guide.toggle.claudeCode.description": "Developers using Claude Code",
    "guide.toggle.claudeAPI": "Claude API",
    "guide.toggle.claudeAPI.subtitle": "For Service Providers",
    "guide.toggle.claudeAPI.description": "Make your service smarter",
    "guide.toggle.claudeAgenticSDK": "Claude Agentic SDK",
    "guide.toggle.claudeAgenticSDK.subtitle": "For AI Agent Developers",
    "guide.toggle.claudeAgenticSDK.description":
      "Build more professional AI agents",
    "guide.content.claudeAI.title": "Claude AI User",
    "guide.content.claudeAI.alert.before": "You must be a paid user of ",
    "guide.content.claudeAI.alert.after": " (Pro or higher).",
    "guide.content.claudeAI.selectSkills": "Select Skills",
    "guide.content.claudeAI.findSkill": "Found the skill you want?",
    "guide.content.claudeAI.findSkillDesc1": "Press the",
    "guide.content.claudeAI.findSkillDesc2":
      "button next to the skill to download a zip file.",
    "guide.content.claudeAI.addSkill": "Add the skill",
    "guide.content.claudeAI.addSkillStep1": "Go to claude.ai.",
    "guide.content.claudeAI.addSkillStep2":
      "Select your profile at the bottom left.",
    "guide.content.claudeAI.addSkillStep3": 'Select "Settings".',
    "guide.content.claudeAI.addSkillStep4": 'Select the "Features" tab.',
    "guide.content.claudeAI.addSkillStep5": "Scroll down.",
    "guide.content.claudeAI.addSkillStep6": 'Press the "Upload Skill" button.',
    "guide.content.claudeAI.addSkillStep7": "Add the skill you downloaded.",
    "guide.content.claudeAI.addSkillStep8":
      "Now Claude can use the skill in all chats. 👏",
    "guide.content.claudeAI.addSkillAlert":
      "Can't add the skill? Skills that are already added cannot be added again. Also, some skills (Anthropic supported) are added by default.",
    "guide.content.claudeAI.faq": "FAQ",
    "guide.content.claudeAI.faq1Q": "Are skills used automatically?",
    "guide.content.claudeAI.faq1A":
      "Yes! Claude selects and uses the necessary skills on its own. You can also command it to use a specific skill.",
    "guide.content.claudeAI.faq2Q": "Can I confirm if a skill was used?",
    "guide.content.claudeAI.faq2A":
      'You can check if a skill was used in Claude\'s response. A message saying "using ~skill" will appear.',
    "guide.content.claudeAI.faq3Q": "The skill I added is not reflected.",
    "guide.content.claudeAI.faq3A":
      'After adding a skill, please start a new conversation through "New Chat". Existing conversations may not recognize newly added skills.',
    "guide.content.lastEdit": "Last edited",
    "guide.content.requestFix": "Request Fix",
    "guide.intro.title": "Getting Started is Easy",
    "guide.intro.subtitle":
      "Follow these simple steps to start using ClaudeHub in your projects. No complex setup or configuration required - just install and use!",
    "guide.step1.title": "Find a Skill",
    "guide.step1.description":
      "Browse through our organized categories or use the search bar to find the perfect skill for your needs. Each skill comes with detailed documentation and examples.",
    "guide.step1.tip1": "Use filters to narrow down results",
    "guide.step1.tip2": "Check ratings and reviews",
    "guide.step1.tip3": "Read the documentation",
    "guide.step2.title": "Install the Skill",
    "guide.step2.description":
      "Copy the install command from the skill page and run it in your Claude Code terminal. Installation is instant and requires no additional configuration.",
    "guide.step2.tip1": "Ensure Claude Code is running",
    "guide.step2.tip2": "Check terminal permissions",
    "guide.step2.tip3": "Verify successful installation",
    "guide.step3.title": "Use the Skill",
    "guide.step3.description":
      "Once installed, the skill is immediately available to use. Invoke it through Claude Code commands or let Claude suggest it when relevant to your task.",
    "guide.step3.tip1": "Try examples first",
    "guide.step3.tip2": "Explore all available options",
    "guide.step3.tip3": "Read usage tips",
    "guide.step4.title": "Customize & Extend",
    "guide.step4.description":
      "Most skills support customization through parameters and configuration files. Advanced users can fork skills and modify them for specific needs.",
    "guide.step4.tip1": "Check configuration options",
    "guide.step4.tip2": "Contribute improvements",
    "guide.step4.tip3": "Share your customizations",
    "guide.proTips.title": "Pro Tips",
    "guide.proTips.tip1":
      "Start with popular skills to get familiar with the platform",
    "guide.proTips.tip2":
      "Join the community Discord for help and to share your experiences",
    "guide.proTips.tip3":
      "Keep skills updated by regularly checking for new versions",
    "guide.proTips.tip4":
      "Combine multiple skills to create powerful workflows",

    // Benefits Page
    "benefits.hero.title": "Why Choose ClaudeHub?",
    "benefits.hero.subtitle":
      "Accelerate your development with proven, community-driven solutions",
    "benefits.intro.title": "The Smart Choice for Modern Developers",
    "benefits.intro.subtitle":
      "In today's fast-paced development world, efficiency is everything. ClaudeHub harnesses the collective wisdom of thousands of developers to help you build better, faster, and smarter.",
    "benefits.benefit1.title": "Save Development Time",
    "benefits.benefit1.description":
      "Skip the boilerplate and focus on what matters. Pre-built skills eliminate hours of setup and configuration, letting you deliver features faster.",
    "benefits.benefit1.stat": "80% Faster",
    "benefits.benefit1.statLabel": "Development Speed",
    "benefits.benefit2.title": "Proven Quality",
    "benefits.benefit2.description":
      "Every skill is reviewed, tested, and maintained by our community. Benefit from collective expertise and avoid common pitfalls.",
    "benefits.benefit2.stat": "100%",
    "benefits.benefit2.statLabel": "Code Reviewed",
    "benefits.benefit3.title": "Powerful Community",
    "benefits.benefit3.description":
      "Join thousands of developers building with ClaudeHub. Get support, share knowledge, and contribute to a growing ecosystem.",
    "benefits.benefit3.stat": "10K+",
    "benefits.benefit3.statLabel": "Active Developers",
    "benefits.benefit4.title": "Secure & Reliable",
    "benefits.benefit4.description":
      "All skills follow security best practices and are regularly updated. Keep your projects safe with trusted, audited code.",
    "benefits.benefit4.stat": "99.9%",
    "benefits.benefit4.statLabel": "Uptime Guarantee",
    "benefits.benefit5.title": "Cutting-Edge AI",
    "benefits.benefit5.description":
      "Leverage the latest Claude AI capabilities through specialized skills. Stay at the forefront of AI innovation without the research overhead.",
    "benefits.benefit5.stat": "Latest",
    "benefits.benefit5.statLabel": "AI Models",
    "benefits.benefit6.title": "Continuous Growth",
    "benefits.benefit6.description":
      "New skills added weekly. The platform evolves with your needs, ensuring you always have access to the latest tools and techniques.",
    "benefits.benefit6.stat": "50+",
    "benefits.benefit6.statLabel": "New Skills Monthly",
    "benefits.testimonials.title": "Loved by Developers Worldwide",
    "benefits.testimonial1.quote":
      "ClaudeHub transformed how I build with Claude. What used to take days now takes hours.",
    "benefits.testimonial1.author": "Sarah Chen",
    "benefits.testimonial1.role": "Senior Developer",
    "benefits.testimonial2.quote":
      "The quality and documentation are outstanding. I trust these skills in production.",
    "benefits.testimonial2.author": "Michael Rodriguez",
    "benefits.testimonial2.role": "Tech Lead",
    "benefits.testimonial3.quote":
      "Being part of this community has accelerated my learning and made me a better developer.",
    "benefits.testimonial3.author": "Aisha Patel",
    "benefits.testimonial3.role": "Full-Stack Engineer",

    // Search Bar
    "searchBar.placeholder": "Find the perfect skill for your challenge",
    "searchBar.hint": "Press Enter to explore",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("ko"); // Default to Korean
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "ko" || savedLang === "en")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
