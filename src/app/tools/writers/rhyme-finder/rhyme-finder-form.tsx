'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { findRhymes } from '@/ai/flows/rhyme-finder';
import { RhymeFinderInputSchema, type RhymeFinderInput } from '@/ai/flows/rhyme-finder-types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RhymeFinderForm() {
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RhymeFinderInput>({
    resolver: zodResolver(RhymeFinderInputSchema),
    defaultValues: {
      word: '',
    },
  });

  async function onSubmit(values: RhymeFinderInput) {
    setIsLoading(true);
    setRhymes([]);
    try {
      const result = await findRhymes(values);
      setRhymes(result.rhymes);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to find rhymes. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (rhyme: string) => {
    navigator.clipboard.writeText(rhyme);
    toast({
      title: 'Copied to clipboard!',
      description: `"${rhyme}" has been copied.`,
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Word</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., creative" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Find Rhymes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Rhyming Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[200px] rounded-md border bg-muted/30 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : rhymes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {rhymes.map((rhyme, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer text-base hover:bg-primary/10"
                    onClick={() => handleCopy(rhyme)}
                  >
                    {rhyme}
                    <Copy className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Rhymes will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
