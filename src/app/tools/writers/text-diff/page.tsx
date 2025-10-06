import { PageHeader } from '@/components/page-header';
import { TextDiffForm } from './text-diff-form';

export default function TextDiffPage() {
  return (
    <>
      <PageHeader
        title="Text Diff"
        description="Compare two texts and highlight differences."
      />
      <TextDiffForm />
    </>
  );
}
