
'use client';

import { useState, useRef, useCallback, CSSProperties } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  Crop,
  Sun,
  Contrast,
  Palette,
  Droplets,
  Undo2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type Adjustments = {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  invert: number;
};

const defaultAdjustments: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
};

export function ImageEditor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustments>(defaultAdjustments);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        setHistory([result]);
        resetAll();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setAdjustments(defaultAdjustments);
    setRotation(0);
    setIsCropping(false);
  };
  
  const undo = () => {
      if (history.length > 1) {
          const newHistory = [...history];
          newHistory.pop();
          setHistory(newHistory);
          setImageSrc(newHistory[newHistory.length - 1]);
      }
  }

  const imageStyle: CSSProperties = {
    filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturate}%) grayscale(${adjustments.grayscale}%) sepia(${adjustments.sepia}%) invert(${adjustments.invert}%)`,
    transform: `rotate(${rotation}deg)`,
  };

  const handleDownload = () => {
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        if(ctx) {
            ctx.filter = imageStyle.filter as string;
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);
        }

        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL();
        link.click();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-4 space-y-4">
            <Tabs defaultValue="adjust">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="adjust">Adjust</TabsTrigger>
                    <TabsTrigger value="crop">Crop & Rotate</TabsTrigger>
                </TabsList>
                <TabsContent value="adjust" className="space-y-4 pt-2">
                    <AdjustmentSlider icon={Sun} label="Brightness" value={adjustments.brightness} onValueChange={(v) => setAdjustments(p => ({...p, brightness: v}))} min={0} max={200} />
                    <AdjustmentSlider icon={Contrast} label="Contrast" value={adjustments.contrast} onValueChange={(v) => setAdjustments(p => ({...p, contrast: v}))} min={0} max={200} />
                    <AdjustmentSlider icon={Palette} label="Saturation" value={adjustments.saturate} onValueChange={(v) => setAdjustments(p => ({...p, saturate: v}))} min={0} max={200} />
                    <AdjustmentSlider icon={Droplets} label="Grayscale" value={adjustments.grayscale} onValueChange={(v) => setAdjustments(p => ({...p, grayscale: v}))} min={0} max={100} />
                    <AdjustmentSlider icon={Droplets} label="Sepia" value={adjustments.sepia} onValueChange={(v) => setAdjustments(p => ({...p, sepia: v}))} min={0} max={100} />
                </TabsContent>
                <TabsContent value="crop" className="space-y-4 pt-2">
                     <p className="text-sm text-muted-foreground">Crop functionality is coming soon!</p>
                     <div className="flex gap-2">
                        <Button variant="outline" className="w-full" disabled><Crop className="mr-2"/>Enter Crop Mode</Button>
                     </div>
                     <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setRotation(r => r - 90)}><RotateCcw /></Button>
                        <Button variant="outline" size="icon" onClick={() => setRotation(r => r + 90)}><RotateCw /></Button>
                     </div>
                </TabsContent>
            </Tabs>
            <div className="flex items-center gap-2 pt-4 border-t">
                <Button onClick={undo} variant="outline" disabled={history.length <= 1} className="w-full"><Undo2 className="mr-2"/>Undo</Button>
                <Button onClick={resetAll} variant="destructive" className="w-full">Reset All</Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          {!imageSrc && (
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                <p className="mb-2 text-lg"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, WEBP, etc.</p>
              </div>
              <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>
        
        {imageSrc && (
          <Card>
            <CardContent className="p-4">
                <div className="relative w-full aspect-video bg-muted/20 flex items-center justify-center overflow-hidden rounded-md">
                    <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Editable image"
                        style={imageStyle}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </CardContent>
            <CardHeader className="pt-0">
                <Button onClick={handleDownload} className="w-full" size="lg"><Download className="mr-2"/>Download Image</Button>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

function AdjustmentSlider({ icon: Icon, label, value, onValueChange, min, max}: { icon: React.ElementType, label: string, value: number, onValueChange: (value: number) => void, min: number, max: number }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground"/>
                <Label>{label}</Label>
                <span className="ml-auto text-sm font-mono text-muted-foreground">{value}</span>
            </div>
            <Slider value={[value]} onValueChange={([v]) => onValueChange(v)} min={min} max={max} />
        </div>
    )
}
