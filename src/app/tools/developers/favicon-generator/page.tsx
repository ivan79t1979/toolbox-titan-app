import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { FaviconGeneratorForm } from './favicon-generator-form';

const tool = {
  title: 'Favicon Generator',
  description: 'Create a complete set of favicons for your website from a single image. Includes sizes for all modern browsers and devices.',
  path: '/tools/developers/favicon-generator',
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

export default function FaviconGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Favicon Generator"
        description="Create favicons for your website from an image."
      />
      <FaviconGeneratorForm />
    </>
  );
}
