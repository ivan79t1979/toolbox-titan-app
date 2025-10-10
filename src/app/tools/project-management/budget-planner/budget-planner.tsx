'use client';

import * as React from 'react';
import { useState, useMemo, useRef } from 'react';
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
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
};

type BudgetData = {
    transactions: Transaction[];
    currency: string;
}

export function BudgetPlanner() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', description: 'Salary', amount: 3500, date: new Date().toISOString().split('T')[0] },
    { id: '2', type: 'expense', description: 'Rent', amount: 1200, date: new Date().toISOString().split('T')[0] },
    { id: '3', type: 'expense', description: 'Groceries', amount: 450, date: new Date().toISOString().split('T')[0] },
  ]);
  const [currency, setCurrency] = useState('$');
  const [newTransaction, setNewTransaction] = useState({ type: 'expense' as 'income' | 'expense', description: '', amount: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const chartData = useMemo(() => [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
    { name: 'Balance', value: balance },
  ], [totalIncome, totalExpenses, balance]);

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast({ variant: 'destructive', title: 'Please fill out all fields.' });
      return;
    }
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: newTransaction.type,
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTx, ...transactions]);
    setNewTransaction({ type: 'expense', description: '', amount: '' });
  };

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File could not be read.');
        const budgetData: BudgetData = JSON.parse(data as string);
        if (!budgetData.transactions || !budgetData.currency) {
          throw new Error('Invalid JSON structure for budget data.');
        }
        setTransactions(budgetData.transactions);
        setCurrency(budgetData.currency);
        toast({ title: 'Import Successful' });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
      } finally {
        if(fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };
  
  const triggerFileUpload = () => fileInputRef.current?.click();

  const exportJSON = () => {
      const dataToSave: BudgetData = { transactions, currency };
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
      saveAs(blob, 'budget-planner.json');
  };

  const exportCSV = () => {
      const worksheet = XLSX.utils.json_to_sheet(transactions);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'budget-planner.csv');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}{totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}{balance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${currency}${value}`}/>
              <Tooltip formatter={(value: number) => `${currency}${value.toFixed(2)}`} cursor={{fill: 'hsl(var(--muted))'}}/>
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="tx-type">Type</Label>
                    <Select value={newTransaction.type} onValueChange={(v: 'income' | 'expense') => setNewTransaction(p => ({...p, type: v}))}>
                        <SelectTrigger id="tx-type"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="tx-desc">Description</Label>
                    <Input id="tx-desc" value={newTransaction.description} onChange={e => setNewTransaction(p => ({...p, description: e.target.value}))} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="tx-amount">Amount</Label>
                    <Input id="tx-amount" type="number" value={newTransaction.amount} onChange={e => setNewTransaction(p => ({...p, amount: e.target.value}))} />
                 </div>
            </div>
            <Button onClick={addTransaction}><PlusCircle className="mr-2 h-4 w-4"/> Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                      Your recent income and expenses.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-24">
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="$">USD</SelectItem>
                                <SelectItem value="€">EUR</SelectItem>
                                <SelectItem value="£">GBP</SelectItem>
                                <SelectItem value="¥">JPY</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={exportJSON}><FileJson className="mr-2 h-4 w-4" /> JSON</DropdownMenuItem>
                            <DropdownMenuItem onClick={exportCSV}><FileText className="mr-2 h-4 w-4" /> CSV</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <Button variant="outline" onClick={triggerFileUpload}><Upload className="mr-2 h-4 w-4" /> Import</Button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".json" />
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <span className={tx.type === 'income' ? 'text-green-500' : 'text-red-500'}>{tx.type}</span>
                  </TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell className="text-right">{currency}{tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeTransaction(tx.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
