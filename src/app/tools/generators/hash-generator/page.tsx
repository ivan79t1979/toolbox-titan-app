import { PageHeader } from '@/components/page-header';
import { HashGeneratorForm } from './hash-generator-form';

export default function HashGeneratorPage() {
  return (
    <>
      <PageHeader
        title="Hash Generator"
        description="Generate hashes from text using MD5, SHA-1, SHA-256, and SHA-512."
      />
      <HashGeneratorForm />
    </>
  );
}
