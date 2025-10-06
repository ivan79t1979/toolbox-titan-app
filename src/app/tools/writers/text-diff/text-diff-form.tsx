'use client';

import { useState, useMemo } from 'react';
import { diffChars } from 'diff';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TextDiffForm() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const diffResult = useMemo(() => {
    const differences = diffChars(text1, text2);
    return differences.map((part, index) => {
      const color = part.added
        ? 'bg-green-500/20'
        : part.removed
        ? 'bg-red-500/20'
        : 'bg-transparent';
      return (
        <span key={index} className={color}>
          {part.value}
        </span>
      );
    });
  }, [text1, text2]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Enter text 1 here..."
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="h-80 min-h-[200px] text-base font-mono"
        />
        <Textarea
          placeholder="Enter text 2 here..."
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="h-80 min-h-[200px] text-base font-mono"
        />
      </div>
      <Tabs defaultValue="unified">
        <TabsList>
          <TabsTrigger value="unified">Unified View</TabsTrigger>
        </TabsList>
        <TabsContent value="unified">
          <Card>
            <CardContent className="p-4">
              <div className="h-80 min-h-[200px] overflow-auto whitespace-pre-wrap rounded-md bg-muted/30 p-4 font-mono text-sm">
                {text1 || text2 ? diffResult : <span className="text-muted-foreground">Differences will be shown here.</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
