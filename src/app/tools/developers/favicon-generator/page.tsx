import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { FaviconGeneratorForm } from './favicon-generator-form';

const tool = {
  title: 'Favicon Generator',
  description: 'Create a complete set of favicons for your website from a single image. Includes sizes for all modern browsers and devices.',
  path: '/tools/developers/favicon-generator',
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

export default function FaviconGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Favicon Generator"
        description="Create favicons for your website from an image."
      />
      <FaviconGeneratorForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click the upload area to select a source image (a square image of 512x512px is recommended).</li>
                  <li>The tool will automatically generate favicons in various standard sizes (16x16, 32x32, apple-touch-icon, etc.).</li>
                  <li>Review the generated icon previews.</li>
                  <li>Click <strong>Download All (.zip)</strong> to get all the icons in a single file.</li>
                  <li>Copy the provided HTML code and paste it into the <code>&lt;head&gt;</code> section of your website.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
