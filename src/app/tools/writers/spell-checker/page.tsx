import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { SpellCheckerForm } from './spell-checker-form';

const tool = {
  title: 'AI Spell Checker & Grammar Checker',
  description: 'Check your text for spelling mistakes and grammatical errors. Get AI-powered suggestions for improvement.',
  path: '/tools/writers/spell-checker',
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

export default function SpellCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Spell Checker"
        description="Check spelling and grammar, and get suggestions for improvement."
      />
      <SpellCheckerForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Paste your text into the text area on the left.</li>
                  <li>Click the <strong>Check Text</strong> button.</li>
                  <li>Review the list of <strong>Suggestions</strong> that appear on the right.</li>
                  <li>View the fully <strong>Corrected Text</strong> in the box that appears below the input.</li>
                  <li>You can either copy the corrected text or click <strong>Accept All Corrections</strong> to apply the changes to your original input.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
