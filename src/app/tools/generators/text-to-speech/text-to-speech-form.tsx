'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { textToSpeech } from '@/ai/flows/text-to-speech';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioLines, Loader2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text to convert to speech.'),
  voice: z.string(),
  rate: z.number(),
  pitch: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

const voices = ['Algenib', 'Achernar', 'Enif', 'Hadar', 'Izar', 'Mirfak', 'Regulus'];

export function TextToSpeechForm() {
  const [audioDataUri, setAudioDataUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: 'Algenib',
      rate: 1.0,
      pitch: 0.0,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAudioDataUri('');
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

  const rate = form.watch('rate');
  const pitch = form.watch('pitch');

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the text you want to convert to speech..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings/> Audio Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a voice" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {voices.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between">
                                    <FormLabel>Speed</FormLabel>
                                    <span className="text-sm font-mono">{rate.toFixed(2)}x</span>
                                </div>
                                <FormControl>
                                    <Slider
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        min={0.25}
                                        max={4.0}
                                        step={0.05}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pitch"
                        render={({ field }) => (
                            <FormItem>
                               <div className="flex justify-between">
                                    <FormLabel>Pitch</FormLabel>
                                    <span className="text-sm font-mono">{pitch.toFixed(1)}</span>
                                </div>
                                <FormControl>
                                    <Slider
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        min={-20.0}
                                        max={20.0}
                                        step={0.5}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AudioLines className="mr-2 h-4 w-4" />
              )}
              Generate Audio
            </Button>
          </form>
        </Form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Audio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-md border bg-muted/30 p-4">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : audioDataUri ? (
              <audio controls src={audioDataUri} className="w-full">
                Your browser does not support the audio element.
              </audio>
            ) : (
              <span className="text-center text-muted-foreground">
                Your generated audio will appear here.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
