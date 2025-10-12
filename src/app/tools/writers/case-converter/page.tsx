import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CaseConverterForm } from './case-converter-form';

const tool = {
  title: 'Case Converter',
  description:
    'Easily convert text between different letter cases, including UPPER CASE, lower case, Title Case, camelCase, and more.',
  path: '/tools/writers/case-converter',
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

export default function CaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Case Converter"
        description="Easily convert text between different letter cases."
      />
      <CaseConverterForm />
    </>
  );
}
