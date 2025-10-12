import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { RhymeFinderForm } from './rhyme-finder-form';

const tool = {
  title: 'Rhyme Finder',
  description: 'Find the perfect rhyming words for your poems, songs, or creative writing with our AI-powered rhyme generator.',
  path: '/tools/writers/rhyme-finder',
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

export default function RhymeFinderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Rhyme Finder"
        description="Find the perfect rhyme for your poems, songs, or creative writing."
      />
      <RhymeFinderForm />
    </>
  );
}
