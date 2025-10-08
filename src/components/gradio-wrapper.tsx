
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
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const getSystemTheme = () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = theme === 'system' ? getSystemTheme() : theme || 'light';
    setEffectiveTheme(currentTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setEffectiveTheme(getSystemTheme());
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return (
    <>
      <Script
        type="module"
        src="https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js"
        strategy="lazyOnload"
      />
      <gradio-app src={src} theme={effectiveTheme}></gradio-app>
    </>
  );
}
