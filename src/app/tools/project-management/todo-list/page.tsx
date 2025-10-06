import { PageHeader } from '@/components/page-header';
import { TodoList } from './todo-list';

export default function TodoListPage() {
  return (
    <>
      <PageHeader title="To-Do List" description="A simple and powerful to-do list with import/export functionality." />
      <TodoList />
    </>
  );
}
