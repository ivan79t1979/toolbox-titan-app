'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';

export default function BackgroundRemoverPage() {
  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image."
      />
      <div className="mt-8">
        <GradioWrapper appSrc="https://timemaster-background-remover-c1.hf.space" scriptSrc="https://gradio.s3-us-west-2.amazonaws.com/5.35.0/gradio.js" />
      </div>
    </>
  );
}
