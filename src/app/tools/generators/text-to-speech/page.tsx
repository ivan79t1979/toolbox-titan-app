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
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Type or paste the text you want to convert into the <strong>Text</strong> input box.</li>
                  <li>Choose a <strong>Language</strong> from the dropdown menu.</li>
                  <li>Select a <strong>Speaker</strong> voice. You can listen to a sample of each speaker.</li>
                  <li>Click the <strong>Submit</strong> button to generate the audio.</li>
                  <li>Use the audio player to listen to the generated speech and download it as a WAV file.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
