import { PageHeader } from '@/components/page-header';
import { ColorPickerConverterForm } from './color-picker-converter-form';

export default function ColorPickerConverterPage() {
  return (
    <>
      <PageHeader
        title="Color Picker & Converter"
        description="Pick a color and convert it to different formats like HEX, RGB, and HSL."
      />
      <ColorPickerConverterForm />
    </>
  );
}
