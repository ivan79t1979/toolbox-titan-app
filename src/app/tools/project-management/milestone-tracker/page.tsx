import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function MilestoneTrackerPage() {
  return (
    <>
      <PageHeader
        title="Milestone Tracker"
        description="Track project milestones and deadlines."
      />
      <ToolPlaceholder />
    </>
  );
}
