'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/auth/auth-button';

export function Header() {
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
              className="rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:py-2 sm:text-sm"
            >
              History
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:py-2 sm:text-sm"
            >
              Docs
            </Link>
          </nav>

          <ThemeToggle />

          <AuthButton />
        </div>
      </div>
    </header>
  );
}
