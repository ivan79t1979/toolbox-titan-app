import { PageHeader } from '@/components/page-header';
import { SpellCheckerForm } from './spell-checker-form';

export default function SpellCheckerPage() {
  return (
    <>
      <PageHeader
        title="Spell Checker"
        description="Check spelling and grammar, and get suggestions for improvement."
      />
      <SpellCheckerForm />
    </>
  );
}
