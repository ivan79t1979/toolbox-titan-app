import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function TimeZoneConverterPage() {
  return (
    <>
      <PageHeader
        title="Time Zone Converter"
        description="Convert time between time zones."
      />
      <ToolPlaceholder />
    </>
  );
}
