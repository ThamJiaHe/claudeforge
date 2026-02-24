import { Github } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">
          Built with &#9829; and Claude
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ThamJiaHe/claudeforge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <Github className="size-4" />
          </a>
          <span className="text-xs text-muted-foreground">v{APP_VERSION}</span>
        </div>
      </div>
    </footer>
  );
}
