import Link from 'next/link';
import { REPO_MAIN, REPO_DOCS } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Constela. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
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
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Built with Constela
        </p>
      </div>
    </footer>
  );
}
