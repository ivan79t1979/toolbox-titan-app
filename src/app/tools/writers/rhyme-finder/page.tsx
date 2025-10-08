import { PageHeader } from '@/components/page-header';
import { RhymeFinderForm } from './rhyme-finder-form';

export default function RhymeFinderPage() {
  return (
    <>
      <PageHeader
        title="Rhyme Finder"
        description="Find the perfect rhyme for your poems, songs, or creative writing."
      />
      <RhymeFinderForm />
    </>
  );
}
