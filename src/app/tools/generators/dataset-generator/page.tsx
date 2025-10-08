import { PageHeader } from '@/components/page-header';
import { DatasetGeneratorForm } from './dataset-generator-form';

export default function DatasetGeneratorPage() {
  return (
    <>
      <PageHeader
        title="AI Dataset Generator"
        description="Describe the data you need, and AI will generate it for you in JSON or CSV format."
      />
      <DatasetGeneratorForm />
    </>
  );
}
