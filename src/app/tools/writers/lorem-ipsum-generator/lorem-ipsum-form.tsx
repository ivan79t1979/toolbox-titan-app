'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ipsumSources = {
  standard: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  latin: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  hipster: 'I\'\'\'m baby whatever trust fund readymade meditation. Migas humblebrag try-hard, tousled next level schlitz hot chicken deep v poke PBR&B. Adaptogen meh schlitz, readymade yr cred banjo narwhal post-ironic ennui. Lumbersexual taxidermy la croix whatever. Four dollar toast subway tile tilde kitsch, typewriter tofu direct trade narwhal. Cornhole lomo VHS, pitchfork godard coloring book direct trade photo booth.',
  cupcake: 'Cupcake ipsum dolor sit amet. Sweet roll ice cream dragée. Toffee chocolate bar oat cake liquorice lemon drops. Jelly beans powder marzipan gingerbread candy canes. Chupa chups jelly-o tootsie roll sugar plum. Icing sweet roll lollipop cake gummi bears sesame snaps. Donut cheesecake sweet roll oat cake. Macaroon cotton candy jelly beans pastry pudding lollipop. Gummies danish caramels brownie.',
  pirate: 'Avast ye scurvy dog! Shiver me timbers, blow the man down. Dead men tell no tales. Heave to, ye bilge rat! Walk the plank! Booty and plunder, arrr. Hornswoggle the landlubber. Ahoy, matey! Three sheets to the wind. Hoist the colours! No prey, no pay. Yo-ho-ho and a bottle o\'\'\' rum. The black spot! Batten down the hatches!',
};

const formSchema = z.object({
  type: z.enum(['paragraphs', 'sentences', 'words']),
  count: z.coerce.number().min(1, 'Count must be at least 1.'),
  ipsumType: z.enum(['standard', 'latin', 'hipster', 'cupcake', 'pirate']),
  includeHeadings: z.boolean(),
  includeLinks: z.boolean(),
  includeLists: z.boolean(),
  decorative: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const getWords = (text: string) => text.replace(/[.,]/g, '').split(/\s+/);
const getSentences = (text: string) => text.match(/[^.!?]+[.!?]+/g) || [];

const generateStructure = (
  values: FormValues,
  sourceText: string
): string => {
  const {
    type,
    count,
    includeHeadings,
    includeLinks,
    includeLists,
    decorative,
  } = values;
  
  const sourceWords = getWords(sourceText);
  const sourceSentences = getSentences(sourceText);
  
  const makeWord = () => sourceWords[Math.floor(Math.random() * sourceWords.length)];
  const makeSentence = (wordCount: number) => {
    let s = Array.from({ length: wordCount }, makeWord).join(' ');
    s = s.charAt(0).toUpperCase() + s.slice(1) + '.';
    if (decorative && Math.random() < 0.2) s = `<strong>${s}</strong>`;
    if (decorative && Math.random() < 0.2) s = `<em>${s}</em>`;
    return s;
  };
  const makeParagraph = (sentenceCount: number) => Array.from({ length: sentenceCount }, () => makeSentence(Math.floor(Math.random() * 8) + 8)).join(' ');

  let parts: string[] = [];

  for (let i = 0; i < count; i++) {
    // Add headings
    if (includeHeadings && i % 2 === 0 && i > 0 && type === 'paragraphs') {
      parts.push(`<h2>${makeSentence(Math.floor(Math.random() * 5) + 3)}</h2>`);
    }

    // Add main content
    switch (type) {
      case 'paragraphs':
        parts.push(`<p>${makeParagraph(Math.floor(Math.random() * 4) + 4)}</p>`);
        break;
      case 'sentences':
        parts.push(makeSentence(Math.floor(Math.random() * 10) + 5));
        break;
      case 'words':
        parts.push(makeWord());
        break;
    }

    // Add links
    if (includeLinks && i % 3 === 0 && type === 'paragraphs') {
       const paragraphIndex = parts.length - 1;
       if(parts[paragraphIndex]?.startsWith('<p>')){
         parts[paragraphIndex] = parts[paragraphIndex].replace(/(\w+\s+\w+)/, '<a href="#">$1</a>');
       }
    }

    // Add lists
    if (includeLists && i % 4 === 0 && i > 0 && type === 'paragraphs') {
      let listItems = '';
      for (let j = 0; j < Math.floor(Math.random() * 3) + 3; j++) {
        listItems += `<li>${makeSentence(Math.floor(Math.random() * 6) + 4)}</li>`;
      }
      parts.push(`<ul>${listItems}</ul>`);
    }
  }

  if (type === 'words') return parts.join(' ');
  if (type === 'sentences') return parts.join(' ');
  return parts.join('\n\n');
};

export function LoremIpsumForm() {
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'paragraphs',
      count: 3,
      ipsumType: 'standard',
      includeHeadings: false,
      includeLinks: false,
      includeLists: false,
      decorative: false,
    },
  });

  const generateText = (values: FormValues) => {
    const sourceText = ipsumSources[values.ipsumType];
    const result = generateStructure(values, sourceText);
    setGeneratedText(result);
  };
  
  useEffect(() => {
    generateText(form.getValues());
    const subscription = form.watch(() => {
        // We call handleSubmit to ensure validation runs before regenerating
        form.handleSubmit(generateText)();
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const handleCopy = () => {
    if (!generatedText) return;
    const plainText = generatedText.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(plainText);
    toast({
      title: 'Copied to clipboard!',
      description: 'The Lorem Ipsum text has been copied.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(generateText)}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Count</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paragraphs">Paragraphs</SelectItem>
                        <SelectItem value="sentences">Sentences</SelectItem>
                        <SelectItem value="words">Words</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ipsumType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ipsum Style</FormLabel>
                     <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="latin">Classic Latin</SelectItem>
                        <SelectItem value="hipster">Hipster</SelectItem>
                        <SelectItem value="cupcake">Cupcake</SelectItem>
                        <SelectItem value="pirate">Pirate</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </form>
             <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <FormField
                control={form.control}
                name="includeHeadings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Include Headings
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeLinks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Include Links</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeLists"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Include Lists</FormLabel>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="decorative"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Decorative Style</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardContent className="p-2">
          <div
            className="prose prose-sm dark:prose-invert h-80 min-h-[300px] overflow-auto rounded-md bg-muted/20 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            dangerouslySetInnerHTML={{ __html: generatedText }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!generatedText}
            className="absolute right-3 top-3"
            aria-label="Copy text"
          >
            <Copy />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
