import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | ClaudeForge',
  description: 'Version history and release notes for ClaudeForge',
};

const changelog = [
  {
    version: 'v0.3.0',
    date: '2026-02-27',
    changes: [
      'Added security policy and /security page',
      'Added Ko-Fi support button',
      'Redesigned footer with 3-column layout',
      'Added changelog page',
      'Added GitHub star count in header',
      'Improved mobile config bar spacing',
      'Consistent page padding across all pages',
    ],
  },
  {
    version: 'v0.2.0',
    date: '2026-02-26',
    changes: [
      'Added multi-provider support (7 AI providers)',
      'Added 5 prompt target modes',
      'Improved error diagnostics and auth resilience',
      'Per-provider API key storage',
    ],
  },
  {
    version: 'v0.1.0',
    date: '2026-02-25',
    changes: [
      'Initial release',
      'Prompt generation with Claude integration',
      'History management with local storage',
      'Dark/light theme support',
      'Documentation page',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Changelog</h1>
      <div className="space-y-8">
        {changelog.map((release) => (
          <section key={release.version} className="border-l-2 border-primary pl-6">
            <div className="mb-2 flex items-baseline gap-3">
              <h2 className="text-xl font-semibold">{release.version}</h2>
              <time className="text-sm text-muted-foreground">{release.date}</time>
            </div>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {release.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
