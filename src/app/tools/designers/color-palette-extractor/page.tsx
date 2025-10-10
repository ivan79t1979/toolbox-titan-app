import { PageHeader } from '@/components/page-header';
import { ColorPaletteExtractorForm } from './color-palette-extractor-form';

export default function ColorPaletteExtractorPage() {
  return (
    <>
      <PageHeader
        title="Color Palette Extractor"
        description="Upload an image to automatically extract its dominant color palette with AI."
      />
      <ColorPaletteExtractorForm />
    </>
  );
}