
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ResumeBuilderForm } from './resume-builder-form';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolCategories } from '@/lib/tools';

const tool = {
  title: 'Resume Builder',
  description: 'Create a professional resume for free. Customize sections, change labels, add a photo, and download as a PDF.',
  path: '/tools/generators/resume-builder',
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
  applicationCategory: 'Productivity',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const relatedTools = [
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/generators/invoice-generator'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/spell-checker'),
  toolCategories.flatMap(cat => cat.tools).find(t => t.href === '/tools/writers/case-converter'),
].filter(Boolean) as any[];

export default function ResumeBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Resume Builder"
        description="Build a professional resume with ease and download it as a PDF."
      />
      <ResumeBuilderForm />
      <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Fill in your <strong>Personal Details</strong> like your name, email, and phone number. You can also upload a photo.</li>
                  <li>Click <strong>Add Experience</strong> to create entries for your work history. Fill in the company, role, dates, and a description for each.</li>
                  <li>Use the <strong>Add Education</strong> button to list your academic qualifications.</li>
                  <li>Add relevant abilities under the <strong>Skills</strong> section.</li>
                  <li>Customize the resume's section headers (e.g., change "Work Experience" to "Professional History") in the <strong>Settings & Labels</strong> section.</li>
                  <li>As you fill out the form on the left, a live preview of your resume will be generated on the right.</li>
                  <li>When you are finished, click the <strong>Download PDF</strong> button to save your resume.</li>
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
