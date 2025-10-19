import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { FontPairingTool } from './font-pairing-tool';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'AI Font Pairing Generator',
  description: 'Discover beautiful and professional font pairings for your website. Get AI-powered suggestions for headlines and body text from Google Fonts.',
  path: '/tools/designers/font-pairing',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/color-palette-extractor'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/designers/gradient-maker'),
].filter(Boolean) as any[];

export default function FontPairingPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Font Pairing"
        description="Discover beautiful font pairings from Google Fonts, suggested by AI."
      />
      <FontPairingTool />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>(Optional) Change the preview text for headlines and body copy to match your content.</li>
                  <li><strong>Manual Pairing:</strong> Use the dropdown menus to search and select a headline and body font from Google Fonts.</li>
                  <li><strong>AI Suggestions:</strong> Describe a style (e.g., "playful and bold") and click <strong>Generate Pairings</strong>.</li>
                  <li>Review the generated previews. Each font is loaded dynamically from Google Fonts.</li>
                  <li>Click the <strong>PNG</strong> or <strong>PDF</strong> buttons to export a preview image of your favorite pairing.</li>
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
