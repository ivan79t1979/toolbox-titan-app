'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function NordPassBanner() {
  return (
    <Card className="mt-12 overflow-hidden border-2 border-primary/50 shadow-lg transition-all hover:shadow-xl">
      <CardContent className="p-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h3 className="font-headline text-2xl font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Keep Your Passwords Safe with NordPass
          </h3>
          <p className="mt-4 text-muted-foreground">
            You’ve generated a strong password — now make sure you don’t lose it. With <b>NordPass</b>, you can store all your logins safely, sync them across devices, and access them anywhere.
          </p>
           <p className="mt-4 text-muted-foreground">
            Strong passwords are only the first step. The next is keeping them safe. <b>NordPass</b> is a password manager trusted worldwide to protect your digital life.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <Link
                href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=131543&url_id=9356"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try NordPass Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
