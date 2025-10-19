
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
        description="Your one-stop suite of free, browser-based utilities designed for creators, developers, and professionals. Whether you need to write better content, design stunning graphics, manage projects, or perform quick calculations, our tools are built to streamline your workflow without any downloads or subscriptions."
      />

      <div className="mb-8 hidden justify-center md:flex">
        <AdPlaceholder width={728} height={90} />
      </div>

      <div className="space-y-12">
        {toolCategories.map((category) => (
          <section key={category.name}>
            <div className="mb-6 flex items-start gap-4 md:items-center">
              <category.icon className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h2 className="text-2xl font-bold font-headline">
                  {category.name}
                </h2>
                <p className="mt-1 text-muted-foreground">{category.description}</p>
              </div>
            </div>
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

      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline text-center">Suggestions for Getting Started</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle as="h3" className="font-headline text-lg">Start with a Goal</CardTitle>
              <CardDescription>Know what you want to achieve. Need a quick password? Head to the Password Generator. Need to organize a project? Try the Kanban Board.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle as="h3" className="font-headline text-lg">Explore Categories</CardTitle>
              <CardDescription>Our tools are grouped logically. If you're a writer, check the "Online writing tools" section first. Designers should look under "Graphic design tools".</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle as="h3" className="font-headline text-lg">Use AI for Creativity</CardTitle>
              <CardDescription>Don't be afraid to use the AI Writing Assistant or Text Summarizer to brainstorm ideas or condense information quickly.</CardDescription>
            </CardHeader>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle as="h3" className="font-headline text-lg">Bookmark Your Favorites</CardTitle>
              <CardDescription>If you use a tool often, bookmark its page for instant access next time. All tools have their own unique URL.</CardDescription>
            </CardHeader>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle as="h3" className="font-headline text-lg">Combine Tools</CardTitle>
              <CardDescription>Generate text with the AI Assistant, check its readability with the Analyzer, and then count the words with the Word Counter. Your workflow, your way.</CardDescription>
            </CardHeader>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle as="h3" className="font-headline text-lg">No Downloads Needed</CardTitle>
              <CardDescription>Remember, every tool runs directly in your browser. There's no software to install, which keeps your device safe and clean.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline text-center">Frequently Asked Questions (FAQ)</h2>
        <div className="mt-6 max-w-3xl mx-auto space-y-4">
          <div>
            <h3 className="font-semibold">What is Modern Online Tools?</h3>
            <p className="text-muted-foreground">Modern Online Tools is a free suite of web tools for writing, design, math, time tracking, and project management.</p>
          </div>
          <div>
            <h3 className="font-semibold">Who is this for?</h3>
            <p className="text-muted-foreground">Content creators, writers, designers, developers, and teams that want quick, browser-based utilities.</p>
          </div>
          <div>
            <h3 className="font-semibold">What categories of tools are available?</h3>
            <p className="text-muted-foreground">Writers, designers, generators, timers, math, and project management.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I find a tool fast?</h3>
            <p className="text-muted-foreground">Use the category list and click the tool name to open it directly.</p>
          </div>
          <div>
            <h3 className="font-semibold">What are the most used tools?</h3>
            <p className="text-muted-foreground">AI Writing Assistant, Word Counter, Background Remover, Image Resizer, Password Generator, and Kanban Board see frequent use.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
