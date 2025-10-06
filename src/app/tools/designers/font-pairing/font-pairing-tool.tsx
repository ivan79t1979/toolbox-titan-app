'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fontPairing } from '@/ai/flows/font-pairing';
import {
  type FontPairingInput,
  type FontPairingOutput,
} from '@/ai/flows/font-pairing-types';
import { googleFonts } from '@/lib/google-fonts';
import { FontPairingInputSchema } from '@/ai/flows/font-pairing-types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Printer, Image as ImageIcon, TextSelect, ChevronsUpDown, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

function FontPreview({
  headlineFont,
  bodyFont,
  previewHeadline,
  previewBody,
  printableRef,
}: {
  headlineFont: string;
  bodyFont: string;
  previewHeadline: string;
  previewBody: string;
  printableRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={printableRef} className="bg-background p-8 rounded-b-lg">
      <div
        style={{ fontFamily: `'${headlineFont}', sans-serif` }}
        className="text-5xl font-bold"
      >
        {previewHeadline}
      </div>
      <div
        style={{ fontFamily: `'${bodyFont}', sans-serif` }}
        className="mt-6 text-lg"
      >
        {previewBody}
      </div>
    </div>
  );
}

function FontCombobox({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (font: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSelect = (fontValue: string) => {
    onSelect(fontValue);
    setSearchValue('');
    setOpen(false);
  };
  
  const filteredFonts = searchValue
    ? googleFonts.filter(f => f.toLowerCase().includes(searchValue.toLowerCase()))
    : googleFonts;

  const showCustomOption = searchValue && !filteredFonts.some(f => f.toLowerCase() === searchValue.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span style={{ fontFamily: `'${value}', sans-serif` }}>{value}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search or type a Google Font..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
             {showCustomOption && (
                <CommandItem onSelect={() => handleSelect(searchValue)}>
                    Use Font: "{searchValue}"
                </CommandItem>
            )}
            <CommandGroup>
              {filteredFonts.map((font) => (
                <CommandItem
                  key={font}
                  value={font}
                  onSelect={() => handleSelect(font)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.toLowerCase() === font.toLowerCase() ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span style={{ fontFamily: `'${font}', sans-serif` }}>{font}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FontPairingTool() {
  const [fontPairings, setFontPairings] = useState<FontPairingOutput['pairings']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualHeadline, setManualHeadline] = useState('Roboto Slab');
  const [manualBody, setManualBody] = useState('Roboto');
  const [previewHeadline, setPreviewHeadline] = useState('The quick brown fox jumps over the lazy dog.');
  const [previewBody, setPreviewBody] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');


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
    // Combine all fonts that need to be loaded
    const allFonts = [
      ...fontPairings.flatMap(p => [p.headlineFont, p.bodyFont]),
      manualHeadline,
      manualBody,
    ].filter(Boolean);
    
    // De-duplicate fonts, also considering case-insensitivity
    const uniqueFonts = [...new Set(allFonts.map(f => f.toLowerCase()))]
      .map(lowerCaseFont => allFonts.find(f => f.toLowerCase() === lowerCaseFont))
      .filter((f): f is string => !!f);


    if (uniqueFonts.length > 0) {
      const fontQuery = uniqueFonts.map(f => f.replace(/ /g, '+')).join('|');
      const linkId = 'dynamic-google-fonts';
      let link = document.getElementById(linkId) as HTMLLinkElement;

      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      
      const newHref = `https://fonts.googleapis.com/css?family=${fontQuery}:400,700&display=swap`;
      if (link.href !== newHref) {
        link.href = newHref;
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
              <CardTitle className="flex items-center gap-2"><TextSelect /> Custom Preview Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <Label htmlFor="previewHeadline">Headline Text</Label>
                  <Input id="previewHeadline" value={previewHeadline} onChange={(e) => setPreviewHeadline(e.target.value)} />
              </div>
              <div>
                  <Label htmlFor="previewBody">Body Text</Label>
                  <Input id="previewBody" value={previewBody} onChange={(e) => setPreviewBody(e.target.value)} />
              </div>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Manual Pairing</CardTitle>
              <CardDescription>Create your own font combination.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                      <Label>Headline Font</Label>
                      <FontCombobox value={manualHeadline} onSelect={setManualHeadline} />
                  </div>
                   <div className="space-y-2">
                      <Label>Body Font</Label>
                      <FontCombobox value={manualBody} onSelect={setManualBody} />
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
          <FontPreview 
            headlineFont={manualHeadline} 
            bodyFont={manualBody} 
            previewHeadline={previewHeadline}
            previewBody={previewBody}
            printableRef={manualPrintableRef} 
          />
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
                previewHeadline={previewHeadline}
                previewBody={previewBody}
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
