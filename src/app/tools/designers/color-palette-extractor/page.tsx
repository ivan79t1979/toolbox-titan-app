import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ColorPaletteExtractorForm } from './color-palette-extractor-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

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

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/color-picker-converter'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/gradient-maker'),
].filter(Boolean) as any[];

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
