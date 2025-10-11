import { PageHeader } from '@/components/page-header';

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Cookie Policy" />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          We use cookies to improve your experience. This is a placeholder for
          your cookie policy.
        </p>
      </div>
    </div>
  );
}
