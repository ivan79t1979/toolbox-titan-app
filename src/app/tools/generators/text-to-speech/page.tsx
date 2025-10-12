import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';
import { ElevenLabsBanner } from '@/components/elevenlabs-banner';

const tool = {
  title: 'Text to Speech Converter',
  description: 'Convert any text into natural-sounding speech with our free online AI voice generator. Perfect for videos, podcasts, and accessibility.',
  path: '/tools/generators/text-to-speech',
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
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function TextToSpeechPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio."
      />
      <div className="mt-8">
        <GradioWrapper appSrc="https://timemaster-multilingual-tts.hf.space" scriptSrc="https://gradio.s3-us-west-2.amazonaws.com/5.35.0/gradio.js" />
      </div>
      <ElevenLabsBanner />
    </>
  );
}
