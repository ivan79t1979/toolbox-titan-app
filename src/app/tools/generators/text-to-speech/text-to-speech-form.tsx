'use client';

import { useState, useEffect } from 'react';
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
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Play,
  Pause,
  StopCircle,
  Volume2,
  Settings,
  Bot,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text to convert to speech.'),
  voice: z.string().optional(),
  rate: z.number().min(0.1).max(10),
  pitch: z.number().min(0).max(2),
});

type FormValues = z.infer<typeof formSchema>;

export function TextToSpeechForm() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'Hello, this is a test of the text to speech tool.',
      rate: 1,
      pitch: 1,
    },
  });

  useEffect(() => {
    const loadVoices = () => {
      if (synth) {
        const voiceList = synth.getVoices();
        setVoices(voiceList);
        if (voiceList.length > 0 && !form.getValues('voice')) {
          form.setValue('voice', voiceList[0].name);
        }
      }
    };

    // Voices are loaded asynchronously
    if (synth) {
      loadVoices();
      synth.onvoiceschanged = loadVoices;
    }
  }, [synth, form]);

  const speak = (values: FormValues) => {
    if (!synth || !values.text) return;

    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(values.text);
    const selectedVoice = voices.find(v => v.name === values.voice);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = values.rate;
    utterance.pitch = values.pitch;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onpause = () => {
        setIsSpeaking(true);
        setIsPaused(true);
    }
    
    utterance.onresume = () => {
        setIsSpeaking(true);
        setIsPaused(false);
    }

    synth.speak(utterance);
  };

  const handlePlayPause = () => {
      if (!synth) return;
      if (isSpeaking) {
          if (isPaused) {
              synth.resume();
          } else {
              synth.pause();
          }
      } else {
          form.handleSubmit(speak)();
      }
  }

  const handleStop = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const { rate, pitch } = form.watch();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(speak)} className="space-y-6">
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
                <CardTitle className="flex items-center gap-2">
                  <Settings /> Audio Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                            <SelectItem key={v.name} value={v.name}>
                              {v.name} ({v.lang})
                            </SelectItem>
                          ))}
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
                      <FormLabel>Speed: {rate.toFixed(1)}x</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          min={0.5}
                          max={2}
                          step={0.1}
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
                      <FormLabel>Pitch: {pitch.toFixed(1)}</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          min={0}
                          max={2}
                          step={0.1}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button type="button" onClick={handlePlayPause} className="w-full">
                    {isSpeaking && !isPaused ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isSpeaking && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Speak'}
                </Button>
                 <Button type="button" onClick={handleStop} variant="destructive" className="w-full" disabled={!isSpeaking}>
                    <StopCircle className="mr-2 h-4 w-4" /> Stop
                </Button>
            </div>
          </form>
        </Form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browser Speech Synthesis</CardTitle>
          <CardDescription>
            This tool uses your browser's built-in text-to-speech engine. The
            available voices and quality will vary depending on your browser and
            operating system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border bg-muted/30 p-4 text-center">
            <Bot className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Your browser is generating the audio live.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
