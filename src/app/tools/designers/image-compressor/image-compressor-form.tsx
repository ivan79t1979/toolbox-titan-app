'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Upload, Percent, FileSymlink } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File, 'Please upload an image.'),
  quality: z.number().min(0).max(1),
});

type FormValues = z.infer<typeof formSchema>;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function ImageCompressorForm() {
  const [original, setOriginal] = useState<{ src: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ src: string; size: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { quality: 0.8 },
  });

  const quality = useWatch({ control: form.control, name: 'quality' });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload an image file.' });
        return;
      }
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginal({ src: reader.result as string, size: file.size, name: file.name });
        setCompressed(null);
        // Trigger initial compression
        compressImage(file, form.getValues('quality'));
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = useCallback(async (file: File, quality: number) => {
    if (!file.type.startsWith('image/')) return;

    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // For PNG, quality is not directly supported, so we just redraw.
          // For JPEG, we can specify quality.
          const isJpeg = file.type === 'image/jpeg';
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedSrc = URL.createObjectURL(blob);
              setCompressed({ src: compressedSrc, size: blob.size });
            }
            setIsLoading(false);
            resolve();
          }, isJpeg ? 'image/jpeg' : 'image/png', isJpeg ? quality : undefined);
        } else {
            setIsLoading(false);
            resolve();
        }
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  useEffect(() => {
    const imageFile = form.getValues('image');
    if (imageFile instanceof File) {
      compressImage(imageFile, quality);
    }
  }, [quality, form, compressImage]);

  const handleDownload = () => {
    if (!compressed || !original) return;
    const link = document.createElement('a');
    link.href = compressed.src;
    const nameParts = original.name.split('.');
    const extension = nameParts.pop();
    link.download = `${nameParts.join('.')}-compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const sizeReduction = original && compressed ? ((original.size - compressed.size) / original.size) * 100 : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                     <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, etc.</p>
                                </div>
                                <Input id="dropzone-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {original && (
                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Percent className="h-4 w-4" /> Quality: <span className="font-bold">{Math.round(field.value * 100)}%</span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          min={0}
                          max={1}
                          step={0.01}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {original && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImagePreview title="Original" src={original.src} size={original.size} />
            <ImagePreview title="Compressed" src={compressed?.src} size={compressed?.size} isLoading={isLoading} reduction={sizeReduction} onDownload={handleDownload}/>
        </div>
      )}

    </div>
  );
}

function ImagePreview({ title, src, size, isLoading, reduction, onDownload }: { title: string, src?: string, size?: number, isLoading?: boolean, reduction?: number, onDownload?: () => void }) {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{title}</CardTitle>
                {size !== undefined && (
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatBytes(size)}</p>
                    {reduction !== undefined && reduction > 0 && (
                      <p className={cn("text-sm font-medium", reduction > 0 ? "text-green-600" : "text-red-600")}>
                        - {reduction.toFixed(1)}%
                      </p>
                    )}
                  </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="aspect-video relative bg-muted/30 rounded-md flex items-center justify-center">
                {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : src ? (
                    <Image src={src} alt={`${title} preview`} fill className="object-contain rounded-md" />
                ) : (
                    <FileSymlink className="w-12 h-12 text-muted-foreground"/>
                )}
                </div>
                {onDownload && (
                    <Button onClick={onDownload} disabled={!src || isLoading} className="mt-4 w-full">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
