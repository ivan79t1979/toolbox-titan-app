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
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Drag and drop an image or click the upload area to select a file (PNG, JPG, etc.).</li>
                  <li>Use the <strong>Quality</strong> slider to adjust the compression level. The preview updates automatically.</li>
                  <li>Compare the original and compressed image sizes to see the reduction percentage.</li>
                  <li>Click on the compressed image preview to see it in a new tab.</li>
                  <li>Click the <strong>Download</strong> button to save the compressed image.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
