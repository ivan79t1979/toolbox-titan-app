import { PageHeader } from '@/components/page-header';
import { PasswordGeneratorForm } from './password-generator-form';
import { NordPassBanner } from '@/components/nordpass-banner';
import { NordVPNBanner } from '@/components/nordvpn-banner';

export default function PasswordGeneratorPage() {
  return (
    <>
      <PageHeader
        title="Password Generator"
        description="Generate secure passwords."
      />
      <PasswordGeneratorForm />
      <NordPassBanner />
      <NordVPNBanner />
    </>
  );
}
