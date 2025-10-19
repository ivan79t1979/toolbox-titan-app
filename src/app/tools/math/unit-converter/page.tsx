import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { UnitConverterForm } from './unit-converter-form';

const tool = {
  title: 'Unit Converter',
  description: 'A versatile online unit converter for length, weight, temperature, volume, time, speed, area, data storage, and more.',
  path: '/tools/math/unit-converter',
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

export default function UnitConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Unit Converter"
        description="Convert between various units for length, mass, temperature, and more."
      />
      <UnitConverterForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>First, select the <strong>Conversion Type</strong> (e.g., Length, Weight, Temperature).</li>
                  <li>Choose the unit you are converting <strong>From</strong> and the unit you are converting <strong>To</strong> using the dropdowns.</li>
                  <li>Enter a value in either the "From" or "To" input box.</li>
                  <li>The other box will update automatically with the converted value.</li>
                  <li>Click the swap button between the two inputs to quickly reverse the conversion direction.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
