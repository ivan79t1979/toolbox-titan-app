import { PageHeader } from '@/components/page-header';
import { GanttChart } from './gantt-chart';

export default function GanttChartPage() {
  return (
    <>
      <PageHeader
        title="Gantt Chart"
        description="Visualize your project timeline, manage tasks, and track progress with an interactive Gantt chart."
      />
      <GanttChart />
    </>
  );
}
