import { PageHeader } from '@/components/page-header';
import { PercentageCalculatorForm } from './percentage-calculator-form';

export default function PercentageCalculatorPage() {
  return (
    <>
      <PageHeader
        title="Percentage Calculator"
        description="All your percentage calculation needs."
      />
      <PercentageCalculatorForm />
    </>
  );
}
