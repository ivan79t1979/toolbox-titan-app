import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';

const tool = {
  title: 'Background Remover',
  description: 'Instantly remove the background from any image with our AI-powered tool. Perfect for product photos, portraits, and graphic design.',
  path: '/tools/designers/background-remover',
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
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function BackgroundRemoverPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image."
      />
      <div className="mt-8">
        <GradioWrapper appSrc="https://timemaster-background-remover-c1.hf.space" scriptSrc="https://gradio.s3-us-west-2.amazonaws.com/5.35.0/gradio.js" />
      </div>
    </>
  );
}
