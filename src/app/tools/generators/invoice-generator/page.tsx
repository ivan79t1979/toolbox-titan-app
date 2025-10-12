import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { InvoiceGenerator } from './invoice-generator';

const tool = {
  title: 'Invoice Generator',
  description: 'Create, customize, and download professional PDF invoices for free. Add your logo, line items, taxes, and notes with ease.',
  path: '/tools/generators/invoice-generator',
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
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Invoice Generator"
        description="Create, customize, and download professional invoices with ease."
      />
      <InvoiceGenerator />
    </>
  );
}
