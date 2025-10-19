import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { SvgShapeGeneratorForm } from './svg-shape-generator-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'SVG Shape Generator',
  description: 'Create and customize basic SVG shapes like rectangles, circles, and polygons, and copy the code for your projects.',
  path: '/tools/designers/svg-shape-generator',
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
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/gradient-maker'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/css-shadow-generator'),
].filter(Boolean) as any[];

export default function SvgShapeGeneratorPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="SVG Shape Generator"
        description="Create and customize basic SVG shapes, and copy the code."
      />
      <SvgShapeGeneratorForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select a shape type (Rectangle, Circle, Ellipse, or Polygon) from the dropdown menu.</li>
                  <li>Use the sliders to adjust the <strong>Width</strong>, <strong>Height</strong>, and other shape-specific properties like <strong>Border Radius</strong> or <strong>Sides</strong>.</li>
                  <li>Choose a <strong>Fill Color</strong> and <strong>Stroke Color</strong> using the color pickers.</li>
                  <li>Adjust the <strong>Stroke Width</strong> with the slider.</li>
                  <li>The preview on the right will update in real-time.</li>
                  <li>Click the copy button to copy the complete SVG code to your clipboard.</li>
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
