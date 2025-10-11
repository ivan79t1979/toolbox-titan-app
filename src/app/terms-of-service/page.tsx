import { PageHeader } from '@/components/page-header';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Terms of Service" />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          By using our service, you agree to our terms. This is a placeholder
          for your terms of service.
        </p>
      </div>
    </div>
  );
}
