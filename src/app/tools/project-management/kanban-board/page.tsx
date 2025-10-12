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
    </>
  );
}
