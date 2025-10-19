import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TextDiffForm } from './text-diff-form';

const tool = {
  title: 'Text Difference Checker (Diff Tool)',
  description: 'Compare two blocks of text and instantly see the differences highlighted. A simple and free online diff tool.',
  path: '/tools/writers/text-diff',
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

export default function TextDiffPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Text Diff"
        description="Compare two texts and highlight differences."
      />
      <TextDiffForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Paste the original text into the left-hand text box.</li>
                  <li>Paste the modified text into the right-hand text box.</li>
                  <li>The "Unified View" below will automatically update.</li>
                  <li>Text that was removed will be highlighted in red.</li>
                  <li>Text that was added will be highlighted in green.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
