import Link from 'next/link';
import type { NavItem } from '@/lib/navigation';

interface DocsPaginationProps {
  prev?: NavItem;
  next?: NavItem;
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span>
            <span className="block text-xs text-muted-foreground">Previous</span>
            <span className="font-medium text-foreground">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>
            <span className="block text-xs text-muted-foreground">Next</span>
            <span className="font-medium text-foreground">{next.title}</span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
