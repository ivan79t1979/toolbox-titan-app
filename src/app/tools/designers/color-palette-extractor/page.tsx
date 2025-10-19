import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ColorPaletteExtractorForm } from './color-palette-extractor-form';

const tool = {
  title: 'AI Color Palette Extractor',
  description: 'Automatically generate a beautiful color palette from any uploaded image. Ideal for designers and artists looking for inspiration.',
  path: '/tools/designers/color-palette-extractor',
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

export default function ColorPaletteExtractorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Color Palette Extractor"
        description="Upload an image to automatically extract its dominant color palette with AI."
      />
      <ColorPaletteExtractorForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click the <strong>Choose File</strong> button to select an image from your device.</li>
                  <li>Use the slider to set the <strong>Number of Colors</strong> you want to extract (from 3 to 10).</li>
                  <li>Click the <strong>Extract Palette</strong> button to process the image.</li>
                  <li>View the extracted colors in the palette preview on the right.</li>
                  <li>Hover over any color to see its HEX, RGB, and HSL values, and click the copy icon to save it.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
