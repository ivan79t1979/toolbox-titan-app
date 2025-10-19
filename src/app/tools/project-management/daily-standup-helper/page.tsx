import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DailyStandupHelperForm } from './daily-standup-helper-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Daily Standup Helper',
  description: 'Quickly prepare and format your daily standup updates. Answer what you did yesterday, what you\'ll do today, and any blockers.',
  path: '/tools/project-management/daily-standup-helper',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/kanban-board'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/meeting-planner'),
].filter(Boolean) as any[];

export default function DailyStandupHelperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Daily Standup Helper"
        description="Quickly prepare and format your daily standup updates."
      />
      <DailyStandupHelperForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>In the first box, write down what you accomplished yesterday.</li>
                  <li>In the second box, list the tasks you plan to work on today.</li>
                  <li>In the third box, note any issues or blockers that are preventing you from making progress.</li>
                  <li>As you type, the formatted update on the right will be generated automatically.</li>
                  <li>Click the <strong>Copy</strong> button to copy the formatted text, ready to paste into Slack, Teams, or email.</li>
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
