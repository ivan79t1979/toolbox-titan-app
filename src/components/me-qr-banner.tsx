'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function MeQrBanner() {
  return (
    <Card className="mt-12 overflow-hidden border-2 border-primary/50 shadow-lg transition-all hover:shadow-xl">
      <CardContent className="p-6 text-center">
        <div className="mx-auto max-w-md">
          <Image
            src="https://me-qr.com/static/pages/logo/logo.svg"
            alt="ME-QR Logo"
            width={120}
            height={40}
            className="mx-auto mb-4"
          />
          <h3 className="font-headline text-2xl font-bold">
            Need More from Your QR Codes?
          </h3>
          <p className="mt-2 text-muted-foreground">
            With{' '}
            <Link
              href="https://bit.ly/41JZtbm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              me-qr.com
            </Link>
            , you can turn a simple QR code into a powerful tool. Choose from
            hundreds of designs, embed your logo, track scans, and even change
            content on the fly—no coding required.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <Link
                href="https://bit.ly/41JZtbm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try ME-QR Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
