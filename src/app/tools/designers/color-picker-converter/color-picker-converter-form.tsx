'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

// --- Conversion Functions ---

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl({ r, g, b }: RGB): HSL {
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
}


export function ColorPickerConverterForm() {
  const [hex, setHex] = useState('#4A90E2');
  const [rgb, setRgb] = useState<RGB>({ r: 74, g: 144, b: 226 });
  const [hsl, setHsl] = useState<HSL>({ h: 212, s: 71, l: 59 });
  const { toast } = useToast();
  
  useEffect(() => {
    const newHex = rgbToHex(rgb);
    if(newHex !== hex.toLowerCase()) setHex(newHex);
    
    const newHsl = rgbToHsl(rgb);
    if (newHsl.h !== hsl.h || newHsl.s !== hsl.s || newHsl.l !== hsl.l) setHsl(newHsl);
  }, [rgb]);


  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHex(newHex);
    const newRgb = hexToRgb(newHex);
    if (newRgb) {
      setRgb(newRgb);
    }
  };

  const handleRgbChange = (part: keyof RGB, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      const newRgb = { ...rgb, [part]: numValue };
      setRgb(newRgb);
    }
  };

  const handleHslChange = (part: keyof HSL, value: string) => {
    const numValue = parseInt(value, 10);
    const max = part === 'h' ? 360 : 100;
    if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
      const newHsl = { ...hsl, [part]: numValue };
      setHsl(newHsl);
      setRgb(hslToRgb(newHsl));
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({ title: 'Copied to clipboard!', description: `${value} has been copied.` });
  };
  
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;


  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <Label htmlFor="color-picker" className="text-lg">
                Pick a Color
              </Label>
              <div className="relative h-32 w-32">
                <Input
                  id="color-picker"
                  type="color"
                  value={hex}
                  onChange={handleHexChange}
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                />
              </div>
              <div
                className="h-16 w-full rounded-md border"
                style={{ backgroundColor: hex }}
              />
            </div>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Palette className="text-primary" />
                Color Values
              </h3>
              <ColorValueInput label="HEX" value={hex} onCopy={() => handleCopy(hex)} onChange={handleHexChange} />
              
              <div className="space-y-1">
                 <Label className="text-sm font-medium text-muted-foreground">RGB</Label>
                 <div className="grid grid-cols-3 gap-2">
                     <Input type="number" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} min="0" max="255" />
                     <Input type="number" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} min="0" max="255" />
                     <Input type="number" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} min="0" max="255" />
                 </div>
                 <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => handleCopy(rgbString)}>Copy {rgbString}</Button>
              </div>

               <div className="space-y-1">
                 <Label className="text-sm font-medium text-muted-foreground">HSL</Label>
                 <div className="grid grid-cols-3 gap-2">
                     <Input type="number" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} min="0" max="360" />
                     <Input type="number" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} min="0" max="100" />
                     <Input type="number" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} min="0" max="100" />
                 </div>
                  <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => handleCopy(hslString)}>Copy {hslString}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type ColorValueInputProps = {
  label: string;
  value: string;
  onCopy: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function ColorValueInput({ label, value, onCopy, onChange }: ColorValueInputProps) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          value={value}
          onChange={onChange}
          className="font-mono text-base"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={onCopy}
          aria-label={`Copy ${label} value`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
