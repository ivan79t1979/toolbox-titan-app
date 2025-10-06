import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function BudgetPlannerPage() {
  return (
    <>
      <PageHeader
        title="Budget Planner"
        description="Track income, expenses, and budgets."
      />
      <ToolPlaceholder />
    </>
  );
}
