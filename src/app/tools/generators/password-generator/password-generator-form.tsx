'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type PasswordEntry = {
  id: string;
  value: string;
};

export function PasswordGeneratorForm() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charPool = lowercaseChars;
    if (includeUppercase) charPool += uppercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (charPool === '') {
      toast({
        variant: 'destructive',
        title: 'No character types selected',
        description: 'Please select at least one character type to generate a password.',
      });
      return;
    }

    let newPasswordValue = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPasswordValue += charPool[randomIndex];
    }
    
    const newPasswordEntry: PasswordEntry = {
        id: `pw-${Date.now()}`,
        value: newPasswordValue,
    };

    setPasswords(prev => [newPasswordEntry, ...prev]);

  }, [length, includeUppercase, includeNumbers, includeSymbols, toast]);

  const handleCopy = (passwordValue: string) => {
    navigator.clipboard.writeText(passwordValue);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const handleDelete = (passwordId: string) => {
    setPasswords(passwords.filter(p => p.id !== passwordId));
  }
  
  const handleCopyAll = () => {
    if (passwords.length === 0) return;
    const allPasswords = passwords.map(p => p.value).join('\n');
    navigator.clipboard.writeText(allPasswords);
    toast({
      title: 'All passwords copied!',
      description: `${passwords.length} passwords have been copied.`,
    });
  };

  const handleDeleteAll = () => {
    setPasswords([]);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>
          Customize the options and generate secure passwords.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="length">Password Length</Label>
            <span className="font-mono text-lg font-medium">{length}</span>
          </div>
          <Slider
            id="length"
            min={8}
            max={64}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
            />
            <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
            />
            <Label htmlFor="numbers">Numbers (0-9)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
            />
            <Label htmlFor="symbols">Symbols (!@#$...)</Label>
          </div>
        </div>
        <Button onClick={generatePassword} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New Password
        </Button>
      </CardContent>

      <CardHeader className="border-t pt-6">
        <div className="flex justify-between items-center">
            <CardTitle>Generated Passwords ({passwords.length})</CardTitle>
            {passwords.length > 0 && (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyAll}><Copy className="mr-2 h-4 w-4" /> Copy All</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAll}><Trash2 className="mr-2 h-4 w-4" /> Clear All</Button>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent>
         <ScrollArea className="h-64">
            {passwords.length > 0 ? (
                <div className="space-y-2">
                    {passwords.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 rounded-md bg-muted/50 p-3 font-mono">
                            <span className="flex-grow truncate">{p.value}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(p.value)}><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Your generated passwords will appear here.
                </div>
            )}
         </ScrollArea>
      </CardContent>
    </Card>
  );
}
