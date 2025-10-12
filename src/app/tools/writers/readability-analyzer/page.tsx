import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ReadabilityAnalyzerForm } from './readability-analyzer-form';

const tool = {
  title: 'Readability Analyzer',
  description: 'Analyze your text to gauge its complexity and readability. Get scores from Flesch-Kincaid, Gunning Fog, and more.',
  path: '/tools/writers/readability-analyzer',
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

export default function ReadabilityAnalyzerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Readability Analyzer"
        description="Analyze your text to gauge its complexity and readability."
      />
      <ReadabilityAnalyzerForm />
    </>
  );
}
