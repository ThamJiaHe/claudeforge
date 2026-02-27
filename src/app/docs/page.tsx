import type { Metadata } from 'next';
import { BackToTopButton } from './back-to-top-button';
import {
  BookOpen,
  Key,
  FileText,
  SlidersHorizontal,
  Lightbulb,
  Github,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Docs — ClaudeForge',
  description:
    'Learn how to use ClaudeForge to generate production-ready prompts for Claude models.',
};

/* ------------------------------------------------------------------ */
/*  Reusable primitives                                                */
/* ------------------------------------------------------------------ */

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
      {children}
    </code>
  );
}

function ExternalAnchor({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {children}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Table of contents                                                  */
/* ------------------------------------------------------------------ */

const TOC_ITEMS = [
  { id: 'what-is-claudeforge', label: 'What is ClaudeForge?', icon: BookOpen },
  { id: 'getting-your-api-key', label: 'Getting Your API Key', icon: Key },
  { id: 'output-formats', label: 'Output Formats', icon: FileText },
  { id: 'parameter-guide', label: 'Parameter Guide', icon: SlidersHorizontal },
  { id: 'tips-for-great-prompts', label: 'Tips for Great Prompts', icon: Lightbulb },
  { id: 'open-source', label: 'Open Source', icon: Github },
] as const;

function TableOfContents() {
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-lg border bg-card p-4 sm:p-6"
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </h2>
      <ul className="space-y-1">
        {TOC_ITEMS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              <span>{label}</span>
              <ChevronRight className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Format card                                                        */
/* ------------------------------------------------------------------ */

function FormatCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <li className="flex gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page title */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Documentation
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Everything you need to craft production-ready prompts with ClaudeForge.
        </p>
      </header>

      {/* Table of contents */}
      <TableOfContents />

      {/* Content sections */}
      <div className="mt-10 space-y-14">
        {/* ------ 1. What is ClaudeForge? ------ */}
        <Section id="what-is-claudeforge" title="What is ClaudeForge?">
          <p className="leading-relaxed text-muted-foreground">
            ClaudeForge transforms plain English descriptions into
            production-ready prompts optimized for specific Claude models. Instead
            of manually crafting complex prompt structures, you describe what you
            want in natural language and ClaudeForge does the heavy lifting.
          </p>

          <div className="mt-6 rounded-lg border bg-card p-4 sm:p-6">
            <h3 className="mb-3 text-lg font-semibold">How it works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <span>
                  <strong className="text-foreground">Describe your task</strong>{' '}
                  &mdash; Write what you want Claude to do in plain English.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <span>
                  <strong className="text-foreground">Generate</strong> &mdash;
                  ClaudeForge creates an optimized prompt in your chosen format
                  and model configuration.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <span>
                  <strong className="text-foreground">Copy and use</strong>{' '}
                  &mdash; Copy the generated prompt and paste it into Claude (or
                  use the API) for best results.
                </span>
              </li>
            </ol>
          </div>
        </Section>

        {/* ------ 2. Getting Your API Key ------ */}
        <Section id="getting-your-api-key" title="Getting Your API Key">
          <p className="leading-relaxed text-muted-foreground">
            ClaudeForge uses the Anthropic API to generate optimized prompts.
            Follow these steps to get your API key:
          </p>

          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                1
              </span>
              <span>
                Visit the{' '}
                <ExternalAnchor href="https://console.anthropic.com">
                  Anthropic Console
                </ExternalAnchor>{' '}
                and sign in (or create an account).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                2
              </span>
              <span>
                Navigate to{' '}
                <strong className="text-foreground">API Keys</strong> in the
                sidebar.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                3
              </span>
              <span>
                Click <strong className="text-foreground">Create Key</strong>,
                give it a name, and copy the generated key.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                4
              </span>
              <span>
                Paste the key into the ClaudeForge settings panel. It is stored
                in your browser only and never sent to our servers.
              </span>
            </li>
          </ol>

          <div className="mt-4 rounded-lg border-l-4 border-primary bg-muted/60 p-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Privacy note:</strong> Your API
              key is stored exclusively in your browser&apos;s local storage. It is
              sent directly to Anthropic&apos;s API and is never transmitted to or
              stored on ClaudeForge servers.
            </p>
          </div>
        </Section>

        {/* ------ 3. Output Formats ------ */}
        <Section id="output-formats" title="Output Formats">
          <p className="mb-4 leading-relaxed text-muted-foreground">
            ClaudeForge supports nine output formats. Choose the one that best
            fits your workflow:
          </p>

          <ul className="grid gap-3">
            <FormatCard
              name="XML (Anthropic)"
              description="Official Anthropic prompt structure using XML tags like <role>, <task>, and <rules>. Recommended for production API usage."
            />
            <FormatCard
              name="TOON"
              description="Block-based format using [ROLE], [TASK], [OUTPUT] sections. Clean and easy to scan."
            />
            <FormatCard
              name="Harness Style"
              description="YAML-like structured format with metadata headers. Great for prompt versioning and testing harnesses."
            />
            <FormatCard
              name="Markdown"
              description="Headers and bullets for human readability. Ideal for documentation and sharing prompts with teammates."
            />
            <FormatCard
              name="Plain Text"
              description="Raw, unformatted prompt text. Use when you need a minimal prompt with no special formatting."
            />
            <FormatCard
              name="JSON"
              description="Machine-readable structured prompt. Perfect for programmatic consumption and pipeline integration."
            />
            <FormatCard
              name="YAML Config"
              description="Key-value configuration style. Convenient for config files and infrastructure-as-code workflows."
            />
            <FormatCard
              name="Claude.md"
              description="Claude Code project rules format for CLAUDE.md files. Ideal for Claude Code and repository-level instructions."
            />
            <FormatCard
              name="System + User Split"
              description="Separate system and user message blocks designed for direct API calls with distinct message roles."
            />
          </ul>
        </Section>

        {/* ------ 4. Parameter Guide ------ */}
        <Section id="parameter-guide" title="Parameter Guide">
          <p className="mb-6 leading-relaxed text-muted-foreground">
            Fine-tune how ClaudeForge generates your prompt by adjusting these
            parameters.
          </p>

          {/* Model */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Model</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select the Claude model the generated prompt targets.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex gap-2">
                  <InlineCode>Opus 4.6</InlineCode>
                  <span className="text-muted-foreground">
                    &mdash; Most powerful. Supports extended thinking and adaptive
                    effort. 128K output, up to 1M context.
                  </span>
                </li>
                <li className="flex gap-2">
                  <InlineCode>Sonnet 4.6</InlineCode>
                  <span className="text-muted-foreground">
                    &mdash; Best balance of quality and cost. Supports extended
                    thinking. 64K output.
                  </span>
                </li>
                <li className="flex gap-2">
                  <InlineCode>Haiku 4.5</InlineCode>
                  <span className="text-muted-foreground">
                    &mdash; Fastest and cheapest. Ideal for quick tasks. 8K
                    output. No extended thinking.
                  </span>
                </li>
              </ul>
            </div>

            {/* Extended Thinking */}
            <div>
              <h3 className="text-lg font-semibold">Extended Thinking</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                When enabled, Claude thinks step-by-step in a private scratchpad
                before producing its visible response. This often improves the
                quality of complex, multi-step tasks. Available on Opus and
                Sonnet only.
              </p>
            </div>

            {/* Effort Level */}
            <div>
              <h3 className="text-lg font-semibold">Effort Level</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Controls how deeply Claude thinks when extended thinking is
                enabled.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li>
                  <InlineCode>low</InlineCode> &mdash; Minimal thinking, fastest
                  responses.
                </li>
                <li>
                  <InlineCode>medium</InlineCode> &mdash; Balanced thinking
                  depth (default).
                </li>
                <li>
                  <InlineCode>high</InlineCode> &mdash; Deeper reasoning for
                  harder problems.
                </li>
                <li>
                  <InlineCode>max</InlineCode> &mdash; Maximum thinking budget.
                  Opus only.
                </li>
              </ul>
            </div>

            {/* Max Tokens */}
            <div>
              <h3 className="text-lg font-semibold">Max Tokens</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sets the maximum number of tokens Claude can produce in its
                response. The upper limit depends on the selected model: 128,000
                for Opus, 64,000 for Sonnet, and 8,192 for Haiku. A higher value
                allows longer outputs but may increase cost and latency.
              </p>
            </div>
          </div>
        </Section>

        {/* ------ 5. Tips for Great Prompts ------ */}
        <Section id="tips-for-great-prompts" title="Tips for Great Prompts">
          <p className="mb-4 leading-relaxed text-muted-foreground">
            The quality of the generated prompt depends on the quality of your
            description. Here are some best practices:
          </p>

          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 text-muted-foreground">
              <span className="mt-0.5 text-primary">&#10003;</span>
              <span>
                <strong className="text-foreground">
                  Be specific about the task.
                </strong>{' '}
                Instead of &ldquo;write code,&rdquo; say &ldquo;write a
                TypeScript function that validates email addresses using a
                regex.&rdquo;
              </span>
            </li>
            <li className="flex gap-3 text-muted-foreground">
              <span className="mt-0.5 text-primary">&#10003;</span>
              <span>
                <strong className="text-foreground">
                  Define the output format you expect.
                </strong>{' '}
                Mention whether you want JSON, a numbered list, a code block, or
                prose.
              </span>
            </li>
            <li className="flex gap-3 text-muted-foreground">
              <span className="mt-0.5 text-primary">&#10003;</span>
              <span>
                <strong className="text-foreground">
                  Include examples of desired output.
                </strong>{' '}
                Providing one or two concrete examples dramatically improves
                prompt accuracy.
              </span>
            </li>
            <li className="flex gap-3 text-muted-foreground">
              <span className="mt-0.5 text-primary">&#10003;</span>
              <span>
                <strong className="text-foreground">
                  Specify constraints and edge cases.
                </strong>{' '}
                Mention any limits (max length, allowed values) and how the
                prompt should handle unusual inputs.
              </span>
            </li>
            <li className="flex gap-3 text-muted-foreground">
              <span className="mt-0.5 text-primary">&#10003;</span>
              <span>
                <strong className="text-foreground">
                  Mention the target audience.
                </strong>{' '}
                Telling Claude who the end reader is helps it choose the right
                tone and level of detail.
              </span>
            </li>
          </ul>
        </Section>

        {/* ------ 6. Open Source ------ */}
        <Section id="open-source" title="Open Source">
          <p className="leading-relaxed text-muted-foreground">
            ClaudeForge is open source and part of the{' '}
            <strong className="text-foreground">
              Claude Prompt Engineering Guide
            </strong>{' '}
            project.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://github.com/ThamJiaHe/claudeforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Github className="size-4" />
              View on GitHub
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Contributions, bug reports, and feature requests are welcome. Check
            the repository for contribution guidelines and open issues.
          </p>
        </Section>
      </div>

      {/* Back to top */}
      <div className="mt-16 border-t pt-6 text-center">
        <BackToTopButton />
      </div>
    </div>
  );
}
