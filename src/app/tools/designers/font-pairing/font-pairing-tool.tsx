'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fontPairing, FontPairingInputSchema, type FontPairingOutput } from '@/ai/flows/font-pairing';
import type { FontPairingInput } from '@/ai/flows/font-pairing';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Download, Printer, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

export function FontPairingTool() {
  const [fontPairings, setFontPairings] = useState<FontPairingOutput['pairings']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const printableRefs = useRef<Array<HTMLDivElement | null>>([]);

  const form = useForm<FontPairingInput>({
    resolver: zodResolver(FontPairingInputSchema),
    defaultValues: {
      style: 'modern and clean',
    },
  });

  const onSubmit = async (values: FontPairingInput) => {
    setIsLoading(true);
    setFontPairings([]);
    try {
      const result = await fontPairing(values);
      setFontPairings(result.pairings);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate font pairings. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadedFonts = fontPairings.flatMap(p => [p.headlineFont, p.bodyFont]).join('|').replace(/ /g, '+');

  const exportPNG = async (index: number) => {
    const element = printableRefs.current[index];
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const link = document.createElement('a');
      link.download = `font-pairing-${fontPairings[index].headlineFont.replace(' ', '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
    }
  };

  const exportPDF = (index: number) => {
     const element = printableRefs.current[index];
    if (!element) return;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Font Pairing</title>');
      // Include current stylesheets
      Array.from(document.styleSheets).forEach(sheet => {
          try {
            if (sheet.href) {
                printWindow.document.write(`<link rel="stylesheet" href="${sheet.href}">`);
            } else if (sheet.cssRules) {
                const style = printWindow.document.createElement('style');
                style.textContent = Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
                printWindow.document.head.appendChild(style);
            }
          } catch (e) {
              console.warn("Can't read stylesheet", e);
          }
      });
      printWindow.document.write('</head><body>');
      printWindow.document.write(element.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="space-y-8">
      {loadedFonts && (
          <Head>
            <link
                rel="stylesheet"
                href={`https://fonts.googleapis.com/css?family=${loadedFonts}&display=swap`}
            />
          </Head>
      )}
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4">
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Describe a style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., elegant and classic, futuristic and minimal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Pairings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-8">
        {fontPairings.map((pairing, index) => (
          <Card key={index}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{pairing.headlineFont} & {pairing.bodyFont}</CardTitle>
                        <CardDescription>{pairing.reason}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportPNG(index)}>
                            <ImageIcon className="mr-2 h-4 w-4" /> PNG
                        </Button>
                         <Button variant="outline" size="sm" onClick={() => exportPDF(index)}>
                            <Printer className="mr-2 h-4 w-4" /> PDF
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent ref={el => printableRefs.current[index] = el} className="bg-background p-8 rounded-b-lg">
                <div 
                    style={{ fontFamily: `'${pairing.headlineFont}', sans-serif`}} 
                    className="text-5xl font-bold"
                >
                    The quick brown fox jumps over the lazy dog.
                </div>
                <div 
                    style={{ fontFamily: `'${pairing.bodyFont}', sans-serif`}}
                    className="mt-6 text-lg"
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && fontPairings.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Your font pairings will appear here.</p>
                <p className="text-sm text-muted-foreground">Describe a style and click "Generate".</p>
            </div>
        )}
      </div>
    </div>
  );
}
