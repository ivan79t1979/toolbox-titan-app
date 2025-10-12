import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Base64ConverterForm } from './base64-converter-form';

const tool = {
  title: 'Base64 Converter (Encode & Decode)',
  description: 'A simple online tool to encode plain text to Base64 or decode Base64 strings back to their original plain text format.',
  path: '/tools/generators/base64-converter',
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
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function Base64ConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Base64 Converter"
        description="Encode plain text to Base64 or decode Base64 back to plain text."
      />
      <Base64ConverterForm />
    </>
  );
}
