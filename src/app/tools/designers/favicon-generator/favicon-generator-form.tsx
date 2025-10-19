
'use client';

import { useState, useCallback, ChangeEvent, useRef } from 'react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2, Download, Upload, Image as ImageIcon, Code, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File, 'Please upload an image.'),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratedIcon = {
  size: number;
  dataUrl: string;
  filename: string;
};

const faviconSizes = [16, 32, 48, 64];
const appleTouchIconSize = 180;

export function FaviconGeneratorForm() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const generateFavicons = useCallback(async (file: File) => {
    setIsLoading(true);
    setGeneratedIcons([]);

    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);
    
    image.onload = async () => {
        const icons: GeneratedIcon[] = [];
        const allSizes = [...faviconSizes, appleTouchIconSize];

        for (const size of allSizes) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(image, 0, 0, size, size);
                const dataUrl = canvas.toDataURL('image/png');
                const filename = size === appleTouchIconSize ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
                icons.push({ size, dataUrl, filename });
            }
        }
        setGeneratedIcons(icons);
        setIsLoading(false);
    };

    image.onerror = () => {
        toast({ variant: 'destructive', title: 'Image load error' });
        setIsLoading(false);
    }
  }, [toast]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload a PNG, JPG, or GIF.' });
            return;
        }
        form.setValue('image', file);
        setSourceImage(URL.createObjectURL(file));
        generateFavicons(file);
    }
  };

  const handleDownloadZip = async () => {
    if (generatedIcons.length === 0) return;

    const zip = new JSZip();
    for (const icon of generatedIcons) {
      const base64Data = icon.dataUrl.split(',')[1];
      zip.file(icon.filename, base64Data, { base64: true });
    }

    try {
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'favicons.zip');
        toast({ title: 'Download Started', description: 'Your favicon zip file is downloading.' });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Failed to create zip file.' });
    }
  };
  
  const htmlCode = `<!-- Standard Favicons -->
<link rel="icon" href="/favicon-32x32.png" sizes="32x32">
<link rel="icon" href="/favicon-16x16.png" sizes="16x16">
<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;

  const handleCopyCode = () => {
      navigator.clipboard.writeText(htmlCode);
      toast({ title: 'Copied HTML code!' });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Source Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                        >
                          {sourceImage ? (
                            <div className="relative w-32 h-32">
                                <Image src={sourceImage} alt="Source" layout="fill" objectFit="contain" />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">Recommended: a square image of 512x512px</p>
                            </div>
                          )}
                          <Input id="dropzone-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}

      {generatedIcons.length > 0 && !isLoading && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Generated Favicons</CardTitle>
                        <Button onClick={handleDownloadZip}>
                            <Download className="mr-2 h-4 w-4" /> Download All (.zip)
                        </Button>
                    </div>
                    <CardDescription>Previews of your generated icons. Click an icon to download it individually.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {generatedIcons.map(icon => (
                            <a 
                                key={icon.size}
                                href={icon.dataUrl}
                                download={icon.filename}
                                className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="bg-muted/30 p-2 rounded-lg border relative">
                                    <Image src={icon.dataUrl} alt={`Favicon ${icon.size}x${icon.size}`} width={icon.size} height={icon.size} style={{ imageRendering: 'pixelated' }} />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground">{icon.size}x{icon.size}</span>
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><Code /> HTML Code</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleCopyCode}><Copy className="w-4 h-4"/></Button>
                    </div>
                    <CardDescription>Copy and paste this into the &lt;head&gt; of your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea readOnly value={htmlCode} className="h-32 font-mono text-xs"/>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
