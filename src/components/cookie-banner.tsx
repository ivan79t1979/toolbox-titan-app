'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    silktideCookieBannerManager?: {
      updateCookieBannerConfig: (config: any) => void;
    };
  }
}

export function CookieBanner() {
  useEffect(() => {
    if (window.silktideCookieBannerManager) {
      window.silktideCookieBannerManager.updateCookieBannerConfig({
        background: {
          showBackground: true,
        },
        cookieIcon: {
          position: 'bottomLeft',
        },
        cookieTypes: [
          {
            id: 'necessary',
            name: 'Necessary',
            description:
              '<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>',
            required: true,
            onAccept: function () {
              console.log('Add logic for the required Necessary here');
            },
          },
          {
            id: 'analytics',
            name: 'Analytics',
            description:
              '<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>',
            defaultValue: true,
            onAccept: function () {
              // Your analytics logic here, e.g., gtag('consent', 'update', { analytics_storage: 'granted' });
            },
            onReject: function () {
              // Your analytics rejection logic here, e.g., gtag('consent', 'update', { analytics_storage: 'denied' });
            },
          },
          {
            id: 'advertising',
            name: 'Advertising',
            description:
              '<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>',
            onAccept: function () {
              // Your advertising logic here
            },
            onReject: function () {
              // Your advertising rejection logic here
            },
          },
        ],
        text: {
          banner: {
            description:
              '<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href="/cookie-policy" target="_blank">Cookie Policy.</a></p>',
            acceptAllButtonText: 'Accept all',
            acceptAllButtonAccessibleLabel: 'Accept all cookies',
            rejectNonEssentialButtonText: 'Reject non-essential',
            rejectNonEssentialButtonAccessibleLabel: 'Reject non-essential',
            preferencesButtonText: 'Preferences',
            preferencesButtonAccessibleLabel: 'Toggle preferences',
          },
          preferences: {
            title: 'Customize your cookie preferences',
            description:
              '<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>',
            creditLinkText: 'Get this banner for free',
            creditLinkAccessibleLabel: 'Get this banner for free',
          },
        },
      });
    }
  }, []);

  return null;
}
