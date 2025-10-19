import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { InvoiceGenerator } from './invoice-generator';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Invoice Generator',
  description: 'Create, customize, and download professional PDF invoices for free. Add your logo, line items, taxes, and notes with ease.',
  path: '/tools/generators/invoice-generator',
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
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/time-tracker'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/project-management/budget-planner'),
].filter(Boolean) as any[];

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Invoice Generator"
        description="Create, customize, and download professional invoices with ease."
      />
      <InvoiceGenerator />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Fill in <strong>Your Details</strong> and the <strong>Client Details</strong> in the respective text boxes.</li>
                  <li>(Optional) Upload your company logo.</li>
                  <li>Set the <strong>Invoice #</strong>, <strong>Date</strong>, and optional <strong>Due Date</strong>.</li>
                  <li>Add or edit line items, specifying a description, quantity, and rate for each.</li>
                  <li>Set a <strong>Tax Rate</strong> and add any final <strong>Notes</strong>.</li>
                  <li>All changes will be reflected live in the invoice preview on the right.</li>
                  <li>When you're ready, click the <strong>Download Invoice PDF</strong> button to save your invoice.</li>
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
