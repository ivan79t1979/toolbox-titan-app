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
        description="Convert text into spoken audio."
      />
      <div className="mt-8">
        {isClient ? <GradioWrapper appSrc="https://huggingface-projects-text-to-speech-2.hf.space" scriptSrc="https://gradio.s3-us-west-2.amazonaws.com/5.35.0/gradio.js" /> : <div>Loading Tool...</div>}
      </div>
    </>
  );
}
