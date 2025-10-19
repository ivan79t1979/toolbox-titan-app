import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { SpellCheckerForm } from './spell-checker-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'AI Spell Checker & Grammar Checker',
  description: 'Check your text for spelling mistakes and grammatical errors. Get AI-powered suggestions for improvement.',
  path: '/tools/writers/spell-checker',
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
  applicationCategory: 'Productivity',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/word-counter'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/readability-analyzer'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/ai-writing-assistant'),
].filter(Boolean) as any[];

export default function SpellCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Spell Checker"
        description="Check spelling and grammar, and get suggestions for improvement."
      />
      <SpellCheckerForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Paste your text into the text area on the left.</li>
                  <li>Click the <strong>Check Text</strong> button.</li>
                  <li>Review the list of <strong>Suggestions</strong> that appear on the right.</li>
                  <li>View the fully <strong>Corrected Text</strong> in the box that appears below the input.</li>
                  <li>You can either copy the corrected text or click <strong>Accept All Corrections</strong> to apply the changes to your original input.</li>
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
