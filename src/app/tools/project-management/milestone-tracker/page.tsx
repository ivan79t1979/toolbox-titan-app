import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { MilestoneTracker } from './milestone-tracker';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Milestone Tracker',
  description: 'Visually track your project milestones and deadlines. Organize your key dates and monitor their status to stay on schedule.',
  path: '/tools/project-management/milestone-tracker',
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

export default function MilestoneTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Milestone Tracker"
        description="Track project milestones and deadlines."
      />
      <MilestoneTracker />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click <strong>Add Milestone</strong> to create a new milestone.</li>
                  <li>In the form, provide a title, due date, and initial status for your milestone.</li>
                  <li>Drag and drop milestones to reorder them in your list.</li>
                  <li>Use the dropdown menu on each milestone card to update its status (e.g., from "Upcoming" to "In-Progress").</li>
                  <li>Click the edit icon to change a milestone's title or due date.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save your timeline or load an existing one.</li>
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
