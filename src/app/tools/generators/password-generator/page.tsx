import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { PasswordGeneratorForm } from './password-generator-form';
import { NordPassBanner } from '@/components/nordpass-banner';
import { NordVPNBanner } from '@/components/nordvpn-banner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

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

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/hash-generator'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/uuid-generator'),
].filter(Boolean) as any[];

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
