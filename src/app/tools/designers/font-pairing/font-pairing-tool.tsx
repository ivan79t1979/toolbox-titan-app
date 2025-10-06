'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fontPairing } from '@/ai/flows/font-pairing';
import {
  FontPairingInputSchema,
  type FontPairingInput,
  type FontPairingOutput,
} from '@/ai/flows/font-pairing-types';
import { googleFonts } from '@/lib/google-fonts';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Wand2, Printer, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

function FontPreview({
  headlineFont,
  bodyFont,
  printableRef,
}: {
  headlineFont: string;
  bodyFont: string;
  printableRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={printableRef} className="bg-background p-8 rounded-b-lg">
      <div
        style={{ fontFamily: `'${headlineFont}', sans-serif` }}
        className="text-5xl font-bold"
      >
        The quick brown fox jumps over the lazy dog.
      </div>
      <div
        style={{ fontFamily: `'${bodyFont}', sans-serif` }}
        className="mt-6 text-lg"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </div>
  );
}

export function FontPairingTool() {
  const [fontPairings, setFontPairings] = useState<FontPairingOutput['pairings']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualHeadline, setManualHeadline] = useState('Roboto Slab');
  const [manualBody, setManualBody] = useState('Roboto');

  const { toast } = useToast();

  const printableRefs = useRef<Array<HTMLDivElement | null>>([]);
  const manualPrintableRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<FontPairingInput>({
    resolver: zodResolver(FontPairingInputSchema),
    defaultValues: {
      style: 'modern and clean',
    },
  });

  useEffect(() => {
    const allFonts = [
      ...fontPairings.flatMap(p => [p.headlineFont, p.bodyFont]),
      manualHeadline,
      manualBody,
    ].filter(Boolean);
    
    const uniqueFonts = [...new Set(allFonts)];

    if (uniqueFonts.length > 0) {
      const fontQuery = uniqueFonts.join('|').replace(/ /g, '+');
      const existingLink = document.getElementById('dynamic-google-fonts');

      const link = (existingLink || document.createElement('link')) as HTMLLinkElement;
      link.id = 'dynamic-google-fonts';
      link.href = `https://fonts.googleapis.com/css?family=${fontQuery}&display=swap`;
      link.rel = 'stylesheet';

      if (!existingLink) {
        document.head.appendChild(link);
      }
    }
  }, [fontPairings, manualHeadline, manualBody]);

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

  const exportContent = async (element: HTMLDivElement | null, format: 'png' | 'pdf', fileName: string) => {
    if (!element) return;

    if (format === 'png') {
        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
        }
    } else { // PDF
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Font Pairing</title>');
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
            printWindow.document.write('</head><body class="p-8">');
            printWindow.document.write(element.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    }
  };

  return (
    <div className="space-y-8">
      <Card>
          <CardHeader>
              <CardTitle>Manual Pairing</CardTitle>
              <CardDescription>Create your own font combination.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                      <Label>Headline Font</Label>
                      <Select value={manualHeadline} onValueChange={setManualHeadline}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent className="max-h-60">
                              {googleFonts.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                   <div className="space-y-2">
                      <Label>Body Font</Label>
                      <Select value={manualBody} onValueChange={setManualBody}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent className="max-h-60">
                              {googleFonts.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
              </div>
              <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportContent(manualPrintableRef.current, 'png', `manual-${manualHeadline.replace(' ', '-')}`)}>
                      <ImageIcon className="mr-2 h-4 w-4" /> PNG
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportContent(manualPrintableRef.current, 'pdf', 'manual-pairing')}>
                      <Printer className="mr-2 h-4 w-4" /> PDF
                  </Button>
              </div>
          </CardContent>
          <FontPreview headlineFont={manualHeadline} bodyFont={manualBody} printableRef={manualPrintableRef} />
      </Card>
    
      <Card>
        <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
        </CardHeader>
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
                  <Button variant="outline" size="sm" onClick={() => exportContent(printableRefs.current[index], 'png', `pairing-${pairing.headlineFont.replace(' ', '-')}`)}>
                    <ImageIcon className="mr-2 h-4 w-4" /> PNG
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportContent(printableRefs.current[index], 'pdf', 'ai-pairing')}>
                    <Printer className="mr-2 h-4 w-4" /> PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <FontPreview 
                headlineFont={pairing.headlineFont} 
                bodyFont={pairing.bodyFont} 
                printableRef={el => (printableRefs.current[index] = el)} 
            />
          </Card>
        ))}
        {!isLoading && fontPairings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Your AI-suggested font pairings will appear here.</p>
            <p className="text-sm text-muted-foreground">Describe a style and click "Generate".</p>
          </div>
        )}
      </div>
    </div>
  );
}
