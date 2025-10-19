import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DecisionMatrixTool } from './decision-matrix-tool';

const tool = {
  title: 'Decision Matrix Tool',
  description: 'Make better, data-driven decisions. Evaluate and score your options against weighted criteria to find the best choice.',
  path: '/tools/project-management/decision-matrix',
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

export default function DecisionMatrixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Decision Matrix"
        description="Make better decisions by evaluating your options against weighted criteria. The best choice is highlighted for you."
      />
      <DecisionMatrixTool />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Click <strong>Add Criterion</strong> to add factors for your decision (e.g., "Cost", "Ease of Use").</li>
                  <li>Click <strong>Add Option</strong> to add the choices you are considering (e.g., "Software A", "Software B").</li>
                  <li>For each criterion, assign a <strong>Weight</strong> to signify its importance.</li>
                  <li>For each option, enter a <strong>Score</strong> for how well it meets each criterion.</li>
                  <li>The table will automatically calculate the total score for each option.</li>
                  <li>The option with the highest score is highlighted as the recommended choice.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save or load your decision matrix data.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
