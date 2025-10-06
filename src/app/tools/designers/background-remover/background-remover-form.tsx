'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { removeBackground } from '@/ai/flows/background-remover';
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
import { Loader2, Scan, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File, 'Please upload an image.'),
});

type FormValues = z.infer<typeof formSchema>;

export function BackgroundRemoverForm() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
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
        setOriginalImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!originalImage) return;

    setIsLoading(true);
    setProcessedImage(null);

    try {
      const result = await removeBackground({ photoDataUri: originalImage });
      setProcessedImage(result.imageWithRemovedBackground);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to remove background. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Download started!',
      description: 'Your image is being downloaded.',
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" disabled={isLoading || !originalImage}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Scan className="mr-2 h-4 w-4" />
                )}
                Remove Background
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium text-center">Original Image</h3>
          <Card className="aspect-video">
            <CardContent className="flex h-full items-center justify-center p-2">
              {originalImage ? (
                <Image
                  src={originalImage}
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
          <h3 className="mb-4 text-lg font-medium text-center">Result</h3>
          <Card className="aspect-video">
            <CardContent className="flex h-full items-center justify-center p-2">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : processedImage ? (
                <Image
                  src={processedImage}
                  alt="Background removed"
                  width={600}
                  height={400}
                  className="max-h-full w-auto rounded-md object-contain"
                />
              ) : (
                <span className="text-muted-foreground">The result will appear here</span>
              )}
            </CardContent>
          </Card>
           {processedImage && (
            <Button onClick={handleDownload} className="mt-4 w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
