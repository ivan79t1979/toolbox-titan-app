import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CssShadowGeneratorForm } from './css-shadow-generator-form';

const tool = {
  title: 'CSS Shadow Generator',
  description: 'Visually create and customize complex CSS box-shadow effects. Instantly generate the code for your web projects.',
  path: '/tools/designers/css-shadow-generator',
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

export default function CssShadowGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="CSS Shadow Generator"
        description="Visually create and customize box-shadow effects and get the CSS code."
      />
      <CssShadowGeneratorForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Use the sliders to adjust the <strong>Horizontal Offset</strong>, <strong>Vertical Offset</strong>, <strong>Blur Radius</strong>, and <strong>Spread Radius</strong>.</li>
                  <li>Pick a <strong>Shadow Color</strong> and adjust its <strong>Opacity</strong> using the color picker and slider.</li>
                  <li>Toggle the <strong>Inset</strong> switch to create an inner shadow instead of an outer one.</li>
                  <li>Change the <strong>Box Color</strong> and <strong>Background Color</strong> to preview how the shadow looks in different contexts.</li>
                  <li>Copy the generated <code>box-shadow</code> CSS code from the input field at the bottom right.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
