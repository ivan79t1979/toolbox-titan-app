import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TodoList } from './todo-list';

const tool = {
  title: 'To-Do List',
  description: 'A simple, powerful, and easy-to-use to-do list to help you manage your tasks. Organize your day and stay productive.',
  path: '/tools/project-management/todo-list',
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

export default function TodoListPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title="To-Do List" description="A simple and powerful to-do list with import/export functionality." />
      <TodoList />
    </>
  );
}
