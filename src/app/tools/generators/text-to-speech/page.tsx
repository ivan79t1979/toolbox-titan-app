'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';

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
