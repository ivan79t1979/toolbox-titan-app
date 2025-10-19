import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TimeTracker } from './time-tracker';

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
    </>
  );
}
