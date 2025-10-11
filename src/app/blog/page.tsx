import { PageHeader } from '@/components/page-header';

export default function BlogPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Blog" />
      <div className="prose dark:prose-invert max-w-none">
        <p>Welcome to our blog. Check back soon for updates!</p>
      </div>
    </div>
  );
}
