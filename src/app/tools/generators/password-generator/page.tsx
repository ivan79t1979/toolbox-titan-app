import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function PasswordGeneratorPage() {
  return (
    <>
      <PageHeader
        title="Password Generator"
        description="Generate secure passwords."
      />
      <ToolPlaceholder />
    </>
  );
}
