'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  PlusCircle,
  Trash2,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export function InvoiceGenerator() {
  const [yourDetails, setYourDetails] = useState('Your Company\n123 Street\nCity, ST 12345');
  const [clientDetails, setClientDetails] = useState('Client Company\n456 Avenue\nCity, ST 67890');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('Thank you for your business!');
  const [taxRate, setTaxRate] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: `item-${Date.now()}`, description: 'Website Design', quantity: 1, rate: 2500 },
  ]);

  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  }, [lineItems]);

  const tax = useMemo(() => {
    return subtotal * (taxRate / 100);
  }, [subtotal, taxRate]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) {
        toast({ variant: 'destructive', title: 'Cannot remove last item.' });
        return;
    }
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setLogo(reader.result as string);
          }
          reader.readAsDataURL(file);
      }
  }

  const exportPDF = async () => {
    if (!invoiceRef.current) return;
    try {
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`invoice-${invoiceNumber}.pdf`);

        toast({ title: 'PDF Exported', description: 'Your invoice has been downloaded.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PDF.' });
    }
  };


  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="yourDetails">Your Details</Label>
                    <Textarea id="yourDetails" value={yourDetails} onChange={e => setYourDetails(e.target.value)} rows={4}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="clientDetails">Client Details</Label>
                    <Textarea id="clientDetails" value={clientDetails} onChange={e => setClientDetails(e.target.value)} rows={4}/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice #</Label>
                        <Input id="invoiceNumber" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="invoiceDate">Date</Label>
                        <Input id="invoiceDate" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 {lineItems.map(item => (
                    <div key={item.id} className="flex gap-2 items-end">
                        <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 60px 100px'}}>
                            <Input 
                                placeholder="Description" 
                                value={item.description}
                                onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                            />
                            <Input 
                                type="number" 
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={e => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                            <Input 
                                type="number" 
                                placeholder="Rate"
                                value={item.rate}
                                onChange={e => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                 ))}
                 <Button onClick={addLineItem} variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Item</Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Totals & Notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Button onClick={exportPDF} size="lg" className="w-full">
            <Download className="mr-2 h-4 w-4"/> Download Invoice PDF
        </Button>
        <Card className="shadow-lg">
            <CardContent ref={invoiceRef} className="p-8">
                <header className="flex justify-between items-start mb-12">
                    <div>
                        <div className="relative w-40 h-20 mb-4">
                            {logo ? (
                                <Image src={logo} alt="Company Logo" layout="fill" objectFit="contain" />
                            ) : (
                                <div className="bg-muted h-full w-full flex items-center justify-center rounded-md">
                                    <span className="text-sm text-muted-foreground">Your Logo</span>
                                </div>
                            )}
                        </div>
                        <Button asChild variant="outline" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <label htmlFor="logo-upload">
                                <ImageIcon className="mr-2 h-4 w-4" /> Change Logo
                                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                            </label>
                        </Button>
                        <pre className="text-sm font-sans">{yourDetails}</pre>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-bold font-headline mb-2">INVOICE</h1>
                        <p># {invoiceNumber}</p>
                    </div>
                </header>
                <section className="flex justify-between mb-12">
                     <div>
                        <p className="text-muted-foreground font-semibold">Bill To</p>
                        <pre className="text-sm font-sans">{clientDetails}</pre>
                    </div>
                    <div className="text-right">
                         <p className="text-muted-foreground font-semibold">Date</p>
                         <p>{invoiceDate}</p>
                         <p className="text-muted-foreground font-semibold mt-2">Due Date</p>
                         <p>{dueDate}</p>
                    </div>
                </section>
                <section>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-center">Rate</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lineItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.description}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-center">${item.rate.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.quantity * item.rate).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-semibold">Subtotal</TableCell>
                                <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell colSpan={3} className="text-right font-semibold">Tax ({taxRate}%)</TableCell>
                                <TableCell className="text-right">${tax.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="text-lg font-bold">
                                <TableCell colSpan={3} className="text-right">Total</TableCell>
                                <TableCell className="text-right">${total.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </section>
                 <footer className="mt-12">
                    <p className="text-muted-foreground font-semibold">Notes</p>
                    <pre className="text-sm font-sans">{notes}</pre>
                </footer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
