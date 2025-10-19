import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { GradientMakerForm } from './gradient-maker-form';

const tool = {
  title: 'CSS Gradient Maker',
  description: 'Easily create beautiful CSS linear and radial gradients. Customize colors, angle, and stops, then copy the generated code instantly.',
  path: '/tools/designers/gradient-maker',
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

export default function GradientMakerPage() {
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title="Gradient Maker" description="Create beautiful CSS gradients with ease. Customize colors, types, and angles, then copy the code." />
      <GradientMakerForm />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select a gradient <strong>Type</strong> (Linear or Radial) and adjust the <strong>Angle</strong> for linear gradients.</li>
                  <li>For each color stop, use the color picker to change the color and the slider to adjust its <strong>Opacity</strong>.</li>
                  <li>Drag the position slider for each color to define where it appears in the gradient.</li>
                  <li>Click <strong>Add Color</strong> to add more stops or the trash icon to remove one (a minimum of two is required).</li>
                  <li>Copy the generated CSS code from the box at the bottom right. The preview updates live.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
