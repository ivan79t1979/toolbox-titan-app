import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function MeetingPlannerPage() {
  return (
    <>
      <PageHeader
        title="Meeting Planner"
        description="Plan and schedule meetings."
      />
      <ToolPlaceholder />
    </>
  );
}
