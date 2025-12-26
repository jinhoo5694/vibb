import { NextRequest, NextResponse } from 'next/server';
import { checkProfanity } from 'glin-profanity';

// Custom Korean profanity list (common words missing from glin-profanity)
const KOREAN_PROFANITY = [
  // Common insults
  '씨발', '시발', '씨빨', '씨팔', '씨바', '시바', 'ㅅㅂ', 'ㅆㅂ',
  '병신', '븅신', 'ㅂㅅ', '빙신',
  '개새끼', '개새끼', '개세끼', '개세키', '개쉐끼', '개쉑', '개색끼', '개색기',
  '새끼', '새기', '쉐끼', '섹끼',
  '지랄', '지럴', 'ㅈㄹ',
  '닥쳐', '닥치', '닥쵸',
  '꺼져', '꺼지',
  '미친', '미친놈', '미친년', '미쳤',
  '또라이', '돌아이',
  '멍청이', '멍청',
  '바보', '븅어', '병어',
  '찐따', '찐다',
  '쓰레기', '쓰래기',
  '년', '놈',
  '애미', '애비', '에미', '에비',
  '느금마', '느금빠', '느그마',
  '조까', '좆까', 'ㅈㄲ',
  '좆', '자지', '보지', '씹',
  '창녀', '창년', '화냥년',
  '걸레', '걸레년',
  // Variations and typos
  '시1발', 'ㅅ1ㅂ', '씨8', '18아',
  '개같은', '개잡',
];

// Check if content contains any custom Korean profanity
function checkKoreanProfanity(content: string): string[] {
  const normalizedContent = content.toLowerCase();
  const foundWords: string[] = [];

  for (const word of KOREAN_PROFANITY) {
    if (normalizedContent.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  }

  return foundWords;
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { containsProfanity: false, profaneWords: [] },
        { status: 200 }
      );
    }

    // Check with glin-profanity library (English + library's Korean)
    const libResult = checkProfanity(content, {
      languages: ['english', 'korean'],
      severityLevels: true,
    });

    // Check with custom Korean profanity list
    const koreanProfanity = checkKoreanProfanity(content);

    // Combine results
    const allProfaneWords = [
      ...(libResult.profaneWords || []),
      ...koreanProfanity,
    ];

    const containsProfanity = libResult.containsProfanity || koreanProfanity.length > 0;

    return NextResponse.json({
      containsProfanity,
      profaneWords: [...new Set(allProfaneWords)], // Remove duplicates
    });
  } catch (error) {
    console.error('Error checking profanity:', error);
    // Fail open - allow content if there's an error
    return NextResponse.json(
      { containsProfanity: false, profaneWords: [] },
      { status: 200 }
    );
  }
}
