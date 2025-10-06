import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function CountdownTimerPage() {
  return (
    <>
      <PageHeader
        title="Countdown Timer"
        description="Count down from a specified time."
      />
      <ToolPlaceholder />
    </>
  );
}
