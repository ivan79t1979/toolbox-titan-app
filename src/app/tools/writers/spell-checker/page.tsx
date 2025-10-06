import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function SpellCheckerPage() {
  return (
    <>
      <PageHeader
        title="Spell Checker"
        description="Check spelling and get suggestions."
      />
      <ToolPlaceholder />
    </>
  );
}
