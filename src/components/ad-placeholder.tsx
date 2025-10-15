import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

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
  adCode,
}: AdPlaceholderProps) {
  if (adCode) {
    return (
      <div
        style={{ width: `${width}px`, height: `${height}px` }}
        className={className}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground',
        className
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
      }}
    >
      <Megaphone className="h-8 w-8" />
      <div className="text-center">
        <p className="font-bold">Place your add here!</p>
        <p className="text-sm">
          Banner: {width}x{height}
        </p>
      </div>
    </div>
  );
}
