
import { PageHeader } from '@/components/page-header';
import { toolCategories } from '@/lib/tools';
import Link from 'next/link';
import type { Metadata } from 'next';
import { allTools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'A complete list of all tools and pages available on Modern Online Tools.',
  alternates: {
    canonical: '/sitemap',
  },
};

const staticPages = [
    { href: '/', title: 'Home' },
    { href: '/about', title: 'About Us' },
    { href: '/tips-guides', title: 'Tips & Guides' },
    { href: '/advertisers', title: 'Advertisers' },
    { href: '/privacy-policy', title: 'Privacy Policy' },
    { href: '/terms-of-service', title: 'Terms of Service' },
    { href: '/cookie-policy', title: 'Cookie Policy' },
    { href: '/disclaimer', title: 'Disclaimer' },
];

export default function SitemapPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Sitemap"
        description="A complete overview of all pages and tools available on the site."
      />
      <div className="prose dark:prose-invert max-w-none">
        <h2>Main Pages</h2>
        <ul>
          {staticPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href}>{page.title}</Link>
            </li>
          ))}
        </ul>

        {toolCategories.map((category) => (
            <div key={category.name}>
                <h2>{category.name}</h2>
                <ul>
                    {category.tools.map((tool) => (
                        <li key={tool.href}>
                            <Link href={tool.href}>{tool.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
      </div>
    </div>
  );
}
