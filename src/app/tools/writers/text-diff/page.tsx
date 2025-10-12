import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TextDiffForm } from './text-diff-form';

const tool = {
  title: 'Text Difference Checker (Diff Tool)',
  description: 'Compare two blocks of text and instantly see the differences highlighted. A simple and free online diff tool.',
  path: '/tools/writers/text-diff',
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

export default function TextDiffPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Text Diff"
        description="Compare two texts and highlight differences."
      />
      <TextDiffForm />
    </>
  );
}
