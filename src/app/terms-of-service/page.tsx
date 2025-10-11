import { PageHeader } from '@/components/page-header';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Terms of Service" />
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Last Updated: 25th September 2025
        </p>
        <p>
          Welcome to modernonlinetools.com. By using our website and tools, you
          agree to the following terms and conditions. Please read them
          carefully.
        </p>

        <h3>1. Use of Our Tools</h3>
        <ul>
          <li>
            Our tools are provided free of charge and are intended for personal,
            non-commercial and commercial use, unless otherwise agreed.
          </li>
          <li>
            You may not misuse the services (e.g., using them to harm others,
            violate laws, or distribute harmful content).
          </li>
          <li>
            We reserve the right to suspend or limit access if misuse is
            detected.
          </li>
        </ul>

        <h3>2. Uploaded Content</h3>
        <ul>
          <li>
            Any files or images you upload are used solely for processing within
            the tool.
          </li>
          <li>
            Uploaded content is not stored permanently and is deleted
            automatically after processing.
          </li>
          <li>
            You are responsible for ensuring that your uploads do not violate
            copyright or contain illegal material.
          </li>
        </ul>

        <h3>3. Intellectual Property</h3>
        <ul>
          <li>
            All tools, designs, and code on this site are the property of
            modernonlinetools.com. or property of third-party sites or
            third-party services, providing the tools.
          </li>
          <li>
            You may not copy, redistribute, or modify our services without
            permission.
          </li>
        </ul>

        <h3>4. Disclaimer of Warranties</h3>
        <ul>
          <li>
            Our tools are provided “as is” and “as available”, without
            warranties of any kind.
          </li>
          <li>
            We do not guarantee uninterrupted service, error-free results, or
            100% accuracy.
          </li>
          <li>You use the site and tools at your own risk.</li>
        </ul>

        <h3>5. Limitation of Liability</h3>
        <ul>
          <li>
            modernonlinetools.com is not responsible for any damages, losses,
            or issues that may result from using our services.
          </li>
          <li>
            This includes, but is not limited to, data loss, downtime, or
            incorrect results.
          </li>
        </ul>

        <h3>6. Third-Party Links &amp; Services</h3>
        <ul>
          <li>
            Our website may contain links to third-party sites and tools or use
            third-party services (e.g., analytics).
          </li>
          <li>
            We are not responsible for the content or policies of those
            external websites.
          </li>
        </ul>

        <h3>7. Changes to the Terms</h3>
        <p>
          We may update these Terms of Service from time to time. The latest
          version will always be available on this page with the updated date.
        </p>

        <h3>8. Governing Law</h3>
        <p>
          These terms are governed by the laws of Czech Republic, without
          regard to conflict of law principles.
        </p>

        <h3>9. Contact Us</h3>
        <p>
          For questions about these Terms, please contact us:
          <br />
          📧 modernonlinetools.office@gmail.com
        </p>
      </div>
    </div>
  );
}
