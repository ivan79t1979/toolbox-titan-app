'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { textSummarizer } from '@/ai/flows/text-summarizer';
import type { TextSummarizerOutput } from '@/ai/flows/text-summarizer-types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wand2, Loader2, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  text: z.string().min(50, 'Please enter at least 50 characters to summarize.'),
  length: z.enum(['short', 'medium', 'long']),
});

type FormValues = z.infer<typeof formSchema>;

export function TextSummarizerForm() {
  const [summary, setSummary] = useState<TextSummarizerOutput['summary'] | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      length: 'medium',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSummary('');

    try {
      const result = await textSummarizer(values);
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const handleClear = () => {
    form.reset();
    setSummary('');
  };

  const originalText = form.watch('text');

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-2">
              <FormLabel htmlFor="original-text">Original Text</FormLabel>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        id="original-text"
                        placeholder="Paste the text you want to summarize here..."
                        className="h-96 min-h-[400px] text-base"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Summary</FormLabel>
              <Card className="h-96 min-h-[400px]">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    <Textarea
                      readOnly
                      value={summary}
                      placeholder="Your summary will appear here."
                      className="h-full resize-none border-none focus-visible:ring-0 text-base"
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {summary && !isLoading && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(summary)}
                        className="absolute right-2 top-2 h-7 w-7"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel>Length:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select summary length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || !originalText}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Summarize
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleClear}
              disabled={isLoading || (!originalText && !summary)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
