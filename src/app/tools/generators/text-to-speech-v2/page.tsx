
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { GradioWrapper } from '@/components/gradio-wrapper';
import { ElevenLabsBanner } from '@/components/elevenlabs-banner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Text to Speech Converter v2',
  description: 'Convert text into high-quality speech with various voice options using our advanced AI voice generator.',
  path: '/tools/generators/text-to-speech-v2',
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

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/ai-writing-assistant'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/spell-checker'),
].filter(Boolean) as any[];

export default function TextToSpeechV2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Text to Speech v2"
        description="Convert text to spoken audio with advanced voice options."
      />
      <div className="mt-8">
        <GradioWrapper appSrc="https://timemaster-voxcpm.hf.space" scriptSrc="https://gradio.s3-us-west-2.amazonaws.com/5.46.1/gradio.js" />
      </div>
      <ElevenLabsBanner />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Enter the text you wish to convert in the input field.</li>
                  <li>Select a voice from the available options. You can preview each one.</li>
                  <li>Click the "Synthesize" or "Generate" button to process the audio.</li>
                  <li>Use the audio player to listen to the result and download it.</li>
              </ol>
          </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline text-center">Related Tools</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map(tool => (
             <Link href={tool.href} key={tool.href} className="group">
                <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                  <CardHeader>
                    <CardTitle as="h3" className="font-headline text-lg flex items-center gap-2">
                      <tool.icon className="h-6 w-6 shrink-0 text-primary" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
