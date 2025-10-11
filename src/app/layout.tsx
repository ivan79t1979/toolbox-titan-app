import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { SiteSidebar } from '@/components/site-sidebar';
import { SiteFooter } from '@/components/site-footer';
import { Menu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Modern Online Tools',
  description:
    'Free online productivity tools for creators, writers, designers and professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=Source+Code+Pro:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <SidebarProvider>
            <SiteSidebar />
            <SidebarRail />
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:justify-end sm:px-6">
                <SidebarTrigger className="sm:hidden bg-muted p-2 rounded-md">
                  <Menu className="size-6" />
                </SidebarTrigger>
                <ThemeToggle />
              </header>
              <main className="flex-1 p-4 sm:p-6">{children}</main>
              <SiteFooter />
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
