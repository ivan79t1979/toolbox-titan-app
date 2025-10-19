import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PercentageCalculatorForm } from './percentage-calculator-form';

const tool = {
  title: 'Percentage Calculator',
  description: 'A comprehensive percentage calculator for all your needs: find what X% of Y is, what percent X is of Y, and percentage change.',
  path: '/tools/math/percentage-calculator',
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

export default function PercentageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Percentage Calculator"
        description="All your percentage calculation needs."
      />
      <PercentageCalculatorForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select the type of calculation you need from the tabs at the top (e.g., "X% of Y", "% Change").</li>
                  <li>Enter your numbers into the input fields provided for that calculation.</li>
                  <li>The result is calculated automatically and displayed in the "Result" area.</li>
                  <li>No need to click a button—the tool updates as you type.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
