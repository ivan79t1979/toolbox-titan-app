import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { FontPairingTool } from './font-pairing-tool';

const tool = {
  title: 'AI Font Pairing Generator',
  description: 'Discover beautiful and professional font pairings for your website. Get AI-powered suggestions for headlines and body text from Google Fonts.',
  path: '/tools/designers/font-pairing',
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
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function FontPairingPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Font Pairing"
        description="Discover beautiful font pairings from Google Fonts, suggested by AI."
      />
      <FontPairingTool />
    </>
  );
}
