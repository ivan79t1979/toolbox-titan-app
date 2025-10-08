'use client';

import { useTheme } from '@/components/theme-provider';
import { useEffect, useState } from 'react';

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

export function GradioWrapper({ src }: { src: string }) {
  const { theme } = useTheme();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'gradio-script';
    if (document.getElementById(scriptId)) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'module';
    script.src = 'https://gradio.s3-us-west-2.amazonaws.com/5.25.1/gradio.js';
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Gradio script failed to load.');
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // In some strict modes, the script might be removed and re-added.
        // To be safe, we check before removing.
      }
    };
  }, []);

  const effectiveTheme =
    theme === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  if (!isScriptLoaded) {
    return <div>Loading Tool...</div>;
  }

  return (
    <gradio-app
      src={src}
      theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
    ></gradio-app>
  );
}
