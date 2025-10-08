import { PageHeader } from '@/components/page-header';
import { FaviconGeneratorForm } from './favicon-generator-form';

export default function FaviconGeneratorPage() {
  return (
    <>
      <PageHeader
        title="Favicon Generator"
        description="Create favicons for your website from an image."
      />
      <FaviconGeneratorForm />
    </>
  );
}
