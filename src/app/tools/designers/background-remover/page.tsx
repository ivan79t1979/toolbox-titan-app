'use client';

import { PageHeader } from '@/components/page-header';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { GradioWrapper } from '@/components/gradio-wrapper';

export default function BackgroundRemoverPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image using a model from Hugging Face."
      />
      <div className="mt-8">
        <Script
          src="https://gradio.s3-us-west-2.amazonaws.com/5.25.1/gradio.js"
          strategy="lazyOnload"
        />
        {isClient && (
          <GradioWrapper src="https://timemaster-removebg.hf.space" />
        )}
      </div>
    </>
  );
}
