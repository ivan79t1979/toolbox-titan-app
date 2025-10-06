import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function TimeTrackerPage() {
  return (
    <>
      <PageHeader
        title="Time Tracker"
        description="Track time spent on tasks."
      />
      <ToolPlaceholder />
    </>
  );
}
