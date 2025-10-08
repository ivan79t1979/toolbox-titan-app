'use client';

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
        theme_mode?: 'light' | 'dark';
      };
    }
  }
}

export function GradioWrapper({ src }: { src: string }) {
  const { theme } = useTheme();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const effectiveTheme =
    theme === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <>
      <Script
        src="https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js"
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
      />
      {isScriptLoaded && (
        <gradio-app
          src={src}
          theme_mode={effectiveTheme === 'dark' ? 'dark' : 'light'}
        ></gradio-app>
      )}
    </>
  );
}
