import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { GradientMakerForm } from './gradient-maker-form';

const tool = {
  title: 'CSS Gradient Maker',
  description: 'Easily create beautiful CSS linear and radial gradients. Customize colors, angle, and stops, then copy the generated code instantly.',
  path: '/tools/designers/gradient-maker',
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

export default function GradientMakerPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title="Gradient Maker" description="Create beautiful CSS gradients with ease. Customize colors, types, and angles, then copy the code." />
      <GradientMakerForm />
    </>
  );
}
