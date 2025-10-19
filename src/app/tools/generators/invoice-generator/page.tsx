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
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Fill in <strong>Your Details</strong> and the <strong>Client Details</strong> in the respective text boxes.</li>
                  <li>(Optional) Upload your company logo.</li>
                  <li>Set the <strong>Invoice #</strong>, <strong>Date</strong>, and optional <strong>Due Date</strong>.</li>
                  <li>Add or edit line items, specifying a description, quantity, and rate for each.</li>
                  <li>Set a <strong>Tax Rate</strong> and add any final <strong>Notes</strong>.</li>
                  <li>All changes will be reflected live in the invoice preview on the right.</li>
                  <li>When you're ready, click the <strong>Download Invoice PDF</strong> button to save your invoice.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
