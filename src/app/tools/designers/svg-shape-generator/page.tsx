import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { SvgShapeGeneratorForm } from './svg-shape-generator-form';

const tool = {
  title: 'SVG Shape Generator',
  description: 'Create and customize basic SVG shapes like rectangles, circles, and polygons, and copy the code for your projects.',
  path: '/tools/designers/svg-shape-generator',
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

export default function SvgShapeGeneratorPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="SVG Shape Generator"
        description="Create and customize basic SVG shapes, and copy the code."
      />
      <SvgShapeGeneratorForm />
    </>
  );
}
