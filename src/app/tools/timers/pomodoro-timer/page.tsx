import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PomodoroTimer } from './pomodoro-timer';
import { AdPlaceholder } from '@/components/ad-placeholder';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

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

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/timers/stopwatch'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/time-tracker'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/todo-list'),
].filter(Boolean) as any[];

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
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>(Optional) In the Settings, customize the duration for <strong>Work</strong>, <strong>Short Break</strong>, and <strong>Long Break</strong> periods.</li>
                  <li>Enter the task you are working on in the input field.</li>
                  <li>Click the <strong>Start</strong> button to begin your first work session (Pomodoro).</li>
                  <li>The timer will count down. Once finished, an alarm will sound, and the timer will automatically switch to a break period.</li>
                  <li>Your completed tasks and focus statistics are logged below the timer.</li>
              </ol>
          </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline text-center">Related Tools</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map(tool => (
             <Link href={tool.href} key={tool.href} className="group">
                <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                  <CardHeader>
                    <CardTitle as="h3" className="font-headline text-lg flex items-center gap-2">
                      <tool.icon className="h-6 w-6 shrink-0 text-primary" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
