'use client';

import { useState, useMemo, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
  PlusCircle,
  Edit,
  Trash2,
  Download,
  Upload,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
};

const defaultTransactions: Transaction[] = [
  { id: '1', type: 'income', description: 'Monthly Salary', amount: 4500, date: format(new Date(), 'yyyy-MM-dd'), category: 'Salary' },
  { id: '2', type: 'expense', description: 'Rent', amount: 1200, date: format(new Date(), 'yyyy-MM-dd'), category: 'Housing' },
  { id: '3', type: 'expense', description: 'Groceries', amount: 350, date: format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), category: 'Food' },
  { id: '4', type: 'expense', description: 'Internet Bill', amount: 60, date: format(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), category: 'Utilities' },
  { id: '5', type: 'income', description: 'Freelance Project', amount: 750, date: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), category: 'Freelance' },
];

const categoryColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#00C49F',
    '#FFBB28',
];


function TransactionForm({ onSave, transaction }: { onSave: (data: Omit<Transaction, 'id'> & { id?: string }) => void; transaction?: Transaction }) {
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount || '');
  const [date, setDate] = useState(transaction?.date || format(new Date(), 'yyyy-MM-dd'));
  const [category, setCategory] = useState(transaction?.category || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !category) {
        toast({
            variant: 'destructive',
            title: 'Missing information',
            description: 'Please fill out all fields.',
        });
      return;
    }
    onSave({
      id: transaction?.id,
      type,
      description,
      amount: parseFloat(String(amount)),
      date,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v: TransactionType) => setType(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Coffee" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 5.50" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Food, Salary" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="submit">Save Transaction</Button></DialogClose>
      </DialogFooter>
    </form>
  );
}


export function BudgetPlanner() {
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  
  const printableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { totalIncome, totalExpenses, balance, expenseByCategory } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            if (!acc[t.category]) {
                acc[t.category] = 0;
            }
            acc[t.category] += t.amount;
            return acc;
        }, {} as Record<string, number>);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      expenseByCategory: Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))
    };
  }, [transactions]);
  
  const handleSaveTransaction = (data: Omit<Transaction, 'id'> & { id?: string }) => {
    setTransactions(prev => {
        if(data.id) { // Editing existing
            return prev.map(t => t.id === data.id ? {...t, ...data} : t);
        } else { // Adding new
            const newTransaction = { ...data, id: `txn-${Date.now()}`};
            return [...prev, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    });
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };
  
  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  const openNewDialog = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  }
  
  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  // --- Import / Export Logic ---
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
          const workbook = fileType === 'xlsx'
              ? XLSX.read(data, { type: 'array' })
              : XLSX.read(data, { type: 'string' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          newTransactions = XLSX.utils.sheet_to_json<Transaction>(sheet);
        }

        if (!Array.isArray(newTransactions)) throw new Error('Invalid file structure.');
        setTransactions(newTransactions);
        toast({ title: 'Import Successful', description: `${file.name} was imported.` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    if (fileType === 'xlsx') reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();
  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => downloadFile('budget-planner.json', JSON.stringify(transactions, null, 2), 'application/json');
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile('budget-planner.csv', csv, 'text/csv');
  };
  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, 'budget-planner.xlsx');
  };

  const exportPNG = async () => {
    if (!printableRef.current) return;
    try {
      const canvas = await html2canvas(printableRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'budget-planner.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
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
      <div className="flex justify-end gap-2 no-print">
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>Import from</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={triggerFileUpload}><FileJson className="mr-2 h-4 w-4" /> JSON / CSV / XLSX</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>Export as</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportJSON}><FileJson className="mr-2 h-4 w-4" /> JSON</DropdownMenuItem>
            <DropdownMenuItem onClick={exportCSV}><FileText className="mr-2 h-4 w-4" /> CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportXLSX}><FileSpreadsheet className="mr-2 h-4 w-4" /> XLSX</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPNG}><ImageIcon className="mr-2 h-4 w-4" /> PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}><Printer className="mr-2 h-4 w-4" /> PDF</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".json,.csv,.xlsx" />
      </div>

      <div ref={printableRef} className="printable-area space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Income</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Expenses</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Balance</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className={cn("text-2xl font-bold", balance >= 0 ? "text-foreground" : "text-red-600")}>${balance.toFixed(2)}</div></CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>Your recent income and expenses.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" onClick={openNewDialog} className="no-print"><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
                                </DialogHeader>
                                <TransactionForm onSave={handleSaveTransaction} transaction={editingTransaction} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                    <Table>
                        <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="no-print"></TableHead></TableRow></TableHeader>
                        <TableBody>
                        {transactions.length > 0 ? transactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="font-medium">{t.description}</TableCell>
                                <TableCell>{format(parseISO(t.date), 'MMM d, yyyy')}</TableCell>
                                <TableCell>{t.category}</TableCell>
                                <TableCell className={cn("text-right", t.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right no-print">
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(t)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="h-24 text-center">No transactions yet.</TableCell></TableRow>
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {expenseByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
