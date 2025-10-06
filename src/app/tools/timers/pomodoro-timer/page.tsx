import { PageHeader } from '@/components/page-header';
import { PomodoroTimer } from './pomodoro-timer';

export default function PomodoroTimerPage() {
  return (
    <>
      <PageHeader
        title="Pomodoro Timer"
        description="Boost your productivity with the Pomodoro Technique. Customize your work and break intervals."
      />
      <PomodoroTimer />
    </>
  );
}
