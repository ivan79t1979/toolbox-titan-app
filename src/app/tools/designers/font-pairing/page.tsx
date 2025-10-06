import { PageHeader } from '@/components/page-header';
import { FontPairingTool } from './font-pairing-tool';

export default function FontPairingPage() {
  return (
    <>
      <PageHeader
        title="AI Font Pairing"
        description="Discover beautiful font pairings from Google Fonts, suggested by AI."
      />
      <FontPairingTool />
    </>
  );
}
