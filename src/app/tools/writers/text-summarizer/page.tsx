import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TextSummarizerForm } from './text-summarizer-form';

const tool = {
  title: 'AI Text Summarizer',
  description: 'Condense long articles, papers, or documents into concise, easy-to-digest summaries with our free AI-powered tool.',
  path: '/tools/writers/text-summarizer',
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
  applicationCategory: 'Productivity',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function TextSummarizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Text Summarizer"
        description="Condense long articles, papers, or documents into key points with AI."
      />
      <TextSummarizerForm />
    </>
  );
}
