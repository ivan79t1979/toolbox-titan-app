import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DecisionMatrixTool } from './decision-matrix-tool';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Decision Matrix Tool',
  description: 'Make better, data-driven decisions. Evaluate and score your options against weighted criteria to find the best choice.',
  path: '/tools/project-management/decision-matrix',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/budget-planner'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/kanban-board'),
].filter(Boolean) as any[];

export default function DecisionMatrixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Decision Matrix"
        description="Make better decisions by evaluating your options against weighted criteria. The best choice is highlighted for you."
      />
      <DecisionMatrixTool />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click <strong>Add Criterion</strong> to add factors for your decision (e.g., "Cost", "Ease of Use").</li>
                  <li>Click <strong>Add Option</strong> to add the choices you are considering (e.g., "Software A", "Software B").</li>
                  <li>For each criterion, assign a <strong>Weight</strong> to signify its importance.</li>
                  <li>For each option, enter a <strong>Score</strong> for how well it meets each criterion.</li>
                  <li>The table will automatically calculate the total score for each option.</li>
                  <li>The option with the highest score is highlighted as the recommended choice.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save or load your decision matrix data.</li>
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
