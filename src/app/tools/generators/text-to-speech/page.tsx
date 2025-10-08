'use client';

import { PageHeader } from '@/components/page-header';
import { useTheme } from '@/components/theme-provider';
import { useEffect, useRef } from 'react';

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

export default function TextToSpeechPage() {
  const gradioContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js';
    script.async = true;

    // Clear previous script if it exists
    if (gradioContainerRef.current) {
      gradioContainerRef.current.innerHTML = '';
      gradioContainerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup on unmount
      if (gradioContainerRef.current) {
        gradioContainerRef.current.innerHTML = '';
      }
    };
  }, [theme]); // Re-run when theme changes

  return (
    <>
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio using a custom model from Hugging Face."
      />
      <div ref={gradioContainerRef} className="mt-8">
        <gradio-app src="https://timemaster-multilingual-tts.hf.space"></gradio-app>
      </div>
    </>
  );
}
