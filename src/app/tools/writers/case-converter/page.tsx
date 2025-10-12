import type { Metadata } from 'next';
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tool = {
  title: 'Case Converter',
  description: 'Easily convert text between different letter cases, including UPPER CASE, lower case, Title Case, camelCase, and more.',
  path: '/tools/writers/case-converter',
};

export function generateMetadata(): Metadata {
  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: tool.path,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: tool.path,
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: tool.title,
  description: tool.description,
  applicationCategory: 'Utilities',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};


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
  const toTitleCase = () => {
    if (!text) return;
    const result = text
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setText(result);
  };

  const toCamelCase = () => {
    if (!text) return;
    const result = text
      .toLowerCase()
      .split(/[\s_-]+/)
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');
    setText(result);
  };

  const toPascalCase = () => {
    if (!text) return;
    const result = text
      .toLowerCase()
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    setText(result);
  };
  
  const toSnakeCase = () => {
    if (!text) return;
    const result = text
      .toLowerCase()
      .split(/[\s_-]+/)
      .join('_');
    setText(result);
  }
  
  const toKebabCase = () => {
    if (!text) return;
    const result = text
      .toLowerCase()
      .split(/[\s_-]+/)
      .join('-');
    setText(result);
  }

  const toConstantCase = () => {
    if (!text) return;
    const result = text
      .toUpperCase()
      .split(/[\s_-]+/)
      .join('_');
    setText(result);
  }

  const toAlternatingCase = () => {
    if (!text) return;
    const result = text
      .split('')
      .map((char, index) =>
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Case Converter"
        description="Easily convert text between different letter cases."
      />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={toUpperCase}>UPPER CASE</Button>
          <Button onClick={toLowerCase}>lower case</Button>
          <Button onClick={toTitleCase}>Title Case</Button>
          <Button onClick={toSentenceCase}>Sentence case</Button>
          <Button onClick={toCamelCase}>camelCase</Button>
          <Button onClick={toPascalCase}>PascalCase</Button>
          <Button onClick={toSnakeCase}>snake_case</Button>
          <Button onClick={toKebabCase}>kebab-case</Button>
          <Button onClick={toConstantCase}>CONSTANT_CASE</Button>
          <Button onClick={toAlternatingCase}>aLtErNaTiNg CaSe</Button>
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
