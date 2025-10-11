import { PageHeader } from '@/components/page-header';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Disclaimer" />
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Last Updated: 25th September 2025
        </p>
        <p>
          The information and services provided on modernonlinetools.com are
          intended for general informational and entertainment purposes only. By
          using our website and tools, you acknowledge and agree to the
          following:
        </p>

        <h3>1. No Professional Advice</h3>
        <ul>
          <li>
            Our tools and content do not constitute legal, financial, medical,
            or professional advice.
          </li>
          <li>
            You should not rely solely on the results or information from this
            site for critical decisions. Always seek advice from a qualified
            professional when necessary.
          </li>
        </ul>

        <h3>2. Accuracy of Results</h3>
        <ul>
          <li>
            While we strive to provide accurate and reliable tools, we cannot
            guarantee that the outputs are always correct, complete, or up to
            date.
          </li>
          <li>
            Results may vary depending on input, usage, or technical factors.
          </li>
        </ul>

        <h3>3. No Liability</h3>
        <ul>
          <li>
            modernonlinetools.com is not responsible for any loss, damage, or
            inconvenience caused by the use of our website or tools.
          </li>
          <li>
            This includes, but is not limited to, data loss, errors in results,
            business decisions, or misuse of the tools.
          </li>
        </ul>

        <h3>4. Third-Party Services and Links</h3>
        <ul>
          <li>
            Some features may rely on third-party models, APIs, or links. We do
            not control or guarantee the accuracy, security, or practices of
            these external services.
          </li>
          <li>
            You are responsible for reviewing their policies before use.
          </li>
        </ul>

        <h3>5. Use at Your Own Risk</h3>
        <ul>
          <li>All tools and services are provided “as is” without warranty of any kind.</li>
          <li>
            By continuing to use this website, you accept full responsibility
            for any risks associated with your usage.
          </li>
        </ul>

        <h3>6. Contact Us</h3>
        <p>
          If you have questions about this Disclaimer, please contact us:
          <br />
          📧 modernonlinetools.office@gmail.com
        </p>
      </div>
    </div>
  );
}
