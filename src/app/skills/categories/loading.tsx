import { Header } from '@/components/Layout/Header';
import { ExplorePageSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <ExplorePageSkeleton />
    </>
  );
}
