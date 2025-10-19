import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { QrCodeGeneratorForm } from './qr-code-generator-form';
import { MeQrBanner } from '@/components/me-qr-banner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'QR Code Generator',
  description: 'Create custom QR codes for URLs, text, Wi-Fi networks, SMS, email, and more. Download your QR code for free.',
  path: '/tools/generators/qr-code-generator',
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
  applicationCategory: 'Utilities',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/uuid-generator'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/base64-converter'),
].filter(Boolean) as any[];

export default function QrCodeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="QR Code Generator"
        description="Generate QR codes from text or URLs."
      />
      <QrCodeGeneratorForm />
      <MeQrBanner />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Select the type of QR code you want to create (URL, Text, Email, etc.) from the dropdown menu.</li>
                  <li>Fill in the required information for your chosen type.</li>
                  <li>Customize the <strong>Size</strong>, <strong>Foreground Color</strong>, and <strong>Background Color</strong> of your QR code.</li>
                  <li>The QR code preview on the right will update instantly.</li>
                  <li>Click the <strong>Download QR Code</strong> button to save the generated code as a PNG image.</li>
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
