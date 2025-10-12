import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DecisionMatrixTool } from './decision-matrix-tool';

const tool = {
  title: 'Decision Matrix Tool',
  description: 'Make better, data-driven decisions. Evaluate and score your options against weighted criteria to find the best choice.',
  path: '/tools/project-management/decision-matrix',
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
  applicationCategory: 'Productivity',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function DecisionMatrixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Decision Matrix"
        description="Make better decisions by evaluating your options against weighted criteria. The best choice is highlighted for you."
      />
      <DecisionMatrixTool />
    </>
  );
}
