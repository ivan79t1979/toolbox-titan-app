import { allTools } from '@/lib/tools';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';

export default function Home() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Welcome to Toolbox Titan"
        description="Your one-stop suite of free online productivity tools. Designed for content creators, writers, designers, and professionals."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allTools.map((tool) => (
          <Link href={tool.href} key={tool.href} className="group">
            <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <tool.icon className="h-8 w-8 shrink-0 text-primary" />
                <div>
                  <CardTitle className="font-headline text-lg">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
