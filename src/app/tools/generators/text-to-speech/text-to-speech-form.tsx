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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  Wand2,
  Download,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text to convert to speech.'),
  voice: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Correct list of voices supported by the model
const voices = [
    'achernar', 'achird', 'algenib', 'algieba', 'alnilam', 'aoede', 'autonoe', 'callirrhoe', 
    'charon', 'despina', 'enceladus', 'erinome', 'fenrir', 'gacrux', 'iapetus', 'kore', 
    'laomedeia', 'leda', 'orus', 'puck', 'pulcherrima', 'rasalgethi', 'sadachbia', 
    'sadaltager', 'schedar', 'sulafat', 'umbriel', 'vindemiatrix', 'zephyr', 'zubenelgenubi'
];

export function TextToSpeechForm() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'Hello, this is a test of the AI-powered text to speech tool.',
      voice: 'algenib',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAudioSrc(null);

    try {
      const result = await textToSpeech(values);
      setAudioSrc(result.audioDataUri);
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
  
  const handleDownload = () => {
    if (!audioSrc) return;
    const link = document.createElement('a');
    link.href = audioSrc;
    link.download = 'speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {voices.map((v) => (
                        <SelectItem key={v} value={v} className="capitalize">
                          {v}
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
                <Wand2 className="mr-2 h-4 w-4" />
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
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border bg-muted/30 p-4 text-center">
            {isLoading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : audioSrc ? (
              <div className="w-full space-y-4">
                <audio controls src={audioSrc} className="w-full">
                  Your browser does not support the audio element.
                </audio>
                 <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download WAV
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Your generated audio will appear here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
