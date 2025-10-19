import { PageHeader } from '@/components/page-header';

export default function TipsGuidesPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Tips & Guides" />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          We are preparing a lot of useful content for you. Check back soon for
          tips, tutorials, and guides on how to make the most of our online
          tools and boost your productivity!
        </p>
      </div>
    </div>
  );
}
