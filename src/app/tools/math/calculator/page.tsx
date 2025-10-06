import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        title="Simple & Advanced Calculator"
        description="From basic to scientific calculations."
      />
      <ToolPlaceholder />
    </>
  );
}
