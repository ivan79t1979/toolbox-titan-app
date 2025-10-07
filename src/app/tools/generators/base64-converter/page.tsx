import { PageHeader } from '@/components/page-header';
import { Base64ConverterForm } from './base64-converter-form';

export default function Base64ConverterPage() {
  return (
    <>
      <PageHeader
        title="Base64 Converter"
        description="Encode plain text to Base64 or decode Base64 back to plain text."
      />
      <Base64ConverterForm />
    </>
  );
}
