import { PageHeader } from '@/components/page-header';
import { SvgShapeGeneratorForm } from './svg-shape-generator-form';

export default function SvgShapeGeneratorPage() {
  return (
    <>
      <PageHeader
        title="SVG Shape Generator"
        description="Create and customize basic SVG shapes, and copy the code."
      />
      <SvgShapeGeneratorForm />
    </>
  );
}
