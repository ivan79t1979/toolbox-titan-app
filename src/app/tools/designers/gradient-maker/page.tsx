import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { GradientMakerForm } from './gradient-maker-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'CSS Gradient Maker',
  description: 'Easily create beautiful CSS linear and radial gradients. Customize colors, angle, and stops, then copy the generated code instantly.',
  path: '/tools/designers/gradient-maker',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/color-picker-converter'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/css-shadow-generator'),
].filter(Boolean) as any[];

export default function GradientMakerPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title="Gradient Maker" description="Create beautiful CSS gradients with ease. Customize colors, types, and angles, then copy the code." />
      <GradientMakerForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select a gradient <strong>Type</strong> (Linear or Radial) and adjust the <strong>Angle</strong> for linear gradients.</li>
                  <li>For each color stop, use the color picker to change the color and the slider to adjust its <strong>Opacity</strong>.</li>
                  <li>Drag the position slider for each color to define where it appears in the gradient.</li>
                  <li>Click <strong>Add Color</strong> to add more stops or the trash icon to remove one (a minimum of two is required).</li>
                  <li>Copy the generated CSS code from the box at the bottom right. The preview updates live.</li>
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
