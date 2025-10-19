import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Calculator } from './calculator';

const tool = {
  title: 'Online Calculator (Simple & Advanced)',
  description: 'A free online calculator for all your needs, from basic arithmetic to advanced scientific functions like sin, cos, tan, and log.',
  path: '/tools/math/calculator',
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

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Simple & Advanced Calculator"
        description="From basic to scientific calculations."
      />
      <Calculator />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Use the number and operator buttons to perform calculations just like a physical calculator.</li>
                  <li>The display shows the current input, and the smaller text above shows the history of your operation.</li>
                  <li>Use the <strong>C</strong> button to clear all input, or <strong>CE</strong> to clear the current entry.</li>
                  <li>Switch to the <strong>Advanced</strong> tab for scientific functions like sine, cosine, logarithm, and more.</li>
                  <li>Use the memory functions (MC, MR, MS, M+, M-) to store and recall numbers.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
