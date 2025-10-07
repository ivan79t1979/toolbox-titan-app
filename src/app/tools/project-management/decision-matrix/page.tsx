import { PageHeader } from '@/components/page-header';
import { DecisionMatrixTool } from './decision-matrix-tool';

export default function DecisionMatrixPage() {
  return (
    <>
      <PageHeader
        title="Decision Matrix"
        description="Make better decisions by evaluating your options against weighted criteria. The best choice is highlighted for you."
      />
      <DecisionMatrixTool />
    </>
  );
}
