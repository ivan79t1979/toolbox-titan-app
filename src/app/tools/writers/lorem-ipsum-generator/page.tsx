import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LoremIpsumForm } from './lorem-ipsum-form';

const tool = {
  title: 'Lorem Ipsum Generator',
  description: 'Generate placeholder text (Lorem Ipsum) for your designs and mockups. Choose from different styles like standard, hipster, and pirate.',
  path: '/tools/writers/lorem-ipsum-generator',
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

export default function LoremIpsumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text."
      />
      <LoremIpsumForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Set the <strong>Count</strong> and <strong>Type</strong> (Paragraphs, Sentences, or Words) for the amount of text you need.</li>
                  <li>Choose an <strong>Ipsum Style</strong> (e.g., Standard, Hipster, Pirate) for different flavors of placeholder text.</li>
                  <li>(Optional) Check the boxes to include HTML elements like headings, links, or lists.</li>
                  <li>Click <strong>Generate</strong> to create the text. The output box will update automatically.</li>
                  <li>Click the copy icon to copy the plain text to your clipboard.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
