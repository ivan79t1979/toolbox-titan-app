import { PageHeader } from '@/components/page-header';
import { CountdownTimer } from './countdown-timer';

export default function CountdownTimerPage() {
  return (
    <>
      <PageHeader
        title="Countdown Timer"
        description="Count down from a specified time."
      />
      <CountdownTimer />
    </>
  );
}
