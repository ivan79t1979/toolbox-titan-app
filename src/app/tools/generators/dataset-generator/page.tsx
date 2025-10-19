import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { DatasetGeneratorForm } from './dataset-generator-form';

const tool = {
  title: 'AI Dataset Generator',
  description: 'Instantly generate structured sample data in JSON or CSV format using an AI-powered tool. Just describe the data you need.',
  path: '/tools/generators/dataset-generator',
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
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function DatasetGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Dataset Generator"
        description="Describe the data you need, and AI will generate it for you in JSON or CSV format."
      />
      <DatasetGeneratorForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>In the <strong>Describe your data</strong> box, write a clear, natural language description of the dataset you want (e.g., "A list of 20 random employees with a name, department, and start date").</li>
                  <li>Set the <strong>Number of items</strong> you want the AI to generate (up to 100).</li>
                  <li>Choose your desired output <strong>Format</strong> (JSON or CSV).</li>
                  <li>Click the <strong>Generate Dataset</strong> button.</li>
                  <li>Once generated, you can copy the raw data or use the Download button to export it as a JSON, CSV, or XLSX file.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
