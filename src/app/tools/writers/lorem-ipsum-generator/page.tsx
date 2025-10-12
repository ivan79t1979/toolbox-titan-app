import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LoremIpsumForm } from './lorem-ipsum-form';

const tool = {
  title: 'Lorem Ipsum Generator',
  description: 'Generate placeholder text (Lorem Ipsum) for your designs and mockups. Choose from different styles like standard, hipster, and pirate.',
  path: '/tools/writers/lorem-ipsum-generator',
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

export default function LoremIpsumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text."
      />
      <LoremIpsumForm />
    </>
  );
}
