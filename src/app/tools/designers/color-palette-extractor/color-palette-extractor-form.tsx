'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Pipette, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

// --- Client-Side Color Extraction Logic ---

type ColorPalette = {
  hex: string;
  rgb: string;
  hsl: string;
}[];

function rgbToHsl(r: number, g: number, b: number): string {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


async function extractPaletteFromImage(
  imageSrc: string,
  colorCount: number
): Promise<ColorPalette> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        return reject(new Error('Canvas context not available'));
      }

      // Scale image for performance
      const scale = Math.min(1, 200 / img.width, 200 / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      
      const pixels: [number, number, number][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
      }

      // k-means clustering algorithm
      let centroids: [number, number, number][] = [];
      for (let i = 0; i < colorCount; i++) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
      }

      for (let iter = 0; iter < 10; iter++) {
        const clusters: [number, number, number][][] = Array.from({ length: colorCount }, () => []);
        pixels.forEach(pixel => {
          let minDistance = Infinity;
          let clusterIndex = 0;
          centroids.forEach((centroid, index) => {
            const distance = Math.sqrt(
              Math.pow(pixel[0] - centroid[0], 2) +
              Math.pow(pixel[1] - centroid[1], 2) +
              Math.pow(pixel[2] - centroid[2], 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              clusterIndex = index;
            }
          });
          clusters[clusterIndex].push(pixel);
        });

        centroids = clusters.map(cluster => {
          if (cluster.length === 0) {
            return pixels[Math.floor(Math.random() * pixels.length)];
          }
          const totals = cluster.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
          return [
            Math.round(totals[0] / cluster.length),
            Math.round(totals[1] / cluster.length),
            Math.round(totals[2] / cluster.length)
          ];
        });
      }

      const palette = centroids.map(([r, g, b]) => {
        const hex = rgbToHex(r, g, b);
        return {
          hex,
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: rgbToHsl(r,g,b),
        };
      });

      resolve(palette);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image.'));
    };
  });
}


// --- React Component ---

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File, 'Please upload an image.'),
  numberOfColors: z.number().min(3).max(10),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfColors: 5,
    },
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
      const result = await extractPaletteFromImage(
        sourceImage,
        values.numberOfColors,
      );
      setPalette(result);
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
