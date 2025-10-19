
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const articles = [
    {
        title: 'How to Choose and Use the Right Online Tool for Your Task',
        description: 'With dozens of free utilities at your fingertips, knowing which one to pick can sometimes be as challenging as the task itself. This guide is designed to help you navigate our suite and create an efficient workflow.',
        href: '/tips-guides/how-to-choose-online-tool',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    }
];

export default function TipsGuidesPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Tips & Guides"
        description="A curated collection of articles to help you get the most out of our free online tools."
      />
      <div className="space-y-8">
        {articles.map((article) => (
            <Card key={article.href}>
                <CardHeader>
                    <CardTitle as="h2" className="font-headline text-2xl">
                        <Link href={article.href} className="hover:underline">{article.title}</Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Posted on {article.date}</p>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-muted-foreground">{article.description}</p>
                    <Button asChild>
                        <Link href={article.href}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
