'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
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
import { Loader2, Download, Scaling, Ratio } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File, 'Please upload an image.'),
  width: z.coerce.number().min(1, 'Width must be at least 1.'),
  height: z.coerce.number().min(1, 'Height must be at least 1.'),
  maintainAspectRatio: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const sizePresets = [
  { label: 'Custom', width: 0, height: 0 },
  { label: 'Instagram Post (1:1)', width: 1080, height: 1080 },
  { label: 'Instagram Story (9:16)', width: 1080, height: 1920 },
  { label: 'Instagram Portrait (4:5)', width: 1080, height: 1350 },
  { label: 'Facebook Post (1.91:1)', width: 1200, height: 630 },
  { label: 'Facebook Cover (Desktop)', width: 820, height: 312 },
  { label: 'Twitter Post (16:9)', width: 1600, height: 900 },
  { label: 'Twitter Header', width: 1500, height: 500 },
  { label: 'Pinterest Pin (2:3)', width: 1000, height: 1500 },
  { label: 'LinkedIn Post', width: 1200, height: 627 },
  { label: 'Standard 4:3', width: 1024, height: 768 },
  { label: 'Standard 16:9', width: 1920, height: 1080 },
];

export function ImageResizerForm() {
  const [originalImage, setOriginalImage] = useState<{ src: string; width: number; height: number } | null>(null);
  const [resizedImageSrc, setResizedImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maintainAspectRatio: true,
    },
  });
  
  const watchedWidth = useWatch({ control: form.control, name: 'width' });
  const watchedHeight = useWatch({ control: form.control, name: 'height' });
  const watchedAspectRatio = useWatch({ control: form.control, name: 'maintainAspectRatio' });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.onload = () => {
          setOriginalImage({ src: img.src, width: img.width, height: img.height });
          form.setValue('width', img.width);
          form.setValue('height', img.height);
          setResizedImageSrc(null);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!originalImage || !watchedAspectRatio) return;
    
    const aspectRatio = originalImage.width / originalImage.height;
    
    // This logic prevents infinite loops by only acting on the field that was most recently changed.
    const lastChanged = form.formState.dirtyFields.width ? 'width' : form.formState.dirtyFields.height ? 'height' : null;

    if (lastChanged === 'width') {
        const newHeight = Math.round(watchedWidth / aspectRatio);
        if (newHeight !== watchedHeight) {
            form.setValue('height', newHeight, { shouldValidate: true });
        }
    } else if (lastChanged === 'height') {
        const newWidth = Math.round(watchedHeight * aspectRatio);
        if (newWidth !== watchedWidth) {
            form.setValue('width', newWidth, { shouldValidate: true });
        }
    }
  }, [watchedWidth, watchedHeight, watchedAspectRatio, originalImage, form]);


  const resizeImage = useCallback(async (values: FormValues) => {
    if (!originalImage) return;

    setIsLoading(true);

    return new Promise<void>((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = values.width;
        canvas.height = values.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, values.width, values.height);
          setResizedImageSrc(canvas.toDataURL('image/png'));
        }
        setIsLoading(false);
        resolve();
      };
      img.src = originalImage.src;
    });
  }, [originalImage]);


  const handleDownload = () => {
    if (!resizedImageSrc) return;
    const link = document.createElement('a');
    link.href = resizedImageSrc;
    link.download = 'resized-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Download started!',
      description: 'Your resized image is being downloaded.',
    });
  };
  
  const handlePresetChange = (value: string) => {
    const preset = sizePresets.find(p => p.label === value);
    if (preset && preset.width > 0) {
        form.setValue('width', preset.width, { shouldValidate: true, shouldDirty: true });
        form.setValue('height', preset.height, { shouldValidate: true, shouldDirty: true });
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(resizeImage)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {originalImage && (
                <>
                 <div className="space-y-2">
                    <Label>Common Sizes</Label>
                    <Select onValueChange={handlePresetChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a preset size..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sizePresets.map(preset => (
                                <SelectItem key={preset.label} value={preset.label}>
                                    {preset.label} {preset.width > 0 && `(${preset.width} x ${preset.height})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width (px)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (px)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                 </div>
                 <FormField
                    control={form.control}
                    name="maintainAspectRatio"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                             <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <Label className="font-normal flex items-center gap-2">
                                <Ratio className="h-4 w-4" /> Maintain Aspect Ratio
                            </Label>
                        </FormItem>
                    )}
                 />

                  <Button type="submit" disabled={isLoading || !originalImage}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Scaling className="mr-2 h-4 w-4" />
                    )}
                    Resize Image
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium text-center">Original Image</h3>
          <Card className="min-h-64">
            <CardContent className="flex h-full items-center justify-center p-2">
              {originalImage ? (
                <Image
                  src={originalImage.src}
                  alt="Original"
                  width={600}
                  height={400}
                  className="max-h-full w-auto rounded-md object-contain"
                />
              ) : (
                <span className="text-muted-foreground">Upload an image to start</span>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-center">Resized Result</h3>
          <Card className="min-h-64">
            <CardContent className="flex h-full items-center justify-center p-2">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : resizedImageSrc ? (
                <Image
                  src={resizedImageSrc}
                  alt="Resized image"
                  width={form.getValues('width')}
                  height={form.getValues('height')}
                  className="max-h-full w-auto rounded-md object-contain"
                />
              ) : (
                <span className="text-muted-foreground">The result will appear here</span>
              )}
            </CardContent>
          </Card>
          {resizedImageSrc && !isLoading && (
            <Button onClick={handleDownload} className="mt-4 w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Resized Image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
