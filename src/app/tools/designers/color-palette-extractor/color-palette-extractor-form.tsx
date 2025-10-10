'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { extractColorPalette } from '@/ai/flows/color-palette-extractor';
import {
  ColorPaletteExtractorInputSchema,
  type ColorPaletteExtractorInput,
  type ColorPaletteExtractorOutput,
} from '@/ai/flows/color-palette-extractor-types';
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
import { Slider } from '@/components/ui/slider';


function ColorValueRow({ label, value, onCopy }: { label: string, value: string, onCopy: (value: string) => void }) {
    return (
        <div className="flex items-center justify-between">
            <p><span className="font-semibold">{label}:</span> {value.toUpperCase()}</p>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onCopy(value)}
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Copy className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function ColorPaletteExtractorForm() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorPaletteExtractorOutput['colors'] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ColorPaletteExtractorInput>({
    resolver: zodResolver(ColorPaletteExtractorInputSchema),
    defaultValues: {
      photoDataUri: '',
      numberOfColors: 5,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setSourceImage(dataUri);
        form.setValue('photoDataUri', dataUri);
        setPalette(null);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: ColorPaletteExtractorInput) {
    if (!values.photoDataUri) return;

    setIsLoading(true);
    setPalette(null);

    try {
      const result = await extractColorPalette(values);
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${text} has been copied.`,
    });
  };

  const numberOfColors = form.watch('numberOfColors');

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <FormField
                  control={form.control}
                  name="photoDataUri"
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
              </div>
              <FormField
                control={form.control}
                name="numberOfColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Number of Colors: <span className="font-bold">{numberOfColors}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        min={3}
                        max={10}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                    <div className="flex flex-col gap-2 h-full">
                        {palette.map((color, index) => (
                            <div key={index} className="group relative flex-grow flex items-center justify-between gap-4 rounded-md p-3 text-white" style={{ backgroundColor: color.hex }}>
                                <div className={cn("font-mono text-sm mix-blend-difference")}>
                                    <p className="font-bold text-base">{color.name}</p>
                                    <div className="mt-2 space-y-1">
                                      <ColorValueRow label="HEX" value={color.hex} onCopy={handleCopy} />
                                      <ColorValueRow label="RGB" value={color.rgb} onCopy={handleCopy} />
                                      <ColorValueRow label="HSL" value={color.hsl} onCopy={handleCopy} />
                                    </div>
                                </div>
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
