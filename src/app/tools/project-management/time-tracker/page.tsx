import { PageHeader } from '@/components/page-header';
import { TimeTracker } from './time-tracker';

export default function TimeTrackerPage() {
  return (
    <>
      <PageHeader
        title="Time Tracker"
        description="Track the time you spend on different tasks and projects with a simple start/stop timer."
      />
      <TimeTracker />
    </>
  );
}
