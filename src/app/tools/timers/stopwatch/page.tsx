import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Stopwatch } from './stopwatch';

const tool = {
  title: 'Online Stopwatch',
  description: 'A simple, accurate online stopwatch to measure elapsed time with lap functionality. Perfect for sports, work, and personal use.',
  path: '/tools/timers/stopwatch',
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
  applicationCategory: 'Utilities',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function StopwatchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title="Stopwatch" description="Measure elapsed time with laps." />
      <Stopwatch />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click the <strong>Start</strong> button to begin measuring time.</li>
                  <li>The main display shows the total elapsed time.</li>
                  <li>Click the <strong>Pause</strong> button to temporarily stop the timer.</li>
                  <li>While the timer is running, click the <strong>Lap</strong> button to record a split time.</li>
                  <li>When the timer is stopped, the "Lap" button becomes a <strong>Reset</strong> button, which will clear the timer and all recorded laps.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
