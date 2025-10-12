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
    </>
  );
}
