'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper to convert hex color to rgba
function hexToRgba(hex: string, alpha: number): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


export function CssShadowGeneratorForm() {
  const [offsetX, setOffsetX] = useState(10);
  const [offsetY, setOffsetY] = useState(10);
  const [blurRadius, setBlurRadius] = useState(5);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.5);
  const [inset, setInset] = useState(false);
  const { toast } = useToast();

  const shadowCss = useMemo(() => {
    const rgbaColor = hexToRgba(color, opacity);
    return `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
  }, [offsetX, offsetY, blurRadius, spreadRadius, color, opacity, inset]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowCss};`);
    toast({
      title: 'CSS Copied!',
      description: 'The box-shadow CSS has been copied to your clipboard.',
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
      <div className="space-y-6">
        <Card>
            <CardContent className="p-4 space-y-4">
                <SliderControl label="Horizontal Offset" value={offsetX} setValue={setOffsetX} min={-50} max={50} />
                <SliderControl label="Vertical Offset" value={offsetY} setValue={setOffsetY} min={-50} max={50} />
                <SliderControl label="Blur Radius" value={blurRadius} setValue={setBlurRadius} min={0} max={100} />
                <SliderControl label="Spread Radius" value={spreadRadius} setValue={setSpreadRadius} min={-50} max={50} />
            </CardContent>
        </Card>
        <Card>
             <CardContent className="p-4 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="color">Shadow Color</Label>
                        <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full p-1"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="opacity">Opacity ({opacity.toFixed(2)})</Label>
                        <Slider id="opacity" value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0} max={1} step={0.01} />
                    </div>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="inset-mode" checked={inset} onCheckedChange={setInset} />
                    <Label htmlFor="inset-mode">Inset</Label>
                </div>
            </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
            <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center p-8 bg-muted/30 rounded-md min-h-[300px]">
                <div
                    className="w-48 h-48 bg-background rounded-lg transition-all duration-200"
                    style={{ boxShadow: shadowCss }}
                />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>CSS Code</CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleCopy}><Copy className="h-4 w-4"/></Button>
                </div>
            </CardHeader>
            <CardContent>
                <Input readOnly value={`box-shadow: ${shadowCss};`} className="font-mono" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SliderControl({ label, value, setValue, min, max }: { label: string, value: number, setValue: (val: number) => void, min: number, max: number }) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      setValue(numValue);
    }
  };
    
  return (
      <div className="space-y-2">
          <div className="flex justify-between items-center">
              <Label>{label}</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number"
                  value={value}
                  onChange={handleInputChange}
                  min={min}
                  max={max}
                  className="w-20 h-8 text-center"
                />
                <span className="font-mono text-sm text-muted-foreground">px</span>
              </div>
          </div>
          <Slider value={[value]} onValueChange={([v]) => setValue(v)} min={min} max={max} />
      </div>
  )
}
