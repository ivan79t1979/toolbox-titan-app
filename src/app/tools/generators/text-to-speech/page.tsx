import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function TextToSpeechPage() {
  return (
    <>
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio."
      />
      <ToolPlaceholder />
    </>
  );
}
