import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CssShadowGeneratorForm } from './css-shadow-generator-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'CSS Shadow Generator',
  description: 'Visually create and customize complex CSS box-shadow effects. Instantly generate the code for your web projects.',
  path: '/tools/designers/css-shadow-generator',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/svg-shape-generator'),
].filter(Boolean) as any[];

export default function CssShadowGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="CSS Shadow Generator"
        description="Visually create and customize box-shadow effects and get the CSS code."
      />
      <CssShadowGeneratorForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Use the sliders to adjust the <strong>Horizontal Offset</strong>, <strong>Vertical Offset</strong>, <strong>Blur Radius</strong>, and <strong>Spread Radius</strong>.</li>
                  <li>Pick a <strong>Shadow Color</strong> and adjust its <strong>Opacity</strong> using the color picker and slider.</li>
                  <li>Toggle the <strong>Inset</strong> switch to create an inner shadow instead of an outer one.</li>
                  <li>Change the <strong>Box Color</strong> and <strong>Background Color</strong> to preview how the shadow looks in different contexts.</li>
                  <li>Copy the generated <code>box-shadow</code> CSS code from the input field at the bottom right.</li>
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
