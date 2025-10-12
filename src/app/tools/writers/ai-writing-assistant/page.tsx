import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { AiWritingAssistantForm } from './ai-writing-form';

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
      <AiWritingAssistantForm />
    </div>
  );
}
