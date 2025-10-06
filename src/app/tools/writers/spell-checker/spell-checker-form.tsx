'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  spellCheck,
  SpellCheckInputSchema,
  type SpellCheckInput,
  type SpellCheckOutput,
} from '@/ai/flows/spell-checker';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, SpellCheck as SpellCheckIcon, Check, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export function SpellCheckerForm() {
  const [result, setResult] = useState<SpellCheckOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SpellCheckInput>({
    resolver: zodResolver(SpellCheckInputSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: SpellCheckInput) {
    if (!values.text.trim()) {
      setResult(null);
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const response = await spellCheck(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to check the text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const applySuggestion = (suggestion: string) => {
    form.setValue('text', suggestion, { shouldValidate: true });
    setResult(null);
  };
  
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type or paste your text here to check it..."
                      className="min-h-[300px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || !form.watch('text')} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SpellCheckIcon className="mr-2 h-4 w-4" />
              )}
              Check Text
            </Button>
          </form>
        </Form>

        {result && result.correctedText && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="text-primary" />
                Corrected Text
              </CardTitle>
              <CardDescription>
                Here is the corrected version of your text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-md border bg-muted/30 p-4">
                <p className="text-base">{result.correctedText}</p>
                 <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => handleCopy(result.correctedText)}
                >
                  Copy
                </Button>
              </div>
               <Button onClick={() => applySuggestion(result.correctedText)} className="mt-4">
                <Check className="mr-2 h-4 w-4" />
                Accept All Corrections
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="h-full">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
            <CardDescription>
              {isLoading ? 'Checking your text...' : result ? `${result.suggestions.length} suggestions found.` : 'Suggestions will appear here after checking your text.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : result && result.suggestions.length > 0 ? (
              <div className="space-y-4">
                {result.suggestions.map((item, index) => (
                  <div key={index}>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="line-through">{item.original}</Badge>
                            <span>→</span>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">{item.suggestion}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    </div>
                    {index < result.suggestions.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-md">
                 <p className="text-muted-foreground text-center">
                    {result ? 'No suggestions found. Looks good!' : 'Run a check to see suggestions.'}
                </p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
