import { PageHeader } from '@/components/page-header';
import { UuidGeneratorForm } from './uuid-generator-form';

export default function UuidGeneratorPage() {
  return (
    <>
      <PageHeader
        title="UUID Generator"
        description="Generate unique Version 4 UUIDs."
      />
      <UuidGeneratorForm />
    </>
  );
}
