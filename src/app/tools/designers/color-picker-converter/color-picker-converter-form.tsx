'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorPickerConverterForm() {
  const [color, setColor] = useState('#4A90E2');
  const { toast } = useToast();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const convertedValues = useMemo(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return { rgb: 'Invalid HEX', hsl: 'Invalid HEX' };
    const hsl = rgbToHsl(rgb);
    return {
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [color]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: 'Copied to clipboard!',
      description: `${value} has been copied.`,
    });
  };

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
                  value={color}
                  onChange={handleColorChange}
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                />
              </div>
              <div
                className="h-16 w-full rounded-md border"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Palette className="text-primary" />
                Color Values
              </h3>
              <ColorValueRow label="HEX" value={color} onCopy={handleCopy} />
              <ColorValueRow
                label="RGB"
                value={convertedValues.rgb}
                onCopy={handleCopy}
              />
              <ColorValueRow
                label="HSL"
                value={convertedValues.hsl}
                onCopy={handleCopy}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type ColorValueRowProps = {
  label: string;
  value: string;
  onCopy: (value: string) => void;
};

function ColorValueRow({ label, value, onCopy }: ColorValueRowProps) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          readOnly
          value={value}
          className="font-mono text-base"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={() => onCopy(value)}
          aria-label={`Copy ${label} value`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
