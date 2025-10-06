import { PageHeader } from '@/components/page-header';
import { MilestoneTracker } from './milestone-tracker';

export default function MilestoneTrackerPage() {
  return (
    <>
      <PageHeader
        title="Milestone Tracker"
        description="Track project milestones and deadlines."
      />
      <MilestoneTracker />
    </>
  );
}
