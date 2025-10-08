'use client';

import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';

const GradioWrapper = dynamic(
  () => import('@/components/gradio-wrapper').then((mod) => mod.GradioWrapper),
  { ssr: false }
);


export default function BackgroundRemoverPage() {
  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image using a model from Hugging Face."
      />
      <div className="mt-8">
        <GradioWrapper src="https://timemaster-removebg.hf.space" />
      </div>
    </>
  );
}
