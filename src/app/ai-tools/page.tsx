'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIToolsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-tools/hub');
  }, [router]);

  return null;
}
