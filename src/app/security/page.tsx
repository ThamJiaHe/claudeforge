import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ExternalLink, Clock, Target, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Security vulnerability reporting policy for ClaudeForge',
};

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <Shield className="size-8 text-muted-foreground" />
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
      </div>

      {/* Reporting */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Reporting a Vulnerability</h2>
        <p className="mb-4 text-muted-foreground">
          We take security seriously. If you discover a vulnerability, please follow these steps:
        </p>
        <ol className="mb-4 list-inside list-decimal space-y-2 text-muted-foreground">
          <li>
            Go to our{' '}
            <a
              href="https://github.com/ThamJiaHe/claudeforge/security/advisories/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              Report a vulnerability
              <ExternalLink className="size-3" />
            </a>{' '}
            page on GitHub
          </li>
          <li>Provide a clear description of the vulnerability</li>
          <li>Include steps to reproduce if possible</li>
          <li>Allow us time to investigate before public disclosure</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          <strong>Do not</strong> open a public issue for security vulnerabilities.
        </p>
      </section>

      {/* Timeline */}
      <section className="mb-10">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Response Timeline</h2>
        </div>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          <li>
            <strong>Acknowledgment:</strong> Within 5 business days
          </li>
          <li>
            <strong>Resolution target:</strong> 90 days from report
          </li>
        </ul>
      </section>

      {/* Scope */}
      <section className="mb-10">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Scope</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium text-green-600 dark:text-green-400">In Scope</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>claudeforge.vercel.app</li>
              <li>GitHub repository code</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">Out of Scope</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Third-party services</li>
              <li>Supabase infrastructure</li>
              <li>Vercel platform</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Safe Harbor */}
      <section className="mb-10">
        <div className="flex items-center gap-2">
          <Heart className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Safe Harbor</h2>
        </div>
        <p className="mt-4 text-muted-foreground">
          We consider security research conducted in accordance with this policy to be authorized and will not pursue legal action against researchers who follow responsible disclosure practices.
        </p>
      </section>

      {/* Hall of Fame */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Hall of Fame</h2>
        <p className="text-sm text-muted-foreground">
          No reports yet. Be the first responsible reporter!
        </p>
      </section>

      {/* security.txt note */}
      <section className="border-t pt-6">
        <p className="text-xs text-muted-foreground">
          This site publishes a{' '}
          <Link
            href="/.well-known/security.txt"
            className="underline underline-offset-4 hover:no-underline"
          >
            security.txt
          </Link>{' '}
          file in compliance with{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9116"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:no-underline"
          >
            RFC 9116
          </a>
          .
        </p>
      </section>
    </div>
  );
}
