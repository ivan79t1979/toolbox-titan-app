import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { UuidGeneratorForm } from './uuid-generator-form';

const tool = {
  title: 'UUID Generator',
  description: 'Generate one or multiple universally unique identifiers (UUIDs) in Version 4 format, with or without hyphens.',
  path: '/tools/generators/uuid-generator',
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

export default function UuidGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="UUID Generator"
        description="Generate unique Version 4 UUIDs."
      />
      <UuidGeneratorForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter the <strong>Number of UUIDs</strong> you want to generate (up to 1000).</li>
                  <li>Check or uncheck <strong>Include Hyphens</strong> to format the UUIDs.</li>
                  <li>Check or uncheck <strong>Uppercase</strong> to control the letter casing.</li>
                  <li>Click the <strong>Generate</strong> button to create new UUIDs based on your settings.</li>
                  <li>The results will appear in the text box below, where you can click <strong>Copy All</strong> to copy them.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
