
'use client';

import { useState, useRef, useCallback, CSSProperties } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Upload,
  Download,
  Crop,
  Sun,
  Contrast,
  Palette,
  Droplets,
  Undo2,
  RefreshCw,
  Trash2,
  Replace,
  RotateCcw,
  FlipHorizontal,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { default as NextImage } from 'next/image';
import ReactCrop, {
  type Crop as CropType,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const [isCropMode, setIsCropMode] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const removeImage = () => {
    setImageSrc(null);
    setHistory([]);
    resetAll();
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const resetAll = () => {
    setAdjustments(defaultAdjustments);
    setRotation(0);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsCropMode(false);
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setImageSrc(newHistory[newHistory.length - 1]);
      // Reset adjustments when undoing, as they are not part of history
      resetAll();
    }
  };

  const imageStyle: CSSProperties = {
    filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturate}%) grayscale(${adjustments.grayscale}%) sepia(${adjustments.sepia}%) invert(${adjustments.invert}%)`,
    transform: `rotate(${rotation}deg)`,
  };

  const handleDownload = () => {
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new (window as any).Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      if (ctx) {
        ctx.filter = imageStyle.filter as string;
        
        // Handle rotation for download
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      }

      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }

  const applyCrop = () => {
    if (!completedCrop || !imageRef.current || !imageSrc) {
      return;
    }
    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    
    // Create an intermediate canvas for rotation
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if(!tempCtx) return;

    const rad = (rotation * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    tempCanvas.width = image.naturalWidth * absCos + image.naturalHeight * absSin;
    tempCanvas.height = image.naturalWidth * absSin + image.naturalHeight * absCos;
    
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(rad);
    tempCtx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

    // Now crop from the rotated canvas
    const scaleX = tempCanvas.width / image.width;
    const scaleY = tempCanvas.height / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      tempCanvas,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );


    const newSrc = canvas.toDataURL('image/png');
    setImageSrc(newSrc);
    setHistory([...history, newSrc]);
    setIsCropMode(false);
    setRotation(0); // Reset rotation after cropping
  };
  
  const toggleCropMode = () => {
      setIsCropMode(!isCropMode);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-4 space-y-4">
          <Tabs defaultValue="adjust">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="adjust">Adjust</TabsTrigger>
              <TabsTrigger value="crop">Crop &amp; Rotate</TabsTrigger>
            </TabsList>
            <TabsContent value="adjust" className="space-y-4 pt-2">
              <AdjustmentSlider
                icon={Sun}
                label="Brightness"
                value={adjustments.brightness}
                onValueChange={(v) => setAdjustments((p) => ({ ...p, brightness: v }))}
                min={0}
                max={200}
              />
              <AdjustmentSlider
                icon={Contrast}
                label="Contrast"
                value={adjustments.contrast}
                onValueChange={(v) => setAdjustments((p) => ({ ...p, contrast: v }))}
                min={0}
                max={200}
              />
              <AdjustmentSlider
                icon={Palette}
                label="Saturation"
                value={adjustments.saturate}
                onValueChange={(v) => setAdjustments((p) => ({ ...p, saturate: v }))}
                min={0}
                max={200}
              />
              <AdjustmentSlider
                icon={Droplets}
                label="Grayscale"
                value={adjustments.grayscale}
                onValueChange={(v) => setAdjustments((p) => ({ ...p, grayscale: v }))}
                min={0}
                max={100}
              />
              <AdjustmentSlider
                icon={Droplets}
                label="Sepia"
                value={adjustments.sepia}
                onValueChange={(v) => setAdjustments((p) => ({ ...p, sepia: v }))}
                min={0}
                max={100}
              />
               <AdjustmentSlider
                icon={FlipHorizontal}
                label="Invert"
                value={adjustments.invert}
                onValueChange={(v) => setAdjustments((p) => ({ ...p, invert: v }))}
                min={0}
                max={100}
              />
            </TabsContent>
            <TabsContent value="crop" className="space-y-4 pt-2">
                <AdjustmentSlider
                  icon={RotateCcw}
                  label="Rotation"
                  value={rotation}
                  onValueChange={setRotation}
                  min={-180}
                  max={180}
                  step={1}
                />
                <Button variant="outline" className="w-full" onClick={toggleCropMode}>
                    <Crop className="mr-2"/> {isCropMode ? 'Cancel Crop' : 'Enter Crop Mode'}
                </Button>
                {isCropMode && (
                    <Button className="w-full" onClick={applyCrop} disabled={!completedCrop}>
                        Apply Crop
                    </Button>
                )}
            </TabsContent>
          </Tabs>
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button onClick={undo} variant="outline" disabled={history.length <= 1} className="w-full">
              <Undo2 className="mr-2" />
              Undo
            </Button>
            <Button onClick={resetAll} variant="destructive" className="w-full">
              <RefreshCw className="mr-2" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!imageSrc ? (
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg">
                        <span className="font-semibold">Click to upload</span> or drag &amp; drop
                    </p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, WEBP, etc.</p>
                    </div>
                    <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} ref={fileInputRef}/>
                </label>
            </div>
        ) : (
          <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Image Preview</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Replace className="mr-2" /> Change
                        </Button>
                        <Button variant="destructive" size="sm" onClick={removeImage}>
                            <Trash2 className="mr-2" /> Remove
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative w-full flex items-center justify-center bg-muted/20 rounded-md overflow-auto max-h-[70vh]">
                {isCropMode ? (
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                    >
                      <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Editable image"
                        style={imageStyle}
                        className="max-w-none"
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                ) : (
                     <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Editable image"
                        style={imageStyle}
                        className="max-w-full max-h-[70vh] object-contain"
                      />
                )}
              </div>
            </CardContent>
            <CardHeader className="pt-0">
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2" />
                Download Image
              </Button>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

function AdjustmentSlider({
  icon: Icon,
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <Label>{label}</Label>
        <span className="ml-auto text-sm font-mono text-muted-foreground">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
