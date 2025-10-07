'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UuidGeneratorForm() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { toast } = useToast();

  const generateUuids = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  }, [count]);

  const handleCopy = () => {
    if (uuids.length === 0) return;
    const textToCopy = uuids.join('\n');
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to clipboard!',
      description: `${uuids.length} UUID(s) have been copied.`,
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Generate UUIDs</CardTitle>
        <CardDescription>
          Create universally unique identifiers (v4).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-grow space-y-2">
            <Label htmlFor="uuid-count">Number of UUIDs</Label>
            <Input
              id="uuid-count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="max-w-xs"
            />
          </div>
          <Button onClick={generateUuids} size="lg">
            <RefreshCw className="mr-2 h-5 w-5" /> Generate
          </Button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                 <Label htmlFor="results">Generated UUID(s)</Label>
                 <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!uuids.length}>
                    <Copy className="mr-2 h-4 w-4" /> Copy All
                </Button>
            </div>
            <Textarea
              id="results"
              readOnly
              value={uuids.join('\n')}
              className="h-64 font-mono text-sm"
              placeholder="Your generated UUIDs will appear here."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
