import { PageHeader } from '@/components/page-header';
import { CssShadowGeneratorForm } from './css-shadow-generator-form';

export default function CssShadowGeneratorPage() {
  return (
    <>
      <PageHeader
        title="CSS Shadow Generator"
        description="Visually create and customize box-shadow effects and get the CSS code."
      />
      <CssShadowGeneratorForm />
    </>
  );
}
