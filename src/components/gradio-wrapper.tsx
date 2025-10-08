'use client';

import { useTheme } from '@/components/theme-provider';

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

  const effectiveTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <gradio-app
      src={src}
      theme_mode={effectiveTheme}
    ></gradio-app>
  );
}
