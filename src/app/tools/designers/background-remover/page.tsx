'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';
import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function BackgroundRemoverPage() {
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
        title="Background Remover"
        description="Removes the background from an image using a model from Hugging Face."
      />
      <div className="mt-8">
        {isClient && <GradioWrapper src="https://timemaster-removebg.hf.space" />}
      </div>
    </>
  );
}
