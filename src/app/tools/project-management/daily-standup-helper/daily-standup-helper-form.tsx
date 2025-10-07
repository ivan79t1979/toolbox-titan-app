'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DailyStandupHelperForm() {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const { toast } = useToast();

  const formattedUpdate = useMemo(() => {
    let update = '**Yesterday**\n';
    update += yesterday.trim() ? `- ${yesterday.trim().replace(/\n/g, '\n- ')}\n\n` : '- (No updates)\n\n';

    update += '**Today**\n';
    update += today.trim() ? `- ${today.trim().replace(/\n/g, '\n- ')}\n\n` : '- (No updates)\n\n';

    update += '**Blockers**\n';
    update += blockers.trim() ? `- ${blockers.trim().replace(/\n/g, '\n- ')}` : '- None';

    return update;
  }, [yesterday, today, blockers]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedUpdate);
    toast({
      title: 'Copied to clipboard!',
      description: 'Your standup update has been copied.',
    });
  };
  
  const handleClear = () => {
      setYesterday('');
      setToday('');
      setBlockers('');
      toast({
          title: 'Fields cleared',
      })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="yesterday" className="text-base font-semibold">
            What did you do yesterday?
          </Label>
          <Textarea
            id="yesterday"
            value={yesterday}
            onChange={(e) => setYesterday(e.target.value)}
            placeholder="e.g., Finished the user authentication flow."
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="today" className="text-base font-semibold">
            What are you doing today?
          </Label>
          <Textarea
            id="today"
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="e.g., Start work on the dashboard component."
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blockers" className="text-base font-semibold">
            Any blockers?
          </Label>
          <Textarea
            id="blockers"
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="e.g., Waiting for the final API specification."
            className="min-h-[80px]"
          />
        </div>
        <Button onClick={handleClear} variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> Clear All Fields
        </Button>
      </div>

      <Card className="sticky top-20 self-start">
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                <CardTitle>Formatted Update</CardTitle>
                <CardDescription>Ready to copy and paste.</CardDescription>
              </div>
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] whitespace-pre-wrap rounded-md border bg-muted/50 p-4 font-mono text-sm">
            {formattedUpdate}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
