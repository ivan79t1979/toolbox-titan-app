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

export function GradioWrapper({ appSrc, scriptSrc }: { appSrc: string, scriptSrc: string }) {
  const { theme } = useTheme();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const scriptId = `gradio-script-${scriptSrc}`;
    if (document.getElementById(scriptId)) {
      setIsScriptLoaded(true);
      return;
    }

    // Clean up any old script versions
    document.querySelectorAll('script[id^="gradio-script-"]').forEach(el => el.remove());

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'module';
    script.src = scriptSrc;
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
  }, [scriptSrc]);

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
      src={appSrc}
      theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
    ></gradio-app>
  );
}
