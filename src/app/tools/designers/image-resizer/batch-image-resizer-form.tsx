'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
import { Loader2, Download, Scaling, Ratio, Upload, X, Archive } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, 'Please upload at least one image.'),
  width: z.coerce.number().min(1, 'Width must be at least 1.'),
  height: z.coerce.number().min(1, 'Height must be at least 1.'),
  maintainAspectRatio: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type ImageFile = {
  file: File;
  originalSrc: string;
  resizedSrc: string | null;
  originalWidth: number;
  originalHeight: number;
};

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

export function BatchImageResizerForm() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      width: 800,
      height: 600,
      maintainAspectRatio: true,
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImageFiles: Promise<ImageFile>[] = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = document.createElement('img');
          img.onload = () => {
            resolve({
              file,
              originalSrc: img.src,
              resizedSrc: null,
              originalWidth: img.width,
              originalHeight: img.height,
            });
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImageFiles).then(resolvedFiles => {
      setImageFiles(prev => [...prev, ...resolvedFiles]);
      form.setValue('images', [...(form.getValues('images') || []), ...resolvedFiles.map(f => f.file)]);
    });
  };

  const removeImage = (index: number) => {
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles.splice(index, 1);
    setImageFiles(updatedImageFiles);

    const updatedFiles = [...form.getValues('images')];
    updatedFiles.splice(index, 1);
    form.setValue('images', updatedFiles);
  };
  
  const resizeAllImages = useCallback(async (values: FormValues) => {
    if (imageFiles.length === 0) return;

    setIsLoading(true);
    toast({ title: 'Batch resizing started...', description: `Processing ${imageFiles.length} images.` });

    const resizePromises = imageFiles.map(imageFile => {
      return new Promise<ImageFile>((resolve) => {
        const img = document.createElement('img');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const aspectRatio = img.width / img.height;
            let targetWidth = values.width;
            let targetHeight = values.height;

            if (values.maintainAspectRatio) {
                targetHeight = Math.round(targetWidth / aspectRatio);
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                resolve({ ...imageFile, resizedSrc: canvas.toDataURL(imageFile.file.type) });
            } else {
                resolve({ ...imageFile, resizedSrc: null }); // Failed
            }
        };
        img.src = imageFile.originalSrc;
      });
    });

    const resizedResults = await Promise.all(resizePromises);
    setImageFiles(resizedResults);
    setIsLoading(false);
    toast({ title: 'Batch resizing complete!', description: 'All images have been processed.' });
  }, [imageFiles, toast]);


  const handleDownloadAll = async () => {
    if (imageFiles.every(f => f.resizedSrc === null)) {
      toast({ variant: 'destructive', title: 'No resized images', description: 'Please resize the images first.' });
      return;
    }

    const zip = new JSZip();
    imageFiles.forEach((imageFile, index) => {
      if (imageFile.resizedSrc) {
        const base64Data = imageFile.resizedSrc.split(',')[1];
        zip.file(`resized_${index + 1}_${imageFile.file.name}`, base64Data, { base64: true });
      }
    });

    toast({ title: 'Creating ZIP file...', description: 'This may take a moment for many images.' });
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'resized-images.zip');
    });
  };

  const handlePresetChange = (value: string) => {
    const preset = sizePresets.find(p => p.label === value);
    if (preset && preset.width > 0) {
        form.setValue('width', preset.width, { shouldValidate: true, shouldDirty: true });
        form.setValue('height', preset.height, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(resizeAllImages)} className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF, etc.</p>
                                </div>
                                <Input id="dropzone-file" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imageFiles.length > 0 && (
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
                                <Ratio className="h-4 w-4" /> Maintain Aspect Ratio (based on width)
                            </Label>
                        </FormItem>
                    )}
                 />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={isLoading || imageFiles.length === 0}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scaling className="mr-2 h-4 w-4" />}
                        Resize All
                    </Button>
                    <Button type="button" onClick={handleDownloadAll} disabled={isLoading || imageFiles.every(f => !f.resizedSrc)}>
                        <Archive className="mr-2 h-4 w-4" /> Download All (.zip)
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {imageFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Image Queue ({imageFiles.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map((img, index) => (
                    <Card key={index} className="relative group">
                        <CardContent className="p-2">
                             <div className="aspect-video relative">
                                <Image src={img.resizedSrc || img.originalSrc} alt={`Preview ${index}`} fill className="rounded-md object-contain" />
                            </div>
                            <div className="text-xs mt-2 truncate">
                                <p className="font-semibold">{img.file.name}</p>
                                <p className="text-muted-foreground">{img.originalWidth}x{img.originalHeight}
                                {img.resizedSrc && ` → ${form.getValues('width')}x${Math.round(form.getValues('width') / (img.originalWidth/img.originalHeight))}`}
                                </p>
                            </div>
                            {img.resizedSrc && (
                                <a href={img.resizedSrc} download={`resized_${img.file.name}`} className="absolute top-3 right-10 p-1 bg-background/70 rounded-full hover:bg-muted transition-colors">
                                    <Download className="w-4 h-4"/>
                                </a>
                            )}
                            <button onClick={() => removeImage(index)} className="absolute top-3 right-3 p-1 bg-background/70 rounded-full hover:bg-muted transition-colors">
                                <X className="w-4 h-4"/>
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
      )}
    </div>
  );
}
