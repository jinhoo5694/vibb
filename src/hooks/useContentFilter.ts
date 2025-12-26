'use client';

import { useState, useCallback } from 'react';
import { checkContentForProfanity } from '@/services/profanityFilter';

interface ContentFilterResult {
  isValid: boolean;
  errorMessage: string | null;
  foundWords: string[];
}

interface UseContentFilterReturn {
  validateField: (content: string, fieldName?: string) => Promise<ContentFilterResult>;
  validateMultipleFields: (fields: { content: string; fieldName: string }[]) => Promise<ContentFilterResult>;
  isValidating: boolean;
}

/**
 * Hook for validating content against profanity filter
 * Uses glin-profanity library with English and Korean support via API
 */
export function useContentFilter(): UseContentFilterReturn {
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(async (content: string, fieldName: string = '내용'): Promise<ContentFilterResult> => {
    if (!content.trim()) {
      return { isValid: true, errorMessage: null, foundWords: [] };
    }

    setIsValidating(true);

    try {
      const result = await checkContentForProfanity(content);

      if (result.containsProfanity) {
        return {
          isValid: false,
          errorMessage: `${fieldName}에 사용할 수 없는 단어가 포함되어 있습니다.`,
          foundWords: result.profaneWords,
        };
      }

      return { isValid: true, errorMessage: null, foundWords: [] };
    } catch (error) {
      console.error('Error validating content:', error);
      // On error, allow the content (fail open)
      return { isValid: true, errorMessage: null, foundWords: [] };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateMultipleFields = useCallback(async (fields: { content: string; fieldName: string }[]): Promise<ContentFilterResult> => {
    setIsValidating(true);

    try {
      for (const field of fields) {
        if (!field.content.trim()) continue;

        const result = await checkContentForProfanity(field.content);

        if (result.containsProfanity) {
          return {
            isValid: false,
            errorMessage: `${field.fieldName}에 사용할 수 없는 단어가 포함되어 있습니다.`,
            foundWords: result.profaneWords,
          };
        }
      }

      return { isValid: true, errorMessage: null, foundWords: [] };
    } catch (error) {
      console.error('Error validating content:', error);
      return { isValid: true, errorMessage: null, foundWords: [] };
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validateField,
    validateMultipleFields,
    isValidating,
  };
}
