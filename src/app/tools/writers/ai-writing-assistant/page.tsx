import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { AiWritingAssistantForm } from './ai-writing-form';
import { AdPlaceholder } from '@/components/ad-placeholder';

const tool = {
  title: 'AI Writing Assistant',
  description: 'Generate high-quality text for articles, emails, or social media posts with our AI-powered writing assistant. Just provide a topic and style.',
  path: '/tools/writers/ai-writing-assistant',
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

export default function AiWritingAssistantPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Writing Assistant"
        description="Generate high-quality text for your articles, emails, or social media posts with the power of AI."
      />
      <div className="mb-8 hidden justify-center md:flex">
        <AdPlaceholder width={728} height={90} />
      </div>
      <AiWritingAssistantForm />
      <div className="mt-8 flex justify-center">
        <AdPlaceholder width={300} height={250} />
      </div>
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter a <strong>Topic</strong> for the AI to write about.</li>
                  <li>Select a <strong>Writing Style</strong> (e.g., Formal, Creative) and a desired <strong>Length</strong>.</li>
                  <li>(Optional) Add specific <strong>Keywords</strong> to guide the content.</li>
                  <li>Click the <strong>Generate Text</strong> button.</li>
                  <li>Review the output in the "Generated Text" box and click the copy icon to save it.</li>
              </ol>
          </div>
      </section>
    </div>
  );
}
