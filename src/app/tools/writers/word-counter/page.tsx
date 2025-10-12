import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { WordCounterForm } from './word-counter-form';

const tool = {
  title: 'Word Counter',
  description: 'An online tool to count words, characters, sentences, and paragraphs in your text. Perfect for writers, students, and professionals.',
  path: '/tools/writers/word-counter',
};

export const metadata: Metadata = {
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

export default function WordCounterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Word Counter"
        description="Count words, characters, sentences, and paragraphs in your text."
      />
      <WordCounterForm />
    </>
  );
}
