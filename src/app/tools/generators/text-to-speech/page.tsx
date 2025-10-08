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
        description="Convert text to spoken audio."
      />
      <div className="mt-8">
        {isClient ? <GradioWrapper appSrc="https://timemaster-multilingual-tts.hf.space" scriptSrc="https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js" /> : <div>Loading Tool...</div>}
      </div>
    </>
  );
}
