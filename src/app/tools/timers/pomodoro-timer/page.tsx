import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PomodoroTimer } from './pomodoro-timer';
import { AdPlaceholder } from '@/components/ad-placeholder';

const tool = {
  title: 'Pomodoro Timer',
  description: 'Boost your productivity with a customizable Pomodoro Timer. Alternate between focused work sessions and short breaks.',
  path: '/tools/timers/pomodoro-timer',
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

export default function PomodoroTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Pomodoro Timer"
        description="Boost your productivity with the Pomodoro Technique. Customize your work and break intervals."
      />
      <div className="mb-8 hidden justify-center md:flex">
        <AdPlaceholder width={728} height={90} />
      </div>
      <PomodoroTimer />
      <div className="mt-8 flex justify-center">
        <AdPlaceholder width={300} height={250} />
      </div>
    </>
  );
}
