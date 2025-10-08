'use client';

import { PageHeader } from '@/components/page-header';
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

export default function BackgroundRemoverPage() {
  const { theme } = useTheme();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const newTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
      : theme;
    setEffectiveTheme(newTheme);
  }, [theme]);

  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image using a model from Hugging Face."
      />
      <Script
        id="gradio-script"
        src="https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js"
        strategy="afterInteractive"
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
