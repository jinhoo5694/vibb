import { Header } from '@/components/Layout/Header';
import { NewsPageSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <NewsPageSkeleton />
    </>
  );
}
