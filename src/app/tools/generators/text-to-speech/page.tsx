'use client';

import { PageHeader } from '@/components/page-header';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { GradioWrapper } from '@/components/gradio-wrapper';

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
        <Script
          src="https://gradio.s3-us-west-2.amazonaws.com/5.25.1/gradio.js"
          strategy="lazyOnload"
        />
        {isClient && (
          <GradioWrapper src="https://timemaster-multilingual-tts.hf.space" />
        )}
      </div>
    </>
  );
}
