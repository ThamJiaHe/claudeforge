'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Right: Nav + Actions */}
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            <Link
              href="/history"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              History
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </Link>
          </nav>

          <ThemeToggle />

          {/* Placeholder for AuthButton — will be added later */}
          <div data-slot="auth-button-placeholder" />
        </div>
      </div>
    </header>
  );
}
