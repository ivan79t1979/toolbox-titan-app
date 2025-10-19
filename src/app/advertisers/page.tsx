import { PageHeader } from '@/components/page-header';
import Link from 'next/link';

export default function AdvertisersPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Advertise With Us"
        description="Reach a dedicated audience of creators, developers, and professionals."
      />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          We are currently building a self-service advertising platform to allow
          you to place your ads directly on our site. This feature will allow
          you to upload your banner, choose your target audience, and manage
          your campaign with ease.
        </p>
        <h3>Coming Soon</h3>
        <ul>
          <li>
            Choose from various ad sizes (e.g., 728x90, 300x250) to fit your
            needs.
          </li>
          <li>Set your campaign duration and budget directly.</li>
          <li>Track performance with simple, clear analytics.</li>
        </ul>
        <h3>Get in Touch</h3>
        <p>
          If you are interested in advertising with us before the platform is
          ready, or if you have any questions, please contact our team at{' '}
          <Link href="mailto:modernonlinetools.office@gmail.com">
            modernonlinetools.office@gmail.com
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
