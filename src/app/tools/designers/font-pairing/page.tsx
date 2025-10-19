import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { FontPairingTool } from './font-pairing-tool';

const tool = {
  title: 'AI Font Pairing Generator',
  description: 'Discover beautiful and professional font pairings for your website. Get AI-powered suggestions for headlines and body text from Google Fonts.',
  path: '/tools/designers/font-pairing',
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

export default function FontPairingPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="AI Font Pairing"
        description="Discover beautiful font pairings from Google Fonts, suggested by AI."
      />
      <FontPairingTool />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>(Optional) Change the preview text for headlines and body copy to match your content.</li>
                  <li><strong>Manual Pairing:</strong> Use the dropdown menus to search and select a headline and body font from Google Fonts.</li>
                  <li><strong>AI Suggestions:</strong> Describe a style (e.g., "playful and bold") and click <strong>Generate Pairings</strong>.</li>
                  <li>Review the generated previews. Each font is loaded dynamically from Google Fonts.</li>
                  <li>Click the <strong>PNG</strong> or <strong>PDF</strong> buttons to export a preview image of your favorite pairing.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
