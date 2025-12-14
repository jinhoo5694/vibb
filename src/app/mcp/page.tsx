'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { HubPageSkeleton } from '@/components/Skeletons';

export default function MCPPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/mcp/hub');
  }, [router]);

  // Show skeleton during redirect instead of blank screen
  return (
    <>
      <Header />
      <HubPageSkeleton />
    </>
  );
}
