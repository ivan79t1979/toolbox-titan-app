import { PageHeader } from '@/components/page-header';

export default function AboutPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="About Us" />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to Modern Online Tools. We are dedicated to providing the best
          free online tools to boost your productivity.
        </p>
      </div>
    </div>
  );
}
