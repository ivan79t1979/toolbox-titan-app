import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ImageResizerForm } from './image-resizer-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BatchImageResizerForm } from './batch-image-resizer-form';

const tool = {
  title: 'Image Resizer (Single & Batch)',
  description: 'Easily resize a single image or multiple images in batches. Set custom dimensions or choose from presets for social media.',
  path: '/tools/designers/image-resizer',
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

export default function ImageResizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Image Resizer"
        description="Easily resize images to your desired dimensions while maintaining aspect ratio."
      />
      <Tabs defaultValue="single">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="single">Single Image</TabsTrigger>
          <TabsTrigger value="batch">Batch Resize</TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="mt-6">
          <ImageResizerForm />
        </TabsContent>
        <TabsContent value="batch" className="mt-6">
          <BatchImageResizerForm />
        </TabsContent>
      </Tabs>
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select the <strong>Single Image</strong> or <strong>Batch Resize</strong> tab.</li>
                  <li>Click the upload area to choose one or more images from your device.</li>
                  <li>Enter the desired <strong>Width</strong> and <strong>Height</strong>, or choose from a common preset size.</li>
                  <li>Check the <strong>Maintain Aspect Ratio</strong> box to prevent distortion (recommended).</li>
                  <li>Click <strong>Resize Image</strong> (for single) or <strong>Resize All</strong> (for batch).</li>
                  <li>For single mode, download the result. For batch mode, download individual images or get all of them in a ZIP file.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
