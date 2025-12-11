'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromptPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/prompt/hub');
  }, [router]);

  return null;
}
