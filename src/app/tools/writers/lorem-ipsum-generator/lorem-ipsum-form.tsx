'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOREM_IPSUM_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const formSchema = z.object({
  type: z.enum(['paragraphs', 'sentences', 'words']),
  count: z.coerce.number().min(1, 'Count must be at least 1.'),
});

type FormValues = z.infer<typeof formSchema>;

export function LoremIpsumForm() {
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'paragraphs',
      count: 5,
    },
  });

  const generateText = (values: FormValues) => {
    const { type, count } = values;
    let result = '';
    const words = LOREM_IPSUM_TEXT.split(' ');
    const sentences = LOREM_IPSUM_TEXT.split('. ');

    switch (type) {
      case 'paragraphs':
        result = Array(count).fill(LOREM_IPSUM_TEXT).join('\n\n');
        break;
      case 'sentences':
        let s = [];
        for(let i = 0; i < count; i++) {
            s.push(sentences[i % sentences.length]);
        }
        result = s.join('. ') + '.';
        break;
      case 'words':
        let w = [];
        for(let i = 0; i < count; i++) {
            w.push(words[i % words.length]);
        }
        result = w.join(' ');
        break;
    }
    setGeneratedText(result);
  };

  function onSubmit(values: FormValues) {
    generateText(values);
  }

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast({
      title: 'Copied to clipboard!',
      description: 'The Lorem Ipsum text has been copied.',
    });
  };
  
  useState(() => {
    generateText(form.getValues());
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap items-end gap-4"
            >
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                  <FormItem className="flex-1">
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
              <Button type="submit">
                <RefreshCw className="mr-2" />
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardContent className="p-2">
          <Textarea
            readOnly
            value={generatedText}
            className="h-80 min-h-[300px] border-0 text-base shadow-none focus-visible:ring-0"
            placeholder="Generated text will appear here..."
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
