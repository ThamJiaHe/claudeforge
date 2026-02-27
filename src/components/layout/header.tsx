'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/auth/auth-button';
import { GitHubStars } from './github-stars';

export function Header() {
  const pathname = usePathname();

  function navLinkClasses(href: string) {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return [
      'rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm',
      isActive
        ? 'text-foreground font-medium'
        : 'text-muted-foreground hover:text-foreground',
    ].join(' ');
  }

  return (
    <header role="banner" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-3 sm:px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-base font-bold tracking-tight sm:text-lg">{APP_NAME}</span>
        </Link>

        {/* Right: Nav + Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <nav aria-label="Main navigation" className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href="/history"
              className={navLinkClasses('/history')}
            >
              History
            </Link>
            <Link
              href="/docs"
              className={navLinkClasses('/docs')}
            >
              Docs
            </Link>
            <Link
              href="/changelog"
              className={navLinkClasses('/changelog')}
            >
              Changelog
            </Link>
          </nav>

          <GitHubStars />

          <ThemeToggle />

          <AuthButton />
        </div>
      </div>
    </header>
  );
}
