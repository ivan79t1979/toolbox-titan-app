import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function GanttChartPage() {
  return (
    <>
      <PageHeader
        title="Gantt Chart"
        description="Visualize project schedules."
      />
      <ToolPlaceholder />
    </>
  );
}
