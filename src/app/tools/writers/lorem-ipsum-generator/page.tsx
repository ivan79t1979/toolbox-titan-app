import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function LoremIpsumPage() {
  return (
    <>
      <PageHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text."
      />
      <ToolPlaceholder />
    </>
  );
}
