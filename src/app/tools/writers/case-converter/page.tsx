'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CaseConverterPage() {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const toSentenceCase = () => {
    if (!text) return;
    const lower = text.toLowerCase();
    const result = lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) =>
      c.toUpperCase()
    );
    setText(result);
  };

  const toLowerCase = () => setText(text.toLowerCase());
  const toUpperCase = () => setText(text.toUpperCase());
  const toCapitalizedCase = () => {
    if (!text) return;
    const result = text
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setText(result);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'The converted text has been copied.',
    });
  };

  const handleClear = () => setText('');

  return (
    <div>
      <PageHeader
        title="Case Converter"
        description="Easily convert text between different letter cases."
      />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={toUpperCase}>Upper Case</Button>
          <Button onClick={toLowerCase}>lower case</Button>
          <Button onClick={toCapitalizedCase}>Capitalized Case</Button>
          <Button onClick={toSentenceCase}>Sentence case</Button>
        </div>
        <div className="relative">
          <Textarea
            placeholder="Type or paste your text here..."
            className="h-80 min-h-[300px] pr-24 text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={!text}
              aria-label="Copy text"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={!text}
              aria-label="Clear text"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
