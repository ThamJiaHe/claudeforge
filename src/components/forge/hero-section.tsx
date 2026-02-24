export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      {/* Subtle gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 via-transparent to-transparent dark:from-muted/20"
      />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Craft perfect Claude prompts
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Transform plain English into production-ready, model-optimized prompts
          for Claude Opus, Sonnet, and Haiku
        </p>
      </div>
    </section>
  );
}
