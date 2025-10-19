import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { KanbanBoard } from './kanban-board';

const tool = {
  title: 'Kanban Board',
  description: 'Organize your tasks and visualize your workflow with a simple drag-and-drop Kanban board. Perfect for personal projects and team collaboration.',
  path: '/tools/project-management/kanban-board',
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

export default function KanbanBoardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Kanban Board"
        description="Organize your tasks with a drag-and-drop Kanban board. Import and export your data."
      />
      <KanbanBoard />
       <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline">How to Use This Tool</h2>
          <div className="prose dark:prose-invert mt-4">
              <ol>
                  <li>Add new columns for your workflow stages by typing a title and clicking <strong>Add Column</strong>.</li>
                  <li>Click <strong>Add Task</strong> at the bottom of any column to create a new task card.</li>
                  <li>Click on a task card to edit its content, set a due date, or assign a priority.</li>
                  <li>On desktop, drag and drop tasks between columns to update their status.</li>
                  <li>On mobile, click the move icon on a task card to send it to a different column.</li>
                  <li>Use the <strong>Import/Export</strong> buttons to save your board state as a file or load a previous board.</li>
              </ol>
          </div>
      </section>
    </>
  );
}
