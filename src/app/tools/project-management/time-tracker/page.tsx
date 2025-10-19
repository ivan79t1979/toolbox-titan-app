import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TimeTracker } from './time-tracker';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Time Tracker',
  description: 'A simple online time tracker to log the time you spend on different tasks and projects. Start, stop, and export your time entries.',
  path: '/tools/project-management/time-tracker',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/timers/pomodoro-timer'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/kanban-board'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/invoice-generator'),
].filter(Boolean) as any[];

export default function TimeTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Time Tracker"
        description="Track the time you spend on different tasks and projects with a simple start/stop timer."
      />
      <TimeTracker />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter a description for the task you are about to start.</li>
                  <li>Click the <strong>Start</strong> button to begin the timer.</li>
                  <li>Use the <strong>Pause</strong> and <strong>Resume</strong> buttons to temporarily stop tracking.</li>
                  <li>When you have finished the task, click the <strong>Stop</strong> button.</li>
                  <li>Your completed task, along with its duration, will be added to the time entries log below.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save your time log or load previous entries.</li>
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
