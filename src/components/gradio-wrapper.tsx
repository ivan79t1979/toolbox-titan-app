'use client';

import { useTheme } from '@/components/theme-provider';
import Script from 'next/script';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getEffectiveTheme = () => {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return 'light'; // Default for server
    }
    return theme;
  };

  return (
    <>
      <Script
        src="https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js"
        strategy="lazyOnload"
      />
      {isClient && <gradio-app src={src} theme={getEffectiveTheme()}></gradio-app>}
    </>
  );
}
