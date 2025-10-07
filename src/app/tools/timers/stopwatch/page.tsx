import { PageHeader } from '@/components/page-header';
import { Stopwatch } from './stopwatch';

export default function StopwatchPage() {
  return (
    <>
      <PageHeader title="Stopwatch" description="Measure elapsed time with laps." />
      <Stopwatch />
    </>
  );
}
