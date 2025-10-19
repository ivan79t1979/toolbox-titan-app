import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ColorPickerConverterForm } from './color-picker-converter-form';
import { AdPlaceholder } from '@/components/ad-placeholder';

const tool = {
  title: 'Color Picker & Converter (HEX, RGB, HSL)',
  description: 'Use our online color picker to select any color and instantly convert it between HEX, RGB, and HSL formats.',
  path: '/tools/designers/color-picker-converter',
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
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function ColorPickerConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Color Picker & Converter"
        description="Pick a color and convert it to different formats like HEX, RGB, and HSL."
      />
      <div className="mb-8 hidden justify-center md:flex">
        <AdPlaceholder width={728} height={90} />
      </div>
      <ColorPickerConverterForm />
      <div className="mt-8 flex justify-center">
        <AdPlaceholder width={300} height={250} />
      </div>
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Use the visual color picker to select a color, or click the square swatch to open your system's color picker.</li>
                  <li>Alternatively, manually type a value into the <strong>HEX</strong>, <strong>RGB</strong>, or <strong>HSL</strong> input fields.</li>
                  <li>The color preview and all other values will update automatically as you make changes.</li>
                  <li>Click the copy icon next to any value (HEX, RGB, HSL) to copy it to your clipboard.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
