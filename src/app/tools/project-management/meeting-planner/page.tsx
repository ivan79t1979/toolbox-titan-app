import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { MeetingPlanner } from './meeting-planner';

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
    </>
  );
}
