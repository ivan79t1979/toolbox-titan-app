'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter
} from '@/components/ui/table';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
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
  Edit,
  TrendingUp,
  TrendingDown,
  Wallet,
  MoreVertical,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
};

const defaultTransactions: Transaction[] = [
    { id: '1', type: 'income', description: 'Monthly Salary', amount: 4000, category: 'Salary' },
    { id: '2', type: 'expense', description: 'Rent', amount: 1200, category: 'Housing' },
    { id: '3', type: 'expense', description: 'Groceries', amount: 350, category: 'Food' },
    { id: '4', type: 'expense', description: 'Internet Bill', amount: 60, category: 'Utilities' },
];

const expenseCategories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];


function TransactionForm({
  onSave,
  transaction,
  type,
}: {
  onSave: (data: Omit<Transaction, 'id'> & { id?: string }) => void;
  transaction?: Transaction;
  type: TransactionType;
}) {
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [category, setCategory] = useState(transaction?.category || (type === 'income' ? incomeCategories[0] : expenseCategories[0]));
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide a description and a valid amount.',
      });
      return;
    }
    onSave({
      id: transaction?.id,
      type,
      description,
      amount,
      category,
    });
  };

  return (
     <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Coffee" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} min="0.01" step="0.01" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
             <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="submit">Save</Button></DialogClose>
      </DialogFooter>
    </form>
  )
}

export function BudgetPlanner() {
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [currency, setCurrency] = useState('$');

  const printableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { totalIncome, totalExpenses, balance, expenseByCategory } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const byCategory: { [key: string]: number } = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      expenseByCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value }))
    };
  }, [transactions]);
  
  const handleSaveTransaction = (data: Omit<Transaction, 'id'> & { id?: string }) => {
    setTransactions(prev => {
      if (data.id) {
        return prev.map(t => (t.id === data.id ? { ...t, ...data } : t));
      }
      return [...prev, { ...data, id: `tx-${Date.now()}` }];
    });
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };
  
  const openForm = (type: TransactionType, transaction?: Transaction) => {
    setFormType(type);
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  const exportFile = useCallback((filename: string, content: string | ArrayBuffer, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, filename);
  }, []);

  const exportJSON = useCallback(() => {
    exportFile('budget-data.json', JSON.stringify(transactions, null, 2), 'application/json');
  }, [transactions, exportFile]);

  const exportCSV = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    exportFile('budget-data.csv', csv, 'text/csv');
  }, [transactions, exportFile]);

  const exportXLSX = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');
    XLSX.writeFile(workbook, 'budget-data.xlsx');
  }, [transactions]);

  const exportPNG = async () => {
    if (!printableRef.current) return;
    try {
      const canvas = await html2canvas(printableRef.current, { scale: 2 });
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, 'budget-summary.png');
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
    }
  };

  const exportPDF = async () => {
    if (!printableRef.current) return;
    try {
      const canvas = await html2canvas(printableRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('budget-summary.pdf');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PDF.' });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File could not be read.');
        let newTransactions: Transaction[];
        if (fileType === 'json') {
          newTransactions = JSON.parse(data as string);
        } else {
            const workbook = fileType === 'xlsx' ? XLSX.read(data, { type: 'array' }) : XLSX.read(data, { type: 'string' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            newTransactions = XLSX.utils.sheet_to_json<Transaction>(sheet);
        }
        if (!Array.isArray(newTransactions)) throw new Error("Invalid file structure.");
        setTransactions(newTransactions);
        toast({ title: 'Import Successful' });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    if (fileType === 'xlsx') reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  };
  
  const triggerFileUpload = () => fileInputRef.current?.click();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.replace(/[^a-zA-Z]/g, '') || 'USD' }).format(amount).replace(/^[A-Z]{3}/, currency);
  }

  return (
    <div className="space-y-6">
       <style>{`
        @media print { .no-print { display: none !important; } }
        .recharts-legend-item { padding-left: 5px !important; }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingTransaction ? 'Edit' : 'Add'} {formType === 'income' ? 'Income' : 'Expense'}</DialogTitle>
                </DialogHeader>
                <TransactionForm type={formType} transaction={editingTransaction} onSave={handleSaveTransaction} />
            </DialogContent>
        </Dialog>
        <div className="flex gap-2">
            <Button onClick={() => openForm('income')} className="bg-green-600 hover:bg-green-700"><PlusCircle className="mr-2 h-4 w-4" /> Add Income</Button>
            <Button onClick={() => openForm('expense')} className="bg-red-600 hover:bg-red-700"><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={triggerFileUpload}><FileJson className="mr-2 h-4 w-4" /> JSON / CSV / XLSX</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportJSON}><FileJson className="mr-2 h-4 w-4" /> JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={exportCSV}><FileText className="mr-2 h-4 w-4" /> CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportXLSX}><FileSpreadsheet className="mr-2 h-4 w-4" /> XLSX</DropdownMenuItem>
              <DropdownMenuItem onClick={exportPNG}><ImageIcon className="mr-2 h-4 w-4" /> PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF}><Printer className="mr-2 h-4 w-4" /> PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".json,.csv,.xlsx" />
        </div>
      </div>
      <div ref={printableRef} className="bg-background p-4 rounded-lg">
        <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="bg-green-500/10 border-green-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
                </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
            <CardContent>
                <div className="max-h-96 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-10 no-print"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length > 0 ? transactions.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.description}</TableCell>
                                    <TableCell>{t.category}</TableCell>
                                    <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </TableCell>
                                    <TableCell className="no-print">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem onClick={() => openForm(t.type, t)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={4} className="h-24 text-center">No transactions yet.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>A visual representation of your spending.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ChartContainer config={{}} className="min-h-0 w-full h-full">
                  <PieChart>
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                      {expenseByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Pie>
                    <Legend/>
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="no-print">
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="currency-select">Currency Symbol</Label>
            <Input id="currency-select" value={currency} onChange={e => setCurrency(e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
