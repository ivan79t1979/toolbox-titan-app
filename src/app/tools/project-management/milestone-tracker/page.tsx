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
    </>
  );
}
