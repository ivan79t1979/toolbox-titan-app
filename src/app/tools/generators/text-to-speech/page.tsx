'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';
import { useEffect, useState } from 'react';

export default function TextToSpeechPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio using a custom model from Hugging Face."
      />
      <div className="mt-8">
        {isClient ? <GradioWrapper src="https://timemaster-multilingual-tts.hf.space" /> : <div>Loading Tool...</div>}
      </div>
    </>
  );
}
