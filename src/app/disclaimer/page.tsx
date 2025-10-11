import { PageHeader } from '@/components/page-header';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Disclaimer" />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          The information provided by our tools is for general informational
          purposes only.
        </p>
      </div>
    </div>
  );
}
