'use client';

import { PageHeader } from '@/components/page-header';
import Script from 'next/script';
import { useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradio-app': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
      };
    }
  }
}

const GRADIO_SCRIPT_URL = 'https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js';

export default function BackgroundRemoverPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  return (
    <>
      <Script 
        src={GRADIO_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <PageHeader
        title="Background Remover"
      />
      <div className="mt-8">
        {isScriptLoaded ? (
          <gradio-app src="https://timemaster-removebg.hf.space"></gradio-app>
        ) : (
          <div>Loading Tool...</div>
        )}
      </div>
    </>
  );
}
