
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Wand2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToSpeechInputSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  voice: z.string().optional(),
});

type FormValues = z.infer<typeof TextToSpeechInputSchema>;

const voices = [
    { name: 'Algenib', id: 'Algenib' },
    { name: 'Achernar', id: 'Achernar' },
    { name: 'Enif', id: 'Enif' },
    { name: 'Hadar', id: 'Hadar' },
    { name: 'Spica', id: 'Spica' },
    { name: 'Regor', id: 'Regor' },
];

export function TextToSpeechForm() {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(TextToSpeechInputSchema),
    defaultValues: {
      text: 'Hello, world! This is a test of the text-to-speech system.',
      voice: 'Algenib',
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
        description: 'Failed to generate audio. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Convert</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text to convert to speech..."
                        className="h-32"
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
                        {voices.map(voice => (
                            <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
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
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Audio
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center h-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {audioDataUri && (
        <Card>
          <CardContent className="p-4 flex flex-col items-center gap-4">
            <Volume2 className="w-8 h-8 text-primary" />
            <audio controls src={audioDataUri} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

