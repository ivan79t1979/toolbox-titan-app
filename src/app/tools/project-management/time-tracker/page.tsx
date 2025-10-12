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
    </>
  );
}
