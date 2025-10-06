'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, QrCodeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QrCodeGeneratorForm() {
  const [value, setValue] = useState('');
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = () => {
    if (!qrCodeRef.current || !value) return;

    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: 'Download started!',
        description: 'Your QR code is being downloaded.',
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="qr-value">Text or URL</Label>
        <Input
          id="qr-value"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-base"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            {value ? (
              <div
                ref={qrCodeRef}
                className="rounded-lg bg-white p-4"
                aria-label={`QR Code for ${value}`}
              >
                <QRCode value={value} size={256} />
              </div>
            ) : (
              <div className="flex h-[288px] w-[288px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                <QrCodeIcon className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">
                  Your QR code will appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleDownload}
        disabled={!value}
        className="w-full"
        size="lg"
      >
        <Download className="mr-2 h-5 w-5" />
        Download QR Code
      </Button>
    </div>
  );
}
