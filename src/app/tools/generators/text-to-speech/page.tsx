
'use client';

import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';

const GradioWrapper = dynamic(
  () => import('@/components/gradio-wrapper').then((mod) => mod.GradioWrapper),
  { 
    ssr: false,
    loading: () => <p>Loading tool...</p>
  }
);

export default function TextToSpeechPage() {
  return (
    <>
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio using a custom model from Hugging Face."
      />
      <div className="mt-8">
        <GradioWrapper src="https://timemaster-multilingual-tts.hf.space" />
      </div>
    </>
  );
}
