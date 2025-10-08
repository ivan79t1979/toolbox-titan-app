'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

type ShapeType = 'rectangle' | 'circle' | 'ellipse' | 'polygon';

export function SvgShapeGeneratorForm() {
  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);
  const [fillColor, setFillColor] = useState('#4A90E2');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [borderRadius, setBorderRadius] = useState(10); // for rectangle
  const [sides, setSides] = useState(3); // for polygon

  const { toast } = useToast();

  const svgCode = useMemo(() => {
    const svgProps = `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`;
    let shapeElement = '';

    switch (shape) {
      case 'rectangle':
        shapeElement = `<rect width="${width}" height="${height}" rx="${borderRadius}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        break;
      case 'circle':
        const r = Math.min(width, height) / 2;
        shapeElement = `<circle cx="${width / 2}" cy="${height / 2}" r="${r - strokeWidth / 2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        break;
      case 'ellipse':
        const rx = width / 2 - strokeWidth / 2;
        const ry = height / 2 - strokeWidth / 2;
        shapeElement = `<ellipse cx="${width / 2}" cy="${height / 2}" rx="${rx}" ry="${ry}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        break;
      case 'polygon':
        const points = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - strokeWidth;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
        }
        shapeElement = `<polygon points="${points.join(' ')}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        break;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" ${svgProps}>\n  ${shapeElement}\n</svg>`;
  }, [shape, width, height, fillColor, strokeColor, strokeWidth, borderRadius, sides]);

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    toast({
      title: 'SVG Code Copied!',
      description: 'The SVG code has been copied to your clipboard.',
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Shape & Dimensions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shape-select">Shape</Label>
              <Select value={shape} onValueChange={(v: ShapeType) => setShape(v)}>
                <SelectTrigger id="shape-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="ellipse">Ellipse</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width ({width}px)</Label>
                <Slider id="width" value={[width]} onValueChange={([v]) => setWidth(v)} min={10} max={500} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height ({height}px)</Label>
                <Slider id="height" value={[height]} onValueChange={([v]) => setHeight(v)} min={10} max={500} />
              </div>
            </div>
            {shape === 'rectangle' && (
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius ({borderRadius}px)</Label>
                <Slider id="borderRadius" value={[borderRadius]} onValueChange={([v]) => setBorderRadius(v)} min={0} max={Math.min(width, height) / 2} />
              </div>
            )}
             {shape === 'polygon' && (
              <div className="space-y-2">
                <Label htmlFor="sides">Sides ({sides})</Label>
                <Slider id="sides" value={[sides]} onValueChange={([v]) => setSides(v)} min={3} max={12} step={1} />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Style</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fillColor">Fill Color</Label>
                    <Input id="fillColor" type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="h-10 w-full p-1" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="strokeColor">Stroke Color</Label>
                    <Input id="strokeColor" type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="h-10 w-full p-1" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="strokeWidth">Stroke Width ({strokeWidth}px)</Label>
                <Slider id="strokeWidth" value={[strokeWidth]} onValueChange={([v]) => setStrokeWidth(v)} min={0} max={20} />
              </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
            <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px] bg-muted/30 rounded-md">
                <div dangerouslySetInnerHTML={{ __html: svgCode }} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2"><Code /> SVG Code</CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleCopy}><Copy className="h-4 w-4"/></Button>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea readOnly value={svgCode} className="h-48 font-mono text-xs" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
