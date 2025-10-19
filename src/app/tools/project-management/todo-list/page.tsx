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
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Type a new task into the input field and click <strong>Add</strong>.</li>
                  <li>Your new task will appear at the top of the list.</li>
                  <li>Click the checkbox next to a task to mark it as complete.</li>
                  <li>Use the drag handle (grip icon) to reorder your tasks.</li>
                  <li>Hover over a task and click the trash can icon to delete it.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save your list or load a previous one.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
