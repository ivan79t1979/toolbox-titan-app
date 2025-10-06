import { PageHeader } from '@/components/page-header';
import { GradientMakerForm } from './gradient-maker-form';

export default function GradientMakerPage() {
  return (
    <>
      <PageHeader title="Gradient Maker" description="Create beautiful CSS gradients with ease. Customize colors, types, and angles, then copy the code." />
      <GradientMakerForm />
    </>
  );
}
