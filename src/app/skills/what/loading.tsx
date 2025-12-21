import { Header } from '@/components/Layout/Header';
import { GenericPageSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <GenericPageSkeleton />
    </>
  );
}
