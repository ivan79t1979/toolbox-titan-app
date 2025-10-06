import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function TextDiffPage() {
  return (
    <>
      <PageHeader
        title="Text Diff"
        description="Compare two texts and highlight differences."
      />
      <ToolPlaceholder />
    </>
  );
}
