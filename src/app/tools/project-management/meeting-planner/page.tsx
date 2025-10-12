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
    </>
  );
}
