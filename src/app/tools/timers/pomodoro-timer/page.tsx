import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function PomodoroTimerPage() {
  return (
    <>
      <PageHeader
        title="Pomodoro Timer"
        description="A timer for the Pomodoro Technique."
      />
      <ToolPlaceholder />
    </>
  );
}
