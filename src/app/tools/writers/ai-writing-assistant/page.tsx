import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { AiWritingAssistantForm } from './ai-writing-form';
import { AdPlaceholder } from '@/components/ad-placeholder';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'AI Writing Assistant',
  description: 'Generate high-quality text for articles, emails, or social media posts with our AI-powered writing assistant. Just provide a topic and style.',
  path: '/tools/writers/ai-writing-assistant',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/spell-checker'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/text-summarizer'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/rhyme-finder'),
].filter(Boolean) as any[];

export default function AiWritingAssistantPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Writing Assistant"
        description="Generate high-quality text for your articles, emails, or social media posts with the power of AI."
      />
      <div className="mb-8 hidden justify-center md:flex">
        <AdPlaceholder width={728} height={90} />
      </div>
      <AiWritingAssistantForm />
      <div className="mt-8 flex justify-center">
        <AdPlaceholder width={300} height={250} />
      </div>
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter a <strong>Topic</strong> for the AI to write about.</li>
                  <li>Select a <strong>Writing Style</strong> (e.g., Formal, Creative) and a desired <strong>Length</strong>.</li>
                  <li>(Optional) Add specific <strong>Keywords</strong> to guide the content.</li>
                  <li>Click the <strong>Generate Text</strong> button.</li>
                  <li>Review the output in the "Generated Text" box and click the copy icon to save it.</li>
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
    </div>
  );
}
