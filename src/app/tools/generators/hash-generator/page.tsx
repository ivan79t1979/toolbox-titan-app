import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { HashGeneratorForm } from './hash-generator-form';

const tool = {
  title: 'Hash Generator (MD5, SHA-1, SHA-256)',
  description: 'Quickly generate cryptographic hashes from any text input using MD5, SHA-1, SHA-256, and SHA-512 algorithms.',
  path: '/tools/generators/hash-generator',
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

export default function HashGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Hash Generator"
        description="Generate hashes from text using MD5, SHA-1, SHA-256, and SHA-512."
      />
      <HashGeneratorForm />
    </>
  );
}
