'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MCPPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/mcp/hub');
  }, [router]);

  return null;
}
