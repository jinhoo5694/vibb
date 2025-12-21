import { Header } from '@/components/Layout/Header';
import { HubPageSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <HubPageSkeleton />
    </>
  );
}
