import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DatasetGeneratorForm } from './dataset-generator-form';

const tool = {
  title: 'AI Dataset Generator',
  description: 'Instantly generate structured sample data in JSON or CSV format using an AI-powered tool. Just describe the data you need.',
  path: '/tools/generators/dataset-generator',
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

export default function DatasetGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Dataset Generator"
        description="Describe the data you need, and AI will generate it for you in JSON or CSV format."
      />
      <DatasetGeneratorForm />
    </>
  );
}
