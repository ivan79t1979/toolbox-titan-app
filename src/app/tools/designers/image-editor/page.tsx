
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ImageEditor } from './image-editor';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Image Editor',
  description: 'A full-featured editor with filters, adjustments, and cropping.',
  path: '/tools/designers/image-editor',
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

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/background-remover'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/image-resizer'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/color-palette-extractor'),
].filter(Boolean) as any[];

export default function ImageEditorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Image Editor"
        description="Edit your images with filters, adjustments, and cropping."
      />
      <ImageEditor />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li><strong>Upload Your Image:</strong> Drag and drop an image file onto the upload area, or click it to select a file from your device.</li>
                  <li><strong>Make Adjustments:</strong> Use the sliders in the "Adjust" tab to change the brightness, contrast, saturation, and other filters. The preview will update live.</li>
                  <li><strong>Crop &amp; Rotate Your Image:</strong>
                    <ul className="list-[circle]">
                        <li>Switch to the "Crop &amp; Rotate" tab. Use the slider to rotate your image to the desired angle.</li>
                        <li>Click <strong>Enter Crop Mode</strong>.</li>
                        <li>Drag the handles on the preview to select your desired area.</li>
                        <li>Click <strong>Apply Crop</strong> to confirm the changes.</li>
                    </ul>
                  </li>
                  <li><strong>Undo &amp; Reset:</strong> Made a mistake? Click <strong>Undo</strong> to revert the last crop or click <strong>Reset All</strong> to start over with the original image.</li>
                  <li><strong>Download:</strong> When you're happy with your edits, click the <strong>Download Image</strong> button to save your work.</li>
              </ol>
          </div>
      </section>
      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline text-center">Related Tools</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map(tool => (
             <Link href={tool.href} key={tool.href} className="group">
                <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                  <CardHeader>
                    <CardTitle as="h3" className="font-headline text-lg flex items-center gap-2">
                      <tool.icon className="h-6 w-6 shrink-0 text-primary" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

    