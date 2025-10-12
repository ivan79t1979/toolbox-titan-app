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
    </>
  );
}
