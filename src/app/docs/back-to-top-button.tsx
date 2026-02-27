'use client';

export function BackToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="text-sm text-primary hover:underline"
    >
      Back to top
    </button>
  );
}
