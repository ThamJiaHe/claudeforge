# ClaudeForge

> Craft perfect Claude prompts from plain English

ClaudeForge transforms natural language descriptions into production-ready, model-optimized prompts for Claude Opus 4.6, Sonnet 4.6, and Haiku 4.5. Choose from 9 output formats, fine-tune parameters, and get intelligent skill suggestions — all in a clean, minimal interface.

## Features

- **Model-Aware Generation** — Prompts are tailored to the specific Claude model you select (Opus, Sonnet, or Haiku)
- **9 Output Formats** — XML (Anthropic), TOON, Harness, Markdown, Plain Text, JSON, YAML, Claude.md, System+User Split
- **Client-Side Format Switching** — Switch between formats instantly without regenerating
- **Extended Thinking Support** — Toggle extended thinking with configurable effort levels
- **Skill & Plugin Suggestions** — Get relevant Claude Code plugin recommendations based on your prompt
- **Prompt History** — Browse, search, filter, and favorite your past generations
- **BYOK (Bring Your Own Key)** — Your Anthropic API key stays in your browser's local storage
- **Dark/Light Theme** — System-aware theme switching
- **GitHub OAuth** — Optional sign-in via Supabase for persistent history

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Edge Runtime) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| State | Zustand 5 with persist middleware |
| Animations | Framer Motion 12 |
| Syntax Highlighting | Shiki 3 |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| AI | Anthropic Claude API (streaming via SSE) |
| Language | TypeScript 5.9 (strict mode) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/ThamJiaHe/claudeforge.git
cd claudeforge

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Edit `.env.local` with your values:

```env
# Supabase (optional — needed for auth & persistent history)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** The Anthropic API key is entered by users in-app and stored in browser local storage. It is never sent to ClaudeForge servers — it goes directly to Anthropic's API.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/generate/       # Edge Runtime streaming API
│   ├── auth/callback/      # OAuth callback handler
│   ├── docs/               # Documentation page
│   ├── history/            # Prompt history page
│   └── settings/           # Settings page
├── components/
│   ├── auth/               # Authentication components
│   ├── forge/              # Core prompt engineering UI
│   ├── history/            # History page components
│   ├── layout/             # Header, Footer
│   ├── settings/           # Settings components
│   └── ui/                 # shadcn/ui primitives
├── data/
│   └── skill-registry.ts   # 30+ Claude Code skills
├── hooks/                  # Custom React hooks
├── lib/
│   ├── engine/             # Meta-prompt builder & format converter
│   ├── constants.ts        # Models, formats, defaults
│   ├── supabase/           # Supabase client setup
│   └── types.ts            # TypeScript type definitions
└── store/                  # Zustand state stores
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy — Vercel auto-detects Next.js

### Other Platforms

ClaudeForge runs on any platform supporting Next.js with Edge Runtime:
- **Netlify** — `npm run build` with `@netlify/plugin-nextjs`
- **Railway** — Direct deployment with `npm start`
- **Docker** — Use the Next.js standalone output mode

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the [Claude Prompt Engineering Guide](https://github.com/ThamJiaHe/claude-prompt-engineering-guide) and is open source.

## Acknowledgments

- Built with [Claude](https://claude.ai) by Anthropic
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
