import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { UuidGeneratorForm } from './uuid-generator-form';

const tool = {
  title: 'UUID Generator',
  description: 'Generate one or multiple universally unique identifiers (UUIDs) in Version 4 format, with or without hyphens.',
  path: '/tools/generators/uuid-generator',
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

export default function UuidGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="UUID Generator"
        description="Generate unique Version 4 UUIDs."
      />
      <UuidGeneratorForm />
    </>
  );
}
