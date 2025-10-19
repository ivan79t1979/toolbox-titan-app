import { toolCategories } from '@/lib/tools';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { AdPlaceholder } from '@/components/ad-placeholder';

export default function Home() {
  const adIndices = [2, 7, 12, 17, 22];
  let toolCounter = 0;

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Welcome to Modern Online Tools"
        description="Your one-stop suite of free online productivity tools. Designed for content creators, writers, designers, and professionals."
      />

      <div className="mb-8 hidden justify-center md:flex">
        <AdPlaceholder width={728} height={90} />
      </div>

      <div className="space-y-12">
        {toolCategories.map((category) => (
          <section key={category.name}>
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold font-headline">
              <category.icon className="h-7 w-7 text-primary" />
              {category.name}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.tools.map((tool) => {
                const showAd = adIndices.includes(toolCounter++);
                if (showAd) {
                  return (
                    <div key={`ad-${toolCounter}`} className="flex items-center justify-center">
                       <AdPlaceholder width={300} height={250} />
                    </div>
                  );
                }
                return (
                  <Link href={tool.href} key={tool.href} className="group">
                    <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <tool.icon className="h-8 w-8 shrink-0 text-primary" />
                        <div>
                          <CardTitle as="h3" className="font-headline text-lg">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
