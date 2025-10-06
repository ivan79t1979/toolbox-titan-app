'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Type, WholeWord, Baseline } from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).filter(Boolean) : [];
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const paragraphs = text.split(/\n+/).filter(Boolean);

    return {
      words: words.length,
      characters,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
    };
  }, [text]);

  return (
    <div>
      <PageHeader
        title="Word Counter"
        description="Count words, characters, sentences, and paragraphs in your text."
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Textarea
            placeholder="Type or paste your text here..."
            className="h-96 min-h-[400px] text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words</CardTitle>
              <WholeWord className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.words}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Characters</CardTitle>
              <Type className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.characters}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sentences</CardTitle>
              <Baseline className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sentences}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paragraphs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paragraphs}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
