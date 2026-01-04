import Link from 'next/link';
import { REPO_MAIN, REPO_DOCS } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid items-center gap-4 text-center sm:grid-cols-3 sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Constela. All rights reserved.
          </p>
          <span className="text-xs text-muted-foreground sm:justify-self-center">Built with Constela</span>
          <div className="flex items-center justify-center gap-6 sm:justify-self-end">
            <Link
              href={REPO_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href={REPO_DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
