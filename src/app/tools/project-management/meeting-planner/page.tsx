import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { MeetingPlanner } from './meeting-planner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Meeting Planner',
  description: 'Plan and schedule your meetings efficiently. Set agendas, list attendees, and keep your team organized and on track.',
  path: '/tools/project-management/meeting-planner',
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
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/milestone-tracker'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/daily-standup-helper'),
].filter(Boolean) as any[];

export default function MeetingPlannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Meeting Planner"
        description="Plan and schedule meetings, manage attendees, and set agendas."
      />
      <MeetingPlanner />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click the <strong>Add Meeting</strong> button to open the planning form.</li>
                  <li>Enter the meeting title, date, start/end times, attendees, and agenda points.</li>
                  <li>Click <strong>Save Meeting</strong> to add it to your schedule.</li>
                  <li>Your upcoming meetings will be displayed as cards.</li>
                  <li>Click the edit icon to modify a meeting or the trash icon to delete it.</li>
                  <li>Use the <strong>Import/Export</strong> functionality to save your meeting schedule or load it from a file.</li>
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
