import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CountdownTimer } from './countdown-timer';

const tool = {
  title: 'Online Countdown Timer',
  description: 'A simple and easy-to-use online countdown timer. Set a duration and start the countdown for any purpose.',
  path: '/tools/timers/countdown-timer',
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

export default function CountdownTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Countdown Timer"
        description="Count down from a specified time."
      />
      <CountdownTimer />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter the duration for your countdown using the Years, Months, Days, Hours, Minutes, and Seconds input fields.</li>
                  <li>Click the <strong>Start</strong> button to begin the countdown.</li>
                  <li>Use the <strong>Pause</strong> button to temporarily stop the timer.</li>
                  <li>Click <strong>Reset</strong> to return the timer to its initial duration.</li>
                  <li>Choose an <strong>Alarm Sound</strong> from the settings to play when the timer finishes.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
