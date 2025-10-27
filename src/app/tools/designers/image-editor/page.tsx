import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ImageEditor } from './image-editor';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Advanced Image Editor',
  description: 'A full-featured editor with filters, adjustments, cropping, and AI-powered editing.',
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
        title="Advanced Image Editor"
        description="Edit your images with filters, adjustments, cropping, and powerful AI."
      />
      <ImageEditor />
      <section className="mt-12">
        <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
        <div className="prose dark:prose-invert mt-4">
          <ol>
            <li>Click the upload area to select an image from your device.</li>
            <li>Use the tabs on the left to navigate between different editing tools.</li>
            <li><strong>Adjust & Filter:</strong> Use sliders to change brightness, contrast, saturation, and apply filters like grayscale or sepia.</li>
            <li><strong>Crop & Rotate:</strong> Click "Enter Crop Mode", drag the handles to select an area, and click "Apply Crop". Use the rotate buttons for quick adjustments.</li>
            <li><strong>AI Edit:</strong> Describe the change you want to make in the text box (e.g., "make the background a sunny beach") and click "Apply AI Edit".</li>
            <li>Click <strong>Download Image</strong> to save your final creation.</li>
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
