import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { WorldClock } from './world-clock';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const tool = {
  title: 'World Clock',
  description: 'View the current local time in cities and time zones all around the world. Add and customize your own world clock dashboard.',
  path: '/tools/timers/world-clock',
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

export default function WorldClockPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="World Clock"
        description="Current time in different time zones."
      />
      <WorldClock />

      <div className="mt-12 max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="how-to-use">
            <AccordionTrigger>How to Use This Tool</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  Click the <strong>Add Time Zone</strong> button to open the
                  search menu.
                </li>
                <li>
                  Search for a city or time zone. The list will update as you
                  type.
                </li>
                <li>
                  Click on a time zone from the list to add it to your dashboard.
                </li>
                <li>
                  To remove a clock, click the trash can icon on the top right
                  of its card.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="understanding-timezones">
            <AccordionTrigger>Understanding Time Zone Acronyms</AccordionTrigger>
            <AccordionContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>GMT (Greenwich Mean Time):</strong> This is the time at
                the Royal Observatory in Greenwich, London. It is often used as
                the baseline standard against which other time zones are
                measured. For example, "GMT-5" is 5 hours behind Greenwich Mean
                Time.
              </p>
              <p>
                <strong>DST (Daylight Saving Time):</strong> This is the
                practice of advancing clocks during warmer months so that
                darkness falls at a later clock time. If a city is observing
                DST, it will be indicated next to its time offset.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
