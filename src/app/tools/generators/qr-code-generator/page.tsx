import { PageHeader } from '@/components/page-header';
import { QrCodeGeneratorForm } from './qr-code-generator-form';
import { MeQrBanner } from '@/components/me-qr-banner';

export default function QrCodeGeneratorPage() {
  return (
    <>
      <PageHeader
        title="QR Code Generator"
        description="Generate QR codes from text or URLs."
      />
      <QrCodeGeneratorForm />
      <MeQrBanner />
    </>
  );
}
