import { PageHeader } from '@/components/page-header';
import { MeetingPlanner } from './meeting-planner';

export default function MeetingPlannerPage() {
  return (
    <>
      <PageHeader
        title="Meeting Planner"
        description="Plan and schedule meetings, manage attendees, and set agendas."
      />
      <MeetingPlanner />
    </>
  );
}
