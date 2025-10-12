import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Calculator } from './calculator';

const tool = {
  title: 'Online Calculator (Simple & Advanced)',
  description: 'A free online calculator for all your needs, from basic arithmetic to advanced scientific functions like sin, cos, tan, and log.',
  path: '/tools/math/calculator',
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

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Simple & Advanced Calculator"
        description="From basic to scientific calculations."
      />
      <Calculator />
    </>
  );
}
