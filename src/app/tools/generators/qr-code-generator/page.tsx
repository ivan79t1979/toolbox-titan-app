import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function QrCodeGeneratorPage() {
  return (
    <>
      <PageHeader
        title="QR Code Generator"
        description="Generate QR codes from text or URLs."
      />
      <ToolPlaceholder />
    </>
  );
}
