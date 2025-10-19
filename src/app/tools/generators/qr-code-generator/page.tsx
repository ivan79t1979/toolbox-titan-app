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
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select the type of QR code you want to create (URL, Text, Email, etc.) from the dropdown menu.</li>
                  <li>Fill in the required information for your chosen type.</li>
                  <li>Customize the <strong>Size</strong>, <strong>Foreground Color</strong>, and <strong>Background Color</strong> of your QR code.</li>
                  <li>The QR code preview on the right will update instantly.</li>
                  <li>Click the <strong>Download QR Code</strong> button to save the generated code as a PNG image.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
