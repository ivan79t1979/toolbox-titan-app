
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
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Determine the theme on the client
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = theme === 'system' ? getSystemTheme() : theme || 'light';
    setEffectiveTheme(currentTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setEffectiveTheme(getSystemTheme());
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    // Manually inject the script
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
    document.head.appendChild(script);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // Optional: clean up script on unmount, though often not necessary for app-wide scripts
        // document.head.removeChild(existingScript);
      }
    };
  }, [theme]);
  
  if (!isScriptLoaded) {
    return <div>Loading Tool...</div>; // Or a loading spinner
  }

  return <gradio-app src={src} theme={effectiveTheme}></gradio-app>;
}
