import { PageHeader } from '@/components/page-header';

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Cookie Policy" />
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Last Updated: 25th September 2025
        </p>
        <p>
          This Cookie Policy explains how modernonlinetools.com (“we,” “our,” or
          “us”) uses cookies and similar technologies when you visit our
          website.
        </p>

        <h3>1. What Are Cookies?</h3>
        <p>
          Cookies are small text files stored on your device (computer, tablet,
          or mobile) when you visit a website. They help websites remember your
          preferences, improve functionality, and analyze performance.
        </p>

        <h3>2. Types of Cookies We Use</h3>
        <h4>Essential Cookies</h4>
        <ul>
          <li>
            Required for basic functionality (e.g., saving your tool settings,
            enabling navigation).
          </li>
          <li>Without them, the website may not work properly.</li>
        </ul>

        <h4>Performance &amp; Analytics Cookies</h4>
        <ul>
          <li>Help us understand how visitors use the website.</li>
          <li>
            We may use third-party analytics tools (e.g., Google Analytics) to
            measure traffic and improve user experience.
          </li>
        </ul>

        <h4>Preference Cookies</h4>
        <ul>
          <li>
            Store your theme (light/dark), language, or other settings so the
            site remembers your choices.
          </li>
        </ul>

        <h4>Advertising &amp; Affiliate Cookies</h4>
        <ul>
          <li>
            May be placed if we promote third-party services (e.g., NordVPN,
            NordPass).
          </li>
          <li>They help track clicks or purchases made through affiliate links.</li>
        </ul>

        <h3>3. Third-Party Cookies</h3>
        <p>
          Some cookies are placed by third-party services integrated into our
          website (such as analytics or affiliate partners). We do not control
          these cookies, and their use is governed by the third party’s privacy
          policies.
        </p>

        <h3>4. Managing Cookies</h3>
        <p>You can:</p>
        <ul>
          <li>Accept or reject cookies using your browser settings.</li>
          <li>Delete cookies from your device at any time.</li>
        </ul>
        <p>Note: Disabling cookies may limit some features of our website.</p>

        <h3>5. Changes to This Policy</h3>
        <p>
          We may update this Cookie Policy from time to time. Any changes will
          be posted here with a revised “Last Updated” date.
        </p>

        <h3>6. Contact Us</h3>
        <p>
          If you have questions about this Cookie Policy, please contact us:
          <br />
          📧 modernonlinetools.office@gmail.com
        </p>
      </div>
    </div>
  );
}
