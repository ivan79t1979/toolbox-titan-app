'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { textToSpeech, type TextToSpeechInput } from '@/ai/flows/text-to-speech';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const voices = [
    { value: 'algenib', label: 'Algenib (Female, English)' },
    { value: 'achernar', label: 'Achernar (Female, English)' },
    { value: 'hadar', label: 'Hadar (Male, English)' },
    { value: 'canopus', label: 'Canopus (Male, English)' },
    { value: 'sirius', label: 'Sirius (Male, English)' },
    // Add more voices as needed from Google's Text-to-Speech documentation
];

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function TextToSpeechForm() {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'Hello, this is a test of the text-to-speech functionality.',
      voice: 'algenib',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAudioDataUri(null);

    try {
      const result = await textToSpeech(values);
      setAudioDataUri(result.audioDataUri);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to convert text to speech. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Convert Text to Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Convert</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the text you want to convert..."
                        className="h-48"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voices.map((voice) => (
                            <SelectItem key={voice.value} value={voice.value}>
                                {voice.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                Generate Audio
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            {isLoading ? (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : audioDataUri ? (
                <audio controls src={audioDataUri} className="w-full">
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p className="text-muted-foreground">Your generated audio will appear here.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
