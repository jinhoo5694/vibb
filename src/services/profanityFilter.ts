'use client';

/**
 * Check if content contains profanity by calling the API
 * Uses glin-profanity library with English and Korean support
 */
export async function checkContentForProfanity(content: string): Promise<{
  containsProfanity: boolean;
  profaneWords: string[];
}> {
  if (!content.trim()) {
    return { containsProfanity: false, profaneWords: [] };
  }

  try {
    const response = await fetch('/api/profanity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to check profanity');
    }

    const result = await response.json();
    return {
      containsProfanity: result.containsProfanity,
      profaneWords: result.profaneWords || [],
    };
  } catch (error) {
    console.error('Error checking profanity:', error);
    // Fail open - allow content if there's an error
    return { containsProfanity: false, profaneWords: [] };
  }
}

/**
 * Validate content and return error message if profanity found
 */
export async function validateContent(
  content: string,
  fieldName: string = '내용'
): Promise<{ valid: boolean; message?: string }> {
  const result = await checkContentForProfanity(content);

  if (result.containsProfanity) {
    return {
      valid: false,
      message: `${fieldName}에 사용할 수 없는 단어가 포함되어 있습니다.`,
    };
  }

  return { valid: true };
}
