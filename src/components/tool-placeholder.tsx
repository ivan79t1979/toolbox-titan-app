import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export function ToolPlaceholder() {
  return (
    <div className="flex h-full min-h-[40vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-fit rounded-full bg-primary/10 p-3">
            <Construction className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline">
            Tool Under Construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This tool is coming soon! We are working hard to bring you the best
            experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
