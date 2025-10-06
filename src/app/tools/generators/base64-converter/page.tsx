import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function Base64ConverterPage() {
  return (
    <>
      <PageHeader
        title="Base64 Converter"
        description="Encode and decode Base64."
      />
      <ToolPlaceholder />
    </>
  );
}
