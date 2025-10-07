'use client';

import { PageHeader } from '@/components/page-header';
import { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradio-app': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
      };
    }
  }
}

export default function BackgroundRemoverPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <PageHeader
        title="Background Remover"
      />
      <div className="mt-8">
        {isClient && (
          <gradio-app src="https://timemaster-removebg.hf.space"></gradio-app>
        )}
      </div>
    </>
  );
}
