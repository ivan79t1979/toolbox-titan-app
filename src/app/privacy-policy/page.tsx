import { PageHeader } from '@/components/page-header';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Privacy Policy" />
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Last Updated: 25th September 2025
        </p>
        <p>
          At modernonlinetools.com, your privacy is important to us. This
          Privacy Policy explains what information we collect, how we use it,
          and how we protect your data when you use our free online tools.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We are committed to minimizing data collection. Depending on the tools
          you use, we may collect:
        </p>
        <ul>
          <li>
            Uploaded files or images (only temporarily, for processing; we do
            not store them permanently).
          </li>
          <li>
            Usage information such as browser type, device type, and pages
            visited (collected via analytics tools to improve our services).
          </li>
          <li>
            Optional contact information (only if you choose to reach out to us
            via email or forms).
          </li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use collected data only for:</p>
        <ul>
          <li>Providing and improving our tools and services.</li>
          <li>Ensuring proper functionality and performance.</li>
          <li>Analyzing anonymous usage trends to make our site better.</li>
        </ul>
        <p>We never sell or trade your personal information.</p>

        <h3>3. Data Storage &amp; Security</h3>
        <ul>
          <li>
            Uploaded files are processed temporarily and automatically deleted
            after use.
          </li>
          <li>
            We implement reasonable security measures to protect against
            unauthorized access, alteration, or disclosure of data.
          </li>
          <li>
            No payment or sensitive financial information is collected, as our
            tools are free.
          </li>
        </ul>

        <h3>4. Third-Party Services</h3>
        <p>
          We may use third-party analytics (such as Google Analytics) to better
          understand how visitors use our site. These services may collect
          anonymous information using cookies or similar technologies.
        </p>

        <h3>5. Cookies</h3>
        <p>Our website may use cookies to:</p>
        <ul>
          <li>Remember your preferences.</li>
          <li>Analyze traffic and usage patterns.</li>
        </ul>
        <p>You can disable cookies in your browser settings if you prefer.</p>

        <h3>6. Children’s Privacy</h3>
        <p>
          Our tools are not directed at children under 13. We do not knowingly
          collect personal information from children.
        </p>

        <h3>7. Your Rights</h3>
        <p>Depending on your location, you may have rights such as:</p>
        <ul>
          <li>Accessing or requesting deletion of your personal data.</li>
          <li>Opting out of analytics tracking.</li>
        </ul>

        <h3>8. Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with the updated date.
        </p>

        <h3>9. Contact Us</h3>
        <p>
          If you have questions about this Privacy Policy, please contact us:
          <br />
          📧 modernonlinetools.office@gmail.com
        </p>
      </div>
    </div>
  );
}
