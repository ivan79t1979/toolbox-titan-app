'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function Base64ConverterForm() {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePlainTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setPlainText(newText);
    setError('');
    try {
      setBase64Text(btoa(unescape(encodeURIComponent(newText))));
    } catch (e) {
      // This should rarely happen with btoa
      setError('Could not encode text.');
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBase64 = e.target.value;
    setBase64Text(newBase64);
    setError('');
    if (newBase64.trim() === '') {
        setPlainText('');
        return;
    }
    try {
      // Check if the string is a valid base64 string.
      // A-Z, a-z, 0-9, +, /, =
      if (!/^[A-Za-z0-9+/]*=?=?$/.test(newBase64)) {
          throw new Error('Invalid Base64 characters');
      }
      setPlainText(decodeURIComponent(escape(atob(newBase64))));
    } catch (e) {
      setError('Invalid Base64 string.');
    }
  };
  
  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard!`,
    });
  };

  const handleClear = (type: 'plain' | 'base64') => {
      if (type === 'plain') {
          setPlainText('');
          setBase64Text('');
      } else {
          setBase64Text('');
          setPlainText('');
      }
      setError('');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="space-y-2 relative">
                <Label htmlFor="plain-text" className="text-lg font-semibold">Plain Text</Label>
                 <div className="absolute right-2 top-0 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(plainText, 'Plain text')} disabled={!plainText}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleClear('plain')} disabled={!plainText}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <Textarea
                    id="plain-text"
                    placeholder="Type or paste plain text here..."
                    value={plainText}
                    onChange={handlePlainTextChange}
                    className="h-80 min-h-[200px] text-base font-mono"
                />
            </div>

            <div className="flex justify-center">
                <ArrowRightLeft className="h-8 w-8 text-muted-foreground hidden md:block" />
                 <div className="w-full h-px bg-border md:hidden"></div>
            </div>

            <div className="space-y-2 relative">
                 <Label htmlFor="base64-text" className="text-lg font-semibold">Base64</Label>
                 <div className="absolute right-2 top-0 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(base64Text, 'Base64')} disabled={!base64Text}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleClear('base64')} disabled={!base64Text}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <Textarea
                    id="base64-text"
                    placeholder="Type or paste Base64 here..."
                    value={base64Text}
                    onChange={handleBase64Change}
                    className="h-80 min-h-[200px] text-base font-mono"
                />
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
