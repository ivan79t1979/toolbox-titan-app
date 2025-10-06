'use client';

import { useState, useMemo, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, QrCodeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

type QrType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi';

type WifiForm = {
  ssid: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  password?: string;
};

export function QrCodeGeneratorForm() {
  const [qrType, setQrType] = useState<QrType>('url');
  const [text, setText] = useState('https://example.com');
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState({ to: '', message: '' });
  const [wifi, setWifi] = useState<WifiForm>({
    ssid: '',
    encryption: 'WPA',
    password: '',
  });

  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const qrValue = useMemo(() => {
    switch (qrType) {
      case 'url':
      case 'text':
        return text;
      case 'email':
        const { to, subject, body } = email;
        const mailto = `mailto:${to}`;
        const params = new URLSearchParams();
        if (subject) params.append('subject', subject);
        if (body) params.append('body', body);
        const paramsString = params.toString();
        return paramsString ? `${mailto}?${paramsString}` : mailto;
      case 'phone':
        return `tel:${phone}`;
      case 'sms':
        return `smsto:${sms.to}:${sms.message}`;
      case 'wifi':
        if (!wifi.ssid) return '';
        let wifiString = `WIFI:T:${wifi.encryption};S:${wifi.ssid};`;
        if (wifi.password && wifi.encryption !== 'nopass') {
          wifiString += `P:${wifi.password};`;
        }
        wifiString += ';';
        return wifiString;
      default:
        return '';
    }
  }, [qrType, text, email, phone, sms, wifi]);

  const handleDownload = () => {
    if (!qrCodeRef.current || !qrValue) return;

    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // To ensure high-quality download, we scale the canvas
    const scale = 2;
    const scaledSize = size * scale;
    canvas.width = scaledSize;
    canvas.height = scaledSize;

    const img = new Image();
    img.onload = () => {
      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the QR code image
      ctx.drawImage(img, 0, 0, scaledSize, scaledSize);

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
  
  const renderFormInputs = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="qr-url">URL</Label>
            <Input id="qr-url" placeholder="https://example.com" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        );
      case 'text':
         return (
          <div className="space-y-2">
            <Label htmlFor="qr-text">Text</Label>
            <Textarea id="qr-text" placeholder="Enter your text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To</Label>
              <Input id="email-to" type="email" placeholder="recipient@example.com" value={email.to} onChange={(e) => setEmail({...email, to: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input id="email-subject" placeholder="Email subject" value={email.subject} onChange={(e) => setEmail({...email, subject: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Body</Label>
              <Textarea id="email-body" placeholder="Email body" value={email.body} onChange={(e) => setEmail({...email, body: e.target.value})} />
            </div>
          </div>
        );
       case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor="qr-phone">Phone Number</Label>
            <Input id="qr-phone" type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="sms-to">To (Phone Number)</Label>
                <Input id="sms-to" type="tel" placeholder="+1234567890" value={sms.to} onChange={(e) => setSms({...sms, to: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sms-message">Message</Label>
                <Textarea id="sms-message" placeholder="Your SMS message" value={sms.message} onChange={(e) => setSms({...sms, message: e.target.value})} />
            </div>
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input id="wifi-ssid" value={wifi.ssid} onChange={(e) => setWifi({...wifi, ssid: e.target.value})} />
            </div>
             <div className="space-y-2">
              <Label>Encryption</Label>
              <Select value={wifi.encryption} onValueChange={(v: 'WPA' | 'WEP' | 'nopass') => setWifi({...wifi, encryption: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            {wifi.encryption !== 'nopass' && (
                <div className="space-y-2">
                    <Label htmlFor="wifi-password">Password</Label>
                    <Input id="wifi-password" type="password" value={wifi.password} onChange={(e) => setWifi({...wifi, password: e.target.value})} />
                </div>
            )}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
            <CardContent className="p-4">
                 <div className="space-y-2">
                    <Label>QR Code For</Label>
                    <Select value={qrType} onValueChange={(v: QrType) => setQrType(v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="url">URL</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone Number</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="wifi">WiFi Network</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4">
                {renderFormInputs()}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Size ({size}px)</Label>
                    <Slider value={[size]} onValueChange={(v) => setSize(v[0])} min={64} max={1024} step={8} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fg-color">Foreground Color</Label>
                        <Input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bg-color">Background Color</Label>
                        <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
      <div className="space-y-4 sticky top-4 self-start">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              {qrValue ? (
                <div
                  ref={qrCodeRef}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: bgColor }}
                  aria-label={`QR Code for ${qrValue}`}
                >
                  <QRCode value={qrValue} size={size} fgColor={fgColor} bgColor={bgColor} />
                </div>
              ) : (
                <div className="flex h-[288px] w-[288px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50" style={{width: size, height: size, maxWidth: '100%'}}>
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
          disabled={!qrValue}
          className="w-full"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
}
