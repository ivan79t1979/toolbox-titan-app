import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CssShadowGeneratorForm } from './css-shadow-generator-form';

const tool = {
  title: 'CSS Shadow Generator',
  description: 'Visually create and customize complex CSS box-shadow effects. Instantly generate the code for your web projects.',
  path: '/tools/designers/css-shadow-generator',
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

export default function CssShadowGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="CSS Shadow Generator"
        description="Visually create and customize box-shadow effects and get the CSS code."
      />
      <CssShadowGeneratorForm />
    </>
  );
}
