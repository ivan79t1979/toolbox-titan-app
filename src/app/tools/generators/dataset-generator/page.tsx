import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DatasetGeneratorForm } from './dataset-generator-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'AI Dataset Generator',
  description: 'Instantly generate structured sample data in JSON or CSV format using an AI-powered tool. Just describe the data you need.',
  path: '/tools/generators/dataset-generator',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/lorem-ipsum-generator'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/invoice-generator'),
].filter(Boolean) as any[];

export default function DatasetGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Dataset Generator"
        description="Describe the data you need, and AI will generate it for you in JSON or CSV format."
      />
      <DatasetGeneratorForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>In the <strong>Describe your data</strong> box, write a clear, natural language description of the dataset you want (e.g., "A list of 20 random employees with a name, department, and start date").</li>
                  <li>Set the <strong>Number of items</strong> you want the AI to generate (up to 100).</li>
                  <li>Choose your desired output <strong>Format</strong> (JSON or CSV).</li>
                  <li>Click the <strong>Generate Dataset</strong> button.</li>
                  <li>Once generated, you can copy the raw data or use the Download button to export it as a JSON, CSV, or XLSX file.</li>
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
