import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function HashGeneratorPage() {
  return (
    <>
      <PageHeader
        title="Hash Generator"
        description="Generate hashes from text."
      />
      <ToolPlaceholder />
    </>
  );
}
