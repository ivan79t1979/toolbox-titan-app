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
import Script from 'next/script';

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
        <link rel="stylesheet" id="silktide-consent-manager-css" href="/cookie-banner/silktide-consent-manager.css" />
        <script src="/cookie-banner/silktide-consent-manager.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              silktideCookieBannerManager.updateCookieBannerConfig({
                background: {
                  showBackground: true
                },
                cookieIcon: {
                  position: "bottomLeft"
                },
                cookieTypes: [
                  {
                    id: "necessary",
                    name: "Necessary",
                    description: "<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>",
                    required: true,
                    onAccept: function() {
                      console.log('Add logic for the required Necessary here');
                    }
                  },
                  {
                    id: "analytics",
                    name: "Analytics",
                    description: "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
                    defaultValue: true,
                    onAccept: function() {
                      // gtag('consent', 'update', { analytics_storage: 'granted' });
                    },
                    onReject: function() {
                      // gtag('consent', 'update', { analytics_storage: 'denied' });
                    }
                  },
                  {
                    id: "advertising",
                    name: "Advertising",
                    description: "<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>",
                    onAccept: function() {
                      // gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
                    },
                    onReject: function() {
                      // gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
                    }
                  }
                ],
                text: {
                  banner: {
                    description: "<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href=\\"/cookie-policy\\" target=\\"_blank\\">Cookie Policy.</a></p>",
                    acceptAllButtonText: "Accept all",
                    acceptAllButtonAccessibleLabel: "Accept all cookies",
                    rejectNonEssentialButtonText: "Reject non-essential",
                    rejectNonEssentialButtonAccessibleLabel: "Reject non-essential",
                    preferencesButtonText: "Preferences",
                    preferencesButtonAccessibleLabel: "Toggle preferences"
                  },
                  preferences: {
                    title: "Customize your cookie preferences",
                    description: "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>",
                    creditLinkText: "Get this banner for free",
                    creditLinkAccessibleLabel: "Get this banner for free"
                  }
                }
              });
            `,
          }}
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
