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
import { Textarea } from '@/components/ui/textarea';
import {
  PlusCircle,
  Trash2,
  Download,
  Image as ImageIcon,
  Edit,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

type CustomField = {
  id: string;
  label: string;
  value: string;
}

type Labels = {
    invoiceTitle: string;
    billTo: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    item: string;
    quantity: string;
    rate: string;
    amount: string;
    subtotal: string;
    tax: string;
    total: string;
    notes: string;
}

export function InvoiceGenerator() {
  const [yourDetails, setYourDetails] = useState('Your Company\n123 Street\nCity, ST 12345');
  const [clientDetails, setClientDetails] = useState('Client Company\n456 Avenue\nCity, ST 67890');
  const [invoiceMeta, setInvoiceMeta] = useState({
      number: 'INV-001',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: '',
  });
  const [notes, setNotes] = useState('Thank you for your business!');
  const [taxRate, setTaxRate] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);
  
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const [labels, setLabels] = useState<Labels>({
    invoiceTitle: 'INVOICE',
    billTo: 'Bill To',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    dueDate: 'Due Date',
    item: 'Item',
    quantity: 'Quantity',
    rate: 'Rate',
    amount: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    notes: 'Notes'
  });

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

  const updateLineItem = (id: string, field: keyof Omit<LineItem, 'id'>, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const numericValue = ['quantity', 'rate'].includes(field) ? parseFloat(value) || 0 : value;
          return { ...item, [field]: numericValue };
        }
        return item;
      })
    );
  };
  
  const addCustomField = () => {
      setCustomFields([...customFields, { id: `cf-${Date.now()}`, label: 'Custom Field', value: '' }]);
  }

  const removeCustomField = (id: string) => {
      setCustomFields(customFields.filter(f => f.id !== id));
  }

  const updateCustomField = (id: string, field: 'label' | 'value', value: string) => {
      setCustomFields(customFields.map(f => f.id === id ? { ...f, [field]: value } : f));
  }

  
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

  const removeLogo = () => {
    setLogo(null);
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
        pdf.save(`invoice-${invoiceMeta.number}.pdf`);

        toast({ title: 'PDF Exported', description: 'Your invoice has been downloaded.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PDF.' });
    }
  };


  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Company & Client</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="yourDetails">Your Details</Label>
                    <Textarea id="yourDetails" value={yourDetails} onChange={e => setYourDetails(e.target.value)} rows={4}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="clientDetails">Client Details</Label>
                    <Textarea id="clientDetails" value={clientDetails} onChange={e => setClientDetails(e.target.value)} rows={4}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="logo-upload">Company Logo</Label>
                    <div className="flex items-center gap-2">
                      <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="flex-grow"/>
                      {logo && <Button variant="ghost" size="icon" onClick={removeLogo}><Trash2 className="h-4 w-4"/></Button>}
                    </div>
                 </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Invoice Meta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice #</Label>
                        <Input id="invoiceNumber" value={invoiceMeta.number} onChange={e => setInvoiceMeta({...invoiceMeta, number: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="invoiceDate">Date</Label>
                        <Input id="invoiceDate" type="date" value={invoiceMeta.date} onChange={e => setInvoiceMeta({...invoiceMeta, date: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={invoiceMeta.dueDate} onChange={e => setInvoiceMeta({...invoiceMeta, dueDate: e.target.value})} />
                </div>
                {customFields.map(field => (
                    <div key={field.id} className="flex gap-2 items-end">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                            <Input placeholder="Label" value={field.label} onChange={e => updateCustomField(field.id, 'label', e.target.value)} />
                            <Input placeholder="Value" value={field.value} onChange={e => updateCustomField(field.id, 'value', e.target.value)} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeCustomField(field.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={addCustomField}>Add Custom Field</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 {lineItems.map(item => (
                    <div key={item.id} className="p-2 border rounded-md space-y-2">
                         <div className="space-y-1">
                            <Label htmlFor={`desc-${item.id}`}>{labels.item}</Label>
                            <Textarea 
                                id={`desc-${item.id}`}
                                placeholder="Description" 
                                value={item.description}
                                onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="flex gap-2 items-end">
                           <div className="grid grid-cols-2 gap-2 flex-grow">
                                <div className="space-y-1">
                                    <Label htmlFor={`qty-${item.id}`}>{labels.quantity}</Label>
                                    <Input 
                                        id={`qty-${item.id}`}
                                        type="number" 
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={e => updateLineItem(item.id, 'quantity', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`rate-${item.id}`}>{labels.rate}</Label>
                                    <Input 
                                        id={`rate-${item.id}`}
                                        type="number" 
                                        placeholder="Rate"
                                        value={item.rate}
                                        onChange={e => updateLineItem(item.id, 'rate', e.target.value)}
                                    />
                                </div>
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                 ))}
                 <Button onClick={addLineItem} variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Item</Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Totals, Notes & Labels</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {(Object.keys(labels) as Array<keyof Labels>).map(key => (
                        <div className="space-y-1" key={key}>
                            <Label htmlFor={`label-${key}`} className="capitalize text-xs text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</Label>
                            <Input id={`label-${key}`} value={labels[key]} onChange={e => setLabels({...labels, [key]: e.target.value})} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4 sticky top-4 self-start">
        <Button onClick={exportPDF} size="lg" className="w-full">
            <Download className="mr-2 h-4 w-4"/> Download Invoice PDF
        </Button>
        <Card className="shadow-lg">
            <CardContent ref={invoiceRef} className="p-8 bg-white text-black">
                <header className="flex justify-between items-start mb-12">
                    <div>
                        {logo ? (
                          <div className="relative w-40 h-20 mb-4">
                            <Image src={logo} alt="Company Logo" width={160} height={80} style={{ objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div className="w-40 h-20 mb-4" />
                        )}
                        <div className="text-sm font-sans">
                          {yourDetails.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-bold font-headline mb-2">{labels.invoiceTitle}</h1>
                        <p>{labels.invoiceNumber} {invoiceMeta.number}</p>
                    </div>
                </header>
                <section className="flex justify-between mb-12">
                     <div>
                        <p className="text-gray-500 font-semibold">{labels.billTo}</p>
                        <div className="text-sm font-sans">
                           {clientDetails.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-gray-500 font-semibold">{labels.date}</p>
                         <p>{invoiceMeta.date ? format(parseISO(invoiceMeta.date), 'PPP') : ''}</p>
                         {invoiceMeta.dueDate && <>
                            <p className="text-gray-500 font-semibold mt-2">{labels.dueDate}</p>
                            <p>{format(parseISO(invoiceMeta.dueDate), 'PPP')}</p>
                         </>}
                         {customFields.map(field => (
                           <React.Fragment key={field.id}>
                             <p className="text-gray-500 font-semibold mt-2">{field.label}</p>
                             <p>{field.value}</p>
                           </React.Fragment>
                         ))}
                    </div>
                </section>
                <section>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{labels.item}</TableHead>
                                <TableHead className="text-center">{labels.quantity}</TableHead>
                                <TableHead className="text-center">{labels.rate}</TableHead>
                                <TableHead className="text-right">{labels.amount}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lineItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium" style={{ whiteSpace: 'pre-wrap' }}>{item.description}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-center">${item.rate.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.quantity * item.rate).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-semibold">{labels.subtotal}</TableCell>
                                <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell colSpan={3} className="text-right font-semibold">{labels.tax} ({taxRate}%)</TableCell>
                                <TableCell className="text-right">${tax.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="text-lg font-bold">
                                <TableCell colSpan={3} className="text-right">{labels.total}</TableCell>
                                <TableCell className="text-right">${total.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </section>
                 <footer className="mt-12">
                    <p className="text-gray-500 font-semibold">{labels.notes}</p>
                    <div className="text-sm font-sans">
                      {notes.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                </footer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    