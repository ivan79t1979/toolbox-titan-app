'use client';

import { PageHeader } from '@/components/page-header';
import { useTheme } from '@/components/theme-provider';
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

export default function TextToSpeechPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <Script 
        src={GRADIO_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio using a custom model from Hugging Face."
      />
      <div className="mt-8">
        {isScriptLoaded ? (
          <gradio-app key={theme} src="https://timemaster-multilingual-tts.hf.space"></gradio-app>
        ) : (
          <div>Loading Tool...</div>
        )}
      </div>
    </>
  );
}
