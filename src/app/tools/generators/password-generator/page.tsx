import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PasswordGeneratorForm } from './password-generator-form';
import { NordPassBanner } from '@/components/nordpass-banner';
import { NordVPNBanner } from '@/components/nordvpn-banner';

const tool = {
  title: 'Secure Password Generator',
  description: 'Generate strong, secure, and random passwords with customizable length and character sets (uppercase, numbers, symbols).',
  path: '/tools/generators/password-generator',
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
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Password Generator"
        description="Generate secure passwords."
      />
      <NordVPNBanner />
      <div className="my-8">
        <PasswordGeneratorForm />
      </div>
      <NordPassBanner />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Use the slider to set your desired <strong>Password Length</strong> (from 8 to 64 characters).</li>
                  <li>Check or uncheck the boxes to include or exclude <strong>Uppercase</strong> letters, <strong>Numbers</strong>, and <strong>Symbols</strong>.</li>
                  <li>Click the <strong>Generate New Password</strong> button.</li>
                  <li>A new password will be added to the list below.</li>
                  <li>Click the copy icon to copy an individual password, or use the "Copy All" and "Clear All" buttons to manage your list.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
