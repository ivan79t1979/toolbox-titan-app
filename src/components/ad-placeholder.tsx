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
    if (typeof window !== 'undefined' && containerRef.current) {
      // Clear existing content to prevent duplicates during re-renders
      containerRef.current.innerHTML = '';
      
      let zoneId = '';
      if (width === 728 && height === 90) {
        zoneId = '11031670';
      } else if (width === 300 && height === 250) {
        zoneId = '11031690';
      }

      if (zoneId) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = `
          if (window.aclib) {
            aclib.runBanner({
              zoneId: '${zoneId}',
            });
          }
        `;
        containerRef.current.appendChild(script);
      }
    }
  }, [width, height]);

  // Only allow 728x90 and 300x250 banners
  if (!((width === 728 && height === 90) || (width === 300 && height === 250))) {
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
