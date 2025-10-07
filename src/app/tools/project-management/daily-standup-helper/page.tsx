import { PageHeader } from '@/components/page-header';
import { DailyStandupHelperForm } from './daily-standup-helper-form';

export default function DailyStandupHelperPage() {
  return (
    <>
      <PageHeader
        title="Daily Standup Helper"
        description="Quickly prepare and format your daily standup updates."
      />
      <DailyStandupHelperForm />
    </>
  );
}
