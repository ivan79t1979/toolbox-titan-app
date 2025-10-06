import { PageHeader } from '@/components/page-header';
import { BudgetPlanner } from './budget-planner';

export default function BudgetPlannerPage() {
  return (
    <>
      <PageHeader
        title="Budget Planner"
        description="Track income, expenses, and visualize your financial health."
      />
      <BudgetPlanner />
    </>
  );
}
