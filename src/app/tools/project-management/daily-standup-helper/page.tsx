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
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>In the first box, write down what you accomplished yesterday.</li>
                  <li>In the second box, list the tasks you plan to work on today.</li>
                  <li>In the third box, note any issues or blockers that are preventing you from making progress.</li>
                  <li>As you type, the formatted update on the right will be generated automatically.</li>
                  <li>Click the <strong>Copy</strong> button to copy the formatted text, ready to paste into Slack, Teams, or email.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
