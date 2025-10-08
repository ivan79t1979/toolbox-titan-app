'use client';

import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';
import { useEffect, useState } from 'react';

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
        {isClient ? <GradioWrapper src="https://timemaster-removebg.hf.space" /> : <div>Loading Tool...</div>}
      </div>
    </>
  );
}
