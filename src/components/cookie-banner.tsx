'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    silktideCookieBannerManager?: {
      updateCookieBannerConfig: (config: any) => void;
      initCookieBanner: () => void;
    };
  }
}

export function CookieBanner() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already on the page
    if (document.getElementById('silktide-consent-manager-js')) {
      if (window.silktideCookieBannerManager) {
        setScriptLoaded(true);
      }
      return;
    }

    // If not, create and append it
    const script = document.createElement('script');
    script.id = 'silktide-consent-manager-js';
    script.src = '/cookie-banner/silktide-consent-manager.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Silktide consent manager script failed to load.');
    };
    document.body.appendChild(script);

    // Cleanup function to remove script if component unmounts
    return () => {
      const existingScript = document.getElementById('silktide-consent-manager-js');
      if (existingScript) {
        // It might already be gone if navigating away quickly
        // document.body.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.silktideCookieBannerManager) {
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
      // The script might initialize itself, but calling init ensures it runs with the new config.
      if (window.silktideCookieBannerManager.initCookieBanner) {
        window.silktideCookieBannerManager.initCookieBanner();
      }
    }
  }, [scriptLoaded]);

  return null;
}
