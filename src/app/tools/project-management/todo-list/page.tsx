import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function TodoListPage() {
  return (
    <>
      <PageHeader title="To-Do List" description="Simple task tracking." />
      <ToolPlaceholder />
    </>
  );
}
