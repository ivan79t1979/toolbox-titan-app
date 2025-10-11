'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function ElevenLabsBanner() {
  return (
    <Card className="mt-12 overflow-hidden border-2 border-primary/50 shadow-lg transition-all hover:shadow-xl">
      <CardContent className="p-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h3 className="font-headline text-2xl font-bold">
            Don't just generate speech. Generate emotions.
          </h3>
          <p className="mt-4 text-muted-foreground">
            ElevenLabs offers the most realistic AI voices on the market. Bring
            your stories and videos to life with high-quality, natural-sounding
            narration for your videos, podcasts, and audiobooks instantly.
          </p>
          <p className="mt-4 text-muted-foreground">
            Click the button and try{' '}
            <Link
              href="https://try.elevenlabs.io/jlisyba71rsg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              ElevenLabs
            </Link>{' '}
            today for free to make your content sound professional in seconds.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <Link
                href="https://try.elevenlabs.io/jlisyba71rsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try ElevenLabs Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
