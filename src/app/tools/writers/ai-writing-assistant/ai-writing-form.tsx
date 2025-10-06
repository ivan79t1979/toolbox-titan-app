'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { aiWritingAssistant } from '@/ai/flows/ai-writing-assistant';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
  style: z.string(),
  length: z.string(),
  keywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AiWritingAssistantForm() {
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      style: 'Informal',
      length: 'Medium',
      keywords: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedText('');
    try {
      const result = await aiWritingAssistant(values);
      setGeneratedText(result.generatedText);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast({
      title: 'Copied to clipboard!',
      description: 'The generated text has been copied.',
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., The future of renewable energy"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Writing Style</FormLabel>
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
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Informal">Informal</SelectItem>
                      <SelectItem value="Persuasive">Persuasive</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Short">Short (1-2 paragraphs)</SelectItem>
                      <SelectItem value="Medium">
                        Medium (3-4 paragraphs)
                      </SelectItem>
                      <SelectItem value="Long">Long (5+ paragraphs)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., solar, wind, innovation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Text
          </Button>
        </form>
      </Form>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Text</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!generatedText || isLoading}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy text</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative h-full min-h-[300px] rounded-md border bg-muted/30 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm">
                {generatedText || (
                  <span className="text-muted-foreground">
                    Your generated text will appear here.
                  </span>
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
