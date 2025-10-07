'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PlusCircle,
  Trash2,
  Download,
  Upload,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

type Option = {
  id: string;
  name: string;
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Score = {
  optionId: string;
  criterionId: string;
  value: number;
};

type MatrixData = {
    options: Option[];
    criteria: Criterion[];
    scores: Score[];
}

export function DecisionMatrixTool() {
  const [options, setOptions] = useState<Option[]>([
    { id: 'opt1', name: 'Option A' },
    { id: 'opt2', name: 'Option B' },
  ]);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 'crit1', name: 'Cost', weight: 5 },
    { id: 'crit2', name: 'Features', weight: 4 },
  ]);
  const [scores, setScores] = useState<Score[]>([
    { optionId: 'opt1', criterionId: 'crit1', value: 3 },
    { optionId: 'opt1', criterionId: 'crit2', value: 4 },
    { optionId: 'opt2', criterionId: 'crit1', value: 5 },
    { optionId: 'opt2', criterionId: 'crit2', value: 2 },
  ]);

  const { toast } = useToast();
  const tableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => {
    const totalsMap = new Map<string, number>();
    options.forEach(opt => {
        let total = 0;
        criteria.forEach(crit => {
            const score = scores.find(s => s.optionId === opt.id && s.criterionId === crit.id)?.value || 0;
            total += score * crit.weight;
        });
        totalsMap.set(opt.id, total);
    });
    return totalsMap;
  }, [options, criteria, scores]);

  const bestOptionId = useMemo(() => {
    let maxScore = -Infinity;
    let bestId = '';
    for (const [optionId, total] of totals.entries()) {
        if(total > maxScore) {
            maxScore = total;
            bestId = optionId;
        }
    }
    return bestId;
  }, [totals]);

  const addOption = () => {
    const newId = `opt${Date.now()}`;
    setOptions([...options, { id: newId, name: `Option ${options.length + 1}` }]);
    // Initialize scores for the new option
    const newScores = criteria.map(c => ({ optionId: newId, criterionId: c.id, value: 0}));
    setScores([...scores, ...newScores]);
  };

  const addCriterion = () => {
    const newId = `crit${Date.now()}`;
    setCriteria([...criteria, { id: newId, name: `Criterion ${criteria.length + 1}`, weight: 1 }]);
    // Initialize scores for the new criterion
    const newScores = options.map(o => ({ optionId: o.id, criterionId: newId, value: 0}));
    setScores([...scores, ...newScores]);
  };

  const updateOptionName = (id: string, name: string) => {
    setOptions(options.map(o => (o.id === id ? { ...o, name } : o)));
  };

  const updateCriterionName = (id: string, name: string) => {
    setCriteria(criteria.map(c => (c.id === id ? { ...c, name } : c)));
  };
  
  const updateCriterionWeight = (id: string, weight: number) => {
    setCriteria(criteria.map(c => (c.id === id ? { ...c, weight } : c)));
  };
  
  const updateScore = (optionId: string, criterionId: string, value: number) => {
    const scoreIndex = scores.findIndex(s => s.optionId === optionId && s.criterionId === criterionId);
    const newScores = [...scores];
    if(scoreIndex > -1) {
        newScores[scoreIndex] = { ...newScores[scoreIndex], value };
    } else {
        newScores.push({ optionId, criterionId, value });
    }
    setScores(newScores);
  };
  
  const removeOption = (id: string) => {
    if (options.length <= 1) {
      toast({variant: 'destructive', title: "Cannot remove last option."});
      return;
    }
    setOptions(options.filter(o => o.id !== id));
    setScores(scores.filter(s => s.optionId !== id));
  }

  const removeCriterion = (id: string) => {
    if (criteria.length <= 1) {
      toast({variant: 'destructive', title: "Cannot remove last criterion."});
      return;
    }
    setCriteria(criteria.filter(c => c.id !== id));
    setScores(scores.filter(s => s.criterionId !== id));
  }
  
  // --- Import/Export ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File could not be read.');
        const matrixData: MatrixData = JSON.parse(data as string);

        if (!matrixData.options || !matrixData.criteria || !matrixData.scores) {
          throw new Error('Invalid JSON structure for decision matrix.');
        }

        setOptions(matrixData.options);
        setCriteria(matrixData.criteria);
        setScores(matrixData.scores);
        toast({ title: 'Import Successful' });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const exportJSON = () => {
    const data = JSON.stringify({ options, criteria, scores }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decision-matrix.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const exportPNG = async () => {
    if (!tableRef.current) return;
    try {
      const canvas = await html2canvas(tableRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = 'decision-matrix.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed' });
    }
  };

  const exportPDF = () => window.print();

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex gap-2">
            <Button onClick={addCriterion}><PlusCircle className="mr-2 h-4 w-4" /> Add Criterion</Button>
            <Button onClick={addOption}><PlusCircle className="mr-2 h-4 w-4" /> Add Option</Button>
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Import from</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={triggerFileUpload}><FileJson className="mr-2 h-4 w-4" /> JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportJSON}><FileJson className="mr-2 h-4 w-4" /> JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPNG}><ImageIcon className="mr-2 h-4 w-4" /> PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}><Printer className="mr-2 h-4 w-4" /> PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".json" />
        </div>
      </div>
      
      <Card className="printable-area" ref={tableRef}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Criterion</TableHead>
                  <TableHead className="text-center">Weight</TableHead>
                  {options.map(opt => (
                    <TableHead key={opt.id} className={cn("text-center min-w-[150px]", opt.id === bestOptionId && "bg-primary/10")}>
                        <div className="flex items-center justify-center gap-2">
                            <Input
                                value={opt.name}
                                onChange={e => updateOptionName(opt.id, e.target.value)}
                                className="font-bold text-center border-none p-1 h-auto"
                            />
                            <Button variant="ghost" size="icon" className="h-6 w-6 no-print" onClick={() => removeOption(opt.id)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map(crit => (
                  <TableRow key={crit.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                            value={crit.name}
                            onChange={e => updateCriterionName(crit.id, e.target.value)}
                            className="font-semibold border-none p-1 h-auto"
                        />
                        <Button variant="ghost" size="icon" className="h-6 w-6 no-print" onClick={() => removeCriterion(crit.id)}><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={crit.weight}
                        onChange={e => updateCriterionWeight(crit.id, parseInt(e.target.value, 10) || 0)}
                        className="w-20 text-center mx-auto"
                      />
                    </TableCell>
                    {options.map(opt => (
                      <TableCell key={opt.id} className={cn(opt.id === bestOptionId && "bg-primary/5")}>
                        <Input
                          type="number"
                          value={scores.find(s => s.optionId === opt.id && s.criterionId === crit.id)?.value || 0}
                          onChange={e => updateScore(opt.id, crit.id, parseInt(e.target.value, 10) || 0)}
                          className="w-20 text-center mx-auto"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total Score</TableCell>
                    <TableCell></TableCell>
                    {options.map(opt => (
                        <TableCell key={opt.id} className={cn("text-center text-lg", opt.id === bestOptionId && "bg-primary/10 text-primary")}>
                            <div className="flex items-center justify-center gap-2">
                                {totals.get(opt.id)}
                                {opt.id === bestOptionId && <Star className="h-5 w-5" />}
                            </div>
                        </TableCell>
                    ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {bestOptionId && (
        <Card className="max-w-md mx-auto no-print">
            <CardHeader>
                <CardTitle className="text-center">Recommended Choice</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-2xl font-bold text-primary">{options.find(o => o.id === bestOptionId)?.name}</p>
                <p className="text-muted-foreground">with a score of {totals.get(bestOptionId)}</p>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
