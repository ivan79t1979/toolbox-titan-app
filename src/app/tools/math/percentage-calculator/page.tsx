import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PercentageCalculatorForm } from './percentage-calculator-form';

const tool = {
  title: 'Percentage Calculator',
  description: 'A comprehensive percentage calculator for all your needs: find what X% of Y is, what percent X is of Y, and percentage change.',
  path: '/tools/math/percentage-calculator',
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

export default function PercentageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Percentage Calculator"
        description="All your percentage calculation needs."
      />
      <PercentageCalculatorForm />
    </>
  );
}
