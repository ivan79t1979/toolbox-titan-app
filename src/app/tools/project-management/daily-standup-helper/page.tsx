import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DailyStandupHelperForm } from './daily-standup-helper-form';

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
    </>
  );
}
