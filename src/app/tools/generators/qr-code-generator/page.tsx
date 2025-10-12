import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { QrCodeGeneratorForm } from './qr-code-generator-form';
import { MeQrBanner } from '@/components/me-qr-banner';

const tool = {
  title: 'QR Code Generator',
  description: 'Create custom QR codes for URLs, text, Wi-Fi networks, SMS, email, and more. Download your QR code for free.',
  path: '/tools/generators/qr-code-generator',
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

export default function QrCodeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="QR Code Generator"
        description="Generate QR codes from text or URLs."
      />
      <QrCodeGeneratorForm />
      <MeQrBanner />
    </>
  );
}
