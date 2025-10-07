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

const GRADIO_SCRIPT_URL = 'https://gradio.s3-us-west-2.amazonaws.com/4.36.0/gradio.js';

export default function BackgroundRemoverPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const scriptId = 'gradio-script';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'module';
        script.src = GRADIO_SCRIPT_URL;
        script.onload = () => {
          setIsClient(true);
        }
        document.head.appendChild(script);
    } else {
        setIsClient(true);
    }

    return () => {
        const script = document.getElementById(scriptId);
        if (script) {
            // To prevent conflicts, we might want to remove the script,
            // but since multiple pages might use it, we leave it.
            // If issues arise, a more complex script management would be needed.
        }
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Background Remover"
      />
      <div className="mt-8">
        {isClient ? (
          <gradio-app src="https://timemaster-removebg.hf.space"></gradio-app>
        ) : (
          <div>Loading Tool...</div>
        )}
      </div>
    </>
  );
}
