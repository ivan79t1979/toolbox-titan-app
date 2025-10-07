import { PageHeader } from '@/components/page-header';
import { WorldClock } from './world-clock';

export default function WorldClockPage() {
  return (
    <>
      <PageHeader
        title="World Clock"
        description="Current time in different time zones."
      />
      <WorldClock />
    </>
  );
}
