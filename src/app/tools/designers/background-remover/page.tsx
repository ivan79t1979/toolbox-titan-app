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
        theme?: 'light' | 'dark';
      };
    }
  }
}

export default function BackgroundRemoverPage() {
  const { theme } = useTheme();

  useEffect(() => {
    const scriptId = 'gradio-script';
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'module';
    script.src = 'https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // It's generally not recommended to remove scripts,
        // but if cleanup is necessary, this is how you'd do it.
        // document.body.removeChild(existingScript);
      }
    };
  }, []);

  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
    : theme;

  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image using a model from Hugging Face."
      />
      <div className="mt-8">
        <gradio-app
          src="https://timemaster-removebg.hf.space"
          theme={effectiveTheme}
        ></gradio-app>
      </div>
    </>
  );
}
