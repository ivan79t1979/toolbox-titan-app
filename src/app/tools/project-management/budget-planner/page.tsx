import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { BudgetPlanner } from './budget-planner';

const tool = {
  title: 'Budget Planner',
  description: 'A simple, visual budget planner to track your income and expenses. See your financial health at a glance with charts and summaries.',
  path: '/tools/project-management/budget-planner',
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
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  url: `https://modernonlinetools.com${tool.path}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function BudgetPlannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Budget Planner"
        description="Track income, expenses, and visualize your financial health."
      />
      <BudgetPlanner />
    </>
  );
}
