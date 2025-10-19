import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { MilestoneTracker } from './milestone-tracker';

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
    </>
  );
}
