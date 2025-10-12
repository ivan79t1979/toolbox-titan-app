
import Link from 'next/link';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-slate-900 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="font-headline text-lg font-semibold">
              Modern Online Tools
            </h3>
            <p className="mt-4 text-slate-300">
              Streamline your workflow with our curated collection of modern,
              intuitive online tools designed for creators, writers, and
              professionals.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    Terms Of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-slate-900">
                .
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie-policy"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    Cookie Policy
                  </Link>
                </li>
                 <li>
                  <Link
                    href="/sitemap"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; Modern Online Tools - Since {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}
