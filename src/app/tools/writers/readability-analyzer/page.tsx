import { PageHeader } from '@/components/page-header';
import { ReadabilityAnalyzerForm } from './readability-analyzer-form';

export default function ReadabilityAnalyzerPage() {
  return (
    <>
      <PageHeader
        title="Readability Analyzer"
        description="Analyze your text to gauge its complexity and readability."
      />
      <ReadabilityAnalyzerForm />
    </>
  );
}
