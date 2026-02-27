'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const CACHE_KEY = 'gh-stars';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const REPO = 'ThamJiaHe/claudeforge';

export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { count, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) {
        setStars(count);
        return;
      }
    }

    fetch(`https://api.github.com/repos/${REPO}`)
      .then((res) => {
        if (!res.ok) throw new Error('GitHub API error');
        return res.json();
      })
      .then((data) => {
        const count = data.stargazers_count;
        setStars(count);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ count, ts: Date.now() }));
      })
      .catch(() => setStars(null));
  }, []);

  if (stars === null) return null;

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`${stars} GitHub stars`}
    >
      <Star className="size-3" />
      <span>{stars}</span>
    </a>
  );
}
