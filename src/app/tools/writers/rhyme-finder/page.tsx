import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { RhymeFinderForm } from './rhyme-finder-form';

const tool = {
  title: 'Rhyme Finder',
  description: 'Find the perfect rhyming words for your poems, songs, or creative writing with our AI-powered rhyme generator.',
  path: '/tools/writers/rhyme-finder',
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

export default function RhymeFinderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Rhyme Finder"
        description="Find the perfect rhyme for your poems, songs, or creative writing."
      />
      <RhymeFinderForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter a single word into the input field.</li>
                  <li>Click the <strong>Find Rhymes</strong> button.</li>
                  <li>The AI will generate a list of rhyming words.</li>
                  <li>Click on any rhyming word in the results to copy it to your clipboard.</li>
                  <li>Click <strong>Copy All</strong> to copy the entire list.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
