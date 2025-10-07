import { PageHeader } from '@/components/page-header';
import { UnitConverterForm } from './unit-converter-form';

export default function UnitConverterPage() {
  return (
    <>
      <PageHeader
        title="Unit Converter"
        description="Convert between various units for length, mass, temperature, and more."
      />
      <UnitConverterForm />
    </>
  );
}
