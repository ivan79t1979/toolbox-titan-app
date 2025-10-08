'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';


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
