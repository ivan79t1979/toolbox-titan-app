import { PageHeader } from '@/components/page-header';
import { TextSummarizerForm } from './text-summarizer-form';

export default function TextSummarizerPage() {
  return (
    <>
      <PageHeader
        title="Text Summarizer"
        description="Condense long articles, papers, or documents into key points with AI."
      />
      <TextSummarizerForm />
    </>
  );
}
