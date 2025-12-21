import { Header } from '@/components/Layout/Header';
import { HomePageSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <HomePageSkeleton />
    </>
  );
}
