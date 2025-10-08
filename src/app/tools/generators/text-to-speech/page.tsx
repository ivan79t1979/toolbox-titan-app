'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';
import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function TextToSpeechPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Script
        src="https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js"
        strategy="afterInteractive"
      />
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio using a custom model from Hugging Face."
      />
      <div className="mt-8">
        {isClient && <GradioWrapper src="https://timemaster-multilingual-tts.hf.space" />}
      </div>
    </>
  );
}
