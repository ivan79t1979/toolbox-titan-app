'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateDataset } from '@/ai/flows/dataset-generator';
import type { DatasetGeneratorInput } from '@/ai/flows/dataset-generator-types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  description: z
    .string()
    .min(10, 'Please provide a more detailed description.'),
  format: z.enum(['json', 'csv']),
  count: z.coerce.number().min(1, 'Count must be at least 1.').max(100, 'Count cannot exceed 100.'),
});

export function DatasetGeneratorForm() {
  const [generatedData, setGeneratedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: 'A list of 10 users with a first name, last name, and a unique email address.',
      format: 'json',
      count: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedData('');
    try {
      const result = await generateDataset(values);
      setGeneratedData(result.data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate dataset. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    if (!generatedData) return;
    navigator.clipboard.writeText(generatedData);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Data Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A list of products with a name, price, and category."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of items</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Dataset
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Data</CardTitle>
           <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!generatedData || isLoading}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative h-full min-h-[300px] rounded-md border bg-muted/30">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Textarea
                readOnly
                value={generatedData}
                placeholder="Your generated data will appear here."
                className="h-full min-h-[300px] resize-none border-none bg-transparent font-mono text-xs focus-visible:ring-0"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
