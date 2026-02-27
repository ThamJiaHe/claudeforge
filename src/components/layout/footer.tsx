import Link from 'next/link';
import { Github } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';
import { KofiButton } from './kofi-button';

const footerLinks = {
  product: [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'History', href: '/history' },
    { label: 'Changelog', href: '/changelog' },
  ],
  community: [
    { label: 'GitHub', href: 'https://github.com/ThamJiaHe/claudeforge', external: true },
    { label: 'Issues', href: 'https://github.com/ThamJiaHe/claudeforge/issues', external: true },
    { label: 'Contribute', href: 'https://github.com/ThamJiaHe/claudeforge/blob/main/README.md', external: true },
  ],
  legal: [
    { label: 'Security', href: '/security' },
    { label: 'Privacy', href: 'https://github.com/ThamJiaHe/claudeforge', external: true },
    { label: 'License (MIT)', href: 'https://github.com/ThamJiaHe/claudeforge/blob/main/LICENSE', external: true },
  ],
};

function FooterColumn({ title, links }: { title: string; links: typeof footerLinks.product }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {'external' in link && link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      {/* Column links */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-3">
        <FooterColumn title="Product" links={footerLinks.product} />
        <FooterColumn title="Community" links={footerLinks.community} />
        <FooterColumn title="Legal & Security" links={footerLinks.legal} />
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <p className="text-xs text-muted-foreground">
            Built with &#9829; and Claude
          </p>
          <div className="flex items-center gap-3">
            <KofiButton />
            <a
              href="https://github.com/ThamJiaHe/claudeforge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub repository"
            >
              <Github className="size-4" />
            </a>
            <span className="text-xs text-muted-foreground">v{APP_VERSION}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
