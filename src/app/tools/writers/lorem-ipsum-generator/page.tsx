import { PageHeader } from '@/components/page-header';
import { LoremIpsumForm } from './lorem-ipsum-form';

export default function LoremIpsumPage() {
  return (
    <>
      <PageHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text."
      />
      <LoremIpsumForm />
    </>
  );
}
