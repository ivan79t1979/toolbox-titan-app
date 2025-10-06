import { PageHeader } from '@/components/page-header';
import { ToolPlaceholder } from '@/components/tool-placeholder';

export default function ColorPaletteExtractorPage() {
  return (
    <>
      <PageHeader
        title="Color Palette Extractor"
        description="Extract colors from an image."
      />
      <ToolPlaceholder />
    </>
  );
}
