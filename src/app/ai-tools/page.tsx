'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { HubPageSkeleton } from '@/components/Skeletons';

export default function AIToolsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-tools/hub');
  }, [router]);

  // Show skeleton during redirect instead of blank screen
  return (
    <>
      <Header />
      <HubPageSkeleton />
    </>
  );
}
