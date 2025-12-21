import { Header } from '@/components/Layout/Header';
import { SkillDetailSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <SkillDetailSkeleton />
    </>
  );
}
