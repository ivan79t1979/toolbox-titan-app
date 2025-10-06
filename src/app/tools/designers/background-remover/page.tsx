import { PageHeader } from '@/components/page-header';
import { BackgroundRemoverForm } from './background-remover-form';

export default function BackgroundRemoverPage() {
  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image."
      />
      <BackgroundRemoverForm />
    </>
  );
}
