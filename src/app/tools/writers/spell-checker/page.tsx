import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { SpellCheckerForm } from './spell-checker-form';

const tool = {
  title: 'AI Spell Checker & Grammar Checker',
  description: 'Check your text for spelling mistakes and grammatical errors. Get AI-powered suggestions for improvement.',
  path: '/tools/writers/spell-checker',
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

export default function SpellCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Spell Checker"
        description="Check spelling and grammar, and get suggestions for improvement."
      />
      <SpellCheckerForm />
    </>
  );
}
