import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { BudgetPlanner } from './budget-planner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Budget Planner',
  description: 'A simple, visual budget planner to track your income and expenses. See your financial health at a glance with charts and summaries.',
  path: '/tools/project-management/budget-planner',
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
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/invoice-generator'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/math/percentage-calculator'),
].filter(Boolean) as any[];

export default function BudgetPlannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Budget Planner"
        description="Track income, expenses, and visualize your financial health."
      />
      <BudgetPlanner />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Start by clicking the <strong>Add Transaction</strong> button to open the form.</li>
                  <li>Select the transaction type (Income or Expense), and fill in the description, amount, date, and category.</li>
                  <li>Click <strong>Save Transaction</strong> to add it to your list.</li>
                  <li>Your total income, expenses, and current balance will update automatically in the cards at the top.</li>
                  <li>The pie charts on the right provide a visual breakdown of your spending and earning by category.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save your data as a JSON, CSV, or other file format.</li>
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
