'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { extractColorPalette } from '@/ai/flows/color-palette-extractor';
import type { ColorPaletteExtractorOutput } from '@/ai/flows/color-palette-extractor-types';
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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Pipette, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File, 'Please upload an image.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ColorPaletteExtractorForm() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorPaletteExtractorOutput['colors'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setPalette(null);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!sourceImage) return;

    setIsLoading(true);
    setPalette(null);

    try {
      const result = await extractColorPalette({ photoDataUri: sourceImage });
      setPalette(result.colors);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to extract color palette. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: 'Copied to clipboard!',
      description: `${hex} has been copied.`,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="flex-grow">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !sourceImage}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Pipette className="mr-2 h-4 w-4" />
                )}
                Extract Palette
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-4">
              <div className="aspect-video relative">
                {sourceImage ? (
                    <Image
                    src={sourceImage}
                    alt="Source for color extraction"
                    fill
                    className="rounded-md object-contain"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed">
                        <span className="text-muted-foreground">Upload an image to start</span>
                    </div>
                )}
              </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <div className="h-full">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : palette ? (
                    <div className="grid grid-cols-1 gap-2 h-full">
                        {palette.map((color, index) => (
                            <div key={index} className="group relative flex items-center justify-between gap-4 rounded-md p-3" style={{ backgroundColor: color.hex }}>
                                <div className={cn("font-mono text-sm mix-blend-difference")}>
                                    <p className="font-semibold">{color.name}</p>
                                    <p>{color.hex.toUpperCase()}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopy(color.hex)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity mix-blend-difference"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed">
                        <span className="text-muted-foreground text-center">The extracted palette will appear here</span>
                    </div>
                )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
