'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

function PercentageOfNumber() {
  const [percent, setPercent] = useState('15');
  const [number, setNumber] = useState('200');

  const p = parseFloat(percent);
  const n = parseFloat(number);
  const result = !isNaN(p) && !isNaN(n) ? (p / 100) * n : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="p1" className="whitespace-nowrap">What is</Label>
          <Input id="p1" type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className="w-28" />
          <span className="font-bold">%</span>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="n1">of</Label>
          <Input id="n1" type="number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-28" />
          <span className="font-bold">?</span>
        </div>
      </div>
       <Separator />
      <div className="text-center">
        <p className="text-muted-foreground">Result</p>
        <p className="text-3xl font-bold">{result.toLocaleString()}</p>
      </div>
    </div>
  );
}

function NumberIsWhatPercentOf() {
  const [num1, setNum1] = useState('30');
  const [num2, setNum2] = useState('200');

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  const result = !isNaN(n1) && !isNaN(n2) && n2 !== 0 ? (n1 / n2) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Input id="n2" type="number" value={num1} onChange={(e) => setNum1(e.target.value)} className="w-28" />
          <Label htmlFor="n3">is what percent of</Label>
        </div>
        <div className="flex items-center gap-2">
          <Input id="n3" type="number" value={num2} onChange={(e) => setNum2(e.target.value)} className="w-28" />
          <span className="font-bold">?</span>
        </div>
      </div>
      <Separator />
      <div className="text-center">
        <p className="text-muted-foreground">Result</p>
        <p className="text-3xl font-bold">{result.toFixed(2)}%</p>
      </div>
    </div>
  );
}

function PercentageChange() {
  const [from, setFrom] = useState('150');
  const [to, setTo] = useState('200');

  const f = parseFloat(from);
  const t = parseFloat(to);
  const result = !isNaN(f) && !isNaN(t) && f !== 0 ? ((t - f) / f) * 100 : 0;
  const changeType = result >= 0 ? 'increase' : 'decrease';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="from1" className="whitespace-nowrap">From</Label>
          <Input id="from1" type="number" value={from} onChange={(e) => setFrom(e.target.value)} className="w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="to1">to</Label>
          <Input id="to1" type="number" value={to} onChange={(e) => setTo(e.target.value)} className="w-28" />
          <span className="font-bold">?</span>
        </div>
      </div>
       <Separator />
      <div className="text-center">
        <p className="text-muted-foreground">Result</p>
        <p className="text-3xl font-bold">
            {Math.abs(result).toFixed(2)}% 
            <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}> {changeType}</span>
        </p>
      </div>
    </div>
  );
}

function NumberIsPercentOfWhat() {
  const [num1, setNum1] = useState('30');
  const [percent, setPercent] = useState('15');

  const n1 = parseFloat(num1);
  const p = parseFloat(percent);
  const result = !isNaN(n1) && !isNaN(p) && p !== 0 ? (n1 / p) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Input id="n4" type="number" value={num1} onChange={(e) => setNum1(e.target.value)} className="w-28" />
          <Label htmlFor="p2">is</Label>
          <Input id="p2" type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className="w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="n4">% of what?</Label>
        </div>
      </div>
       <Separator />
      <div className="text-center">
        <p className="text-muted-foreground">Result</p>
        <p className="text-3xl font-bold">{result.toLocaleString()}</p>
      </div>
    </div>
  );
}


export function PercentageCalculatorForm() {
  return (
    <Card className="max-w-xl mx-auto">
        <CardContent className="p-4">
            <Tabs defaultValue="percentOf">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    <TabsTrigger value="percentOf">X% of Y</TabsTrigger>
                    <TabsTrigger value="whatPercent">X is what % of Y</TabsTrigger>
                    <TabsTrigger value="change">% Change</TabsTrigger>
                    <TabsTrigger value="percentOfWhat">X is Y% of what</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="percentOf">
                        <CardHeader className="text-center p-2">
                            <CardTitle>What is X% of Y?</CardTitle>
                            <CardDescription>e.g., What is 15% of 200?</CardDescription>
                        </CardHeader>
                        <CardContent><PercentageOfNumber /></CardContent>
                    </TabsContent>
                    <TabsContent value="whatPercent">
                        <CardHeader className="text-center p-2">
                            <CardTitle>X is what percent of Y?</CardTitle>
                            <CardDescription>e.g., 30 is what percent of 200?</CardDescription>
                        </CardHeader>
                        <CardContent><NumberIsWhatPercentOf /></CardContent>
                    </TabsContent>
                    <TabsContent value="change">
                        <CardHeader className="text-center p-2">
                            <CardTitle>Percentage Change</CardTitle>
                            <CardDescription>e.g., from 150 to 200 is a 33.33% increase.</CardDescription>
                        </CardHeader>
                        <CardContent><PercentageChange /></CardContent>
                    </TabsContent>
                    <TabsContent value="percentOfWhat">
                        <CardHeader className="text-center p-2">
                            <CardTitle>X is Y% of what?</CardTitle>
                            <CardDescription>e.g., 30 is 15% of what?</CardDescription>
                        </CardHeader>
                        <CardContent><NumberIsPercentOfWhat /></CardContent>
                    </TabsContent>
                </div>
            </Tabs>
        </CardContent>
    </Card>
  );
}
