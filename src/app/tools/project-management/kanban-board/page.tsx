import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function KanbanBoardPage() {
  return (
    <>
      <PageHeader
        title="Kanban Board"
        description="Visual project management tool."
      />
      <ToolPlaceholder />
    </>
  );
}
