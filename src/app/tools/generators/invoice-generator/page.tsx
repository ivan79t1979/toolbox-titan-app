'use client';

import { PageHeader } from '@/components/page-header';
import { InvoiceGenerator } from './invoice-generator';
import { useEffect, useState } from 'react';

export default function InvoiceGeneratorPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <PageHeader
        title="Invoice Generator"
        description="Create, customize, and download professional invoices with ease."
      />
      {isClient ? <InvoiceGenerator /> : <div>Loading...</div>}
    </>
  );
}
