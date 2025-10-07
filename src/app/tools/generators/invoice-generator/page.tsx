import { PageHeader } from '@/components/page-header';
import { InvoiceGenerator } from './invoice-generator';

export default function InvoiceGeneratorPage() {
  return (
    <>
      <PageHeader
        title="Invoice Generator"
        description="Create, customize, and download professional invoices with ease."
      />
      <InvoiceGenerator />
    </>
  );
}
