import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PasswordGeneratorForm } from './password-generator-form';
import { NordPassBanner } from '@/components/nordpass-banner';
import { NordVPNBanner } from '@/components/nordvpn-banner';

const tool = {
  title: 'Secure Password Generator',
  description: 'Generate strong, secure, and random passwords with customizable length and character sets (uppercase, numbers, symbols).',
  path: '/tools/generators/password-generator',
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
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Password Generator"
        description="Generate secure passwords."
      />
      <NordVPNBanner />
      <div className="my-8">
        <PasswordGeneratorForm />
      </div>
      <NordPassBanner />
    </>
  );
}
