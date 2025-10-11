'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function NordVPNBanner() {
  return (
    <Card className="mt-8 overflow-hidden border-2 border-primary/50 shadow-lg transition-all hover:shadow-xl">
      <CardContent className="p-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h3 className="font-headline text-2xl font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Stay Safe Online with NordVPN
          </h3>
          <p className="mt-4 text-muted-foreground">
            Your password may be strong, but without VPN protection your online
            activity is still visible. Combine your security tools with{' '}
            <b>NordVPN</b> for full protection against hackers, ISP tracking,
            and data leaks.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <Link
                href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=131543&url_id=902"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get NordVPN Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
