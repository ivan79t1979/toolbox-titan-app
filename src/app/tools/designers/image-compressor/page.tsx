import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ImageCompressorForm } from './image-compressor-form';

const tool = {
  title: 'Image Compressor',
  description: 'Optimize your JPG and PNG images by reducing their file size without significant quality loss. Perfect for web performance.',
  path: '/tools/designers/image-compressor',
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

export default function ImageCompressorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Image Compressor"
        description="Optimize your images by reducing their file size without significant quality loss."
      />
      <ImageCompressorForm />
    </>
  );
}
