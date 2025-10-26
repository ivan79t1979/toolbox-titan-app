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

    const gradioVersion = scriptSrc.split('/')[4];
    if (!gradioVersion) return;
    
    const cssUrl = `https://gradio.s3-us-west-2.amazonaws.com/${gradioVersion}/gradio.css`;
    const cssLinkId = `gradio-css-${gradioVersion}`;

    if (!document.getElementById(cssLinkId)) {
      const link = document.createElement('link');
      link.id = cssLinkId;
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'module';
    script.src = scriptSrc;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error(`Gradio script failed to load: ${scriptSrc}`);
    };

    document.head.appendChild(script);

  }, [scriptSrc]);

  const effectiveTheme =
    theme === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  if (!isScriptLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading Tool...
      </div>
    );
  }

  return (
    <gradio-app
      key={`${appSrc}-${effectiveTheme}`}
      src={appSrc}
      theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
    ></gradio-app>
  );
}
