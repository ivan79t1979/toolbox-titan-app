import { PageHeader } from '@/components/page-header';
import { KanbanBoard } from './kanban-board';

export default function KanbanBoardPage() {
  return (
    <>
      <PageHeader
        title="Kanban Board"
        description="Organize your tasks with a drag-and-drop Kanban board. Import and export your data."
      />
      <KanbanBoard />
    </>
  );
}
