import { PageHeader } from '@/components/page-header';
import { Calculator } from './calculator';

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        title="Simple & Advanced Calculator"
        description="From basic to scientific calculations."
      />
      <Calculator />
    </>
  );
}
