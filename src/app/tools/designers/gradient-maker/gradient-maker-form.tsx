'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Copy, Plus, Trash2, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ColorStop = {
  id: number;
  color: string;
  position: number;
};

export function GradientMakerForm() {
  const [colors, setColors] = useState<ColorStop[]>([
    { id: 1, color: '#4A90E2', position: 0 },
    { id: 2, color: '#9013FE', position: 100 },
  ]);
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const { toast } = useToast();

  const gradientCss = useMemo(() => {
    const colorStops = colors
      .sort((a, b) => a.position - b.position)
      .map((c) => `${c.color} ${c.position}%`)
      .join(', ');

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    }
    return `radial-gradient(circle, ${colorStops})`;
  }, [colors, gradientType, angle]);

  const addColor = () => {
    const newColor: ColorStop = {
      id: Date.now(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      position: 50,
    };
    setColors([...colors, newColor]);
  };

  const removeColor = (id: number) => {
    if (colors.length <= 2) {
      toast({
        variant: 'destructive',
        title: 'Cannot remove color',
        description: 'A gradient must have at least two colors.',
      });
      return;
    }
    setColors(colors.filter((c) => c.id !== id));
  };

  const updateColor = (id: number, newColor: Partial<ColorStop>) => {
    setColors(colors.map((c) => (c.id === id ? { ...c, ...newColor } : c)));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${gradientCss};`);
    toast({
      title: 'CSS Copied!',
      description: 'The gradient CSS has been copied to your clipboard.',
    });
  };
  
  const reverseColors = () => {
    setColors([...colors].reverse().map(c => ({...c, position: 100 - c.position})));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={gradientType}
                  onValueChange={(value) => setGradientType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gradient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {gradientType === 'linear' && (
                <div className="space-y-2">
                  <Label htmlFor="angle">Angle ({angle}°)</Label>
                  <Slider
                    id="angle"
                    min={0}
                    max={360}
                    value={[angle]}
                    onValueChange={(value) => setAngle(value[0])}
                  />
                </div>
              )}
            </div>
             <Button onClick={reverseColors} variant="outline" size="sm">
                <RotateCw className="mr-2 h-4 w-4" />
                Reverse Colors
            </Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-4 space-y-4">
                 {colors.map((color) => (
                    <div key={color.id} className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
                        <Input
                            type="color"
                            value={color.color}
                            onChange={(e) => updateColor(color.id, { color: e.target.value })}
                            className="h-10 w-12 p-1"
                        />
                        <div className="space-y-2">
                             <Input
                                type="text"
                                value={color.color.toUpperCase()}
                                onChange={(e) => updateColor(color.id, { color: e.target.value })}
                                className="font-mono h-8"
                            />
                             <Slider
                                value={[color.position]}
                                onValueChange={(v) => updateColor(color.id, { position: v[0] })}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColor(color.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <Button onClick={addColor} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Color
                </Button>
            </CardContent>
        </Card>

      </div>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div
              className="w-full h-64 rounded-md border"
              style={{ background: gradientCss }}
            />
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <Label>CSS Code</Label>
                    <div className="relative">
                        <Input
                            readOnly
                            value={`background: ${gradientCss};`}
                            className="font-mono pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
