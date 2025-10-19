import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ReadabilityAnalyzerForm } from './readability-analyzer-form';

const tool = {
  title: 'Readability Analyzer',
  description: 'Analyze your text to gauge its complexity and readability. Get scores from Flesch-Kincaid, Gunning Fog, and more.',
  path: '/tools/writers/readability-analyzer',
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

export default function ReadabilityAnalyzerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Readability Analyzer"
        description="Analyze your text to gauge its complexity and readability."
      />
      <ReadabilityAnalyzerForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Paste your text into the large text area on the left.</li>
                  <li>The readability scores and text statistics will update automatically as you type.</li>
                  <li>Review the <strong>Average Grade Level</strong> to get a quick idea of your text's complexity.</li>
                  <li>Check the text statistics (words, sentences, etc.) and detailed scores for a deeper analysis.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
