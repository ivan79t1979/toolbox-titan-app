import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CaseConverterForm } from './case-converter-form';

const tool = {
  title: 'Case Converter',
  description:
    'Easily convert text between different letter cases, including UPPER CASE, lower case, Title Case, camelCase, and more.',
  path: '/tools/writers/case-converter',
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

export default function CaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Case Converter"
        description="Easily convert text between different letter cases."
      />
      <CaseConverterForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Type or paste your text into the text area.</li>
                  <li>Click any of the case buttons (e.g., UPPER CASE, Title Case, camelCase).</li>
                  <li>The text in the box will be instantly converted to the selected case.</li>
                  <li>Use the copy icon to copy the result, or the trash icon to clear the text box.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
