'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type AdPlaceholderProps = {
  width: number;
  height: number;
  className?: string;
  adCode?: string;
};

export function AdPlaceholder({
  width,
  height,
  className,
}: AdPlaceholderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only handle the 728x90 banners as requested
    if (width === 728 && height === 90 && typeof window !== 'undefined' && containerRef.current) {
      // Clear existing content to prevent duplicates during re-renders
      containerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // Injected script text provided by the user
      script.text = `
        if (window.aclib) {
          aclib.runBanner({
            zoneId: '11031670',
          });
        }
      `;
      containerRef.current.appendChild(script);
    }
  }, [width, height]);

  // Keep other banner sizes (like 300x250) hidden as per previous "hide advertising" instruction.
  if (width !== 728 || height !== 90) {
    return null;
  }

  return (
    <div className="flex justify-center w-full">
      <div
        ref={containerRef}
        className={cn('overflow-hidden', className)}
        style={{ width, height, minWidth: width, minHeight: height }}
      />
    </div>
  );
}
