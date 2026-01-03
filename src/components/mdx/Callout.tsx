import type { ReactNode } from 'react';

type CalloutType = 'note' | 'warning' | 'tip' | 'important';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutStyles: Record<CalloutType, { border: string; icon: string; title: string }> = {
  note: {
    border: 'border-l-blue-500',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-foreground',
  },
  warning: {
    border: 'border-l-amber-500',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-foreground',
  },
  tip: {
    border: 'border-l-emerald-500',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-foreground',
  },
  important: {
    border: 'border-l-red-500',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-foreground',
  },
};

const defaultTitles: Record<CalloutType, string> = {
  note: 'Note',
  warning: 'Warning',
  tip: 'Tip',
  important: 'Important',
};

function NoteIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function TipIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function ImportantIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const icons: Record<CalloutType, React.ComponentType<{ className?: string }>> = {
  note: NoteIcon,
  warning: WarningIcon,
  tip: TipIcon,
  important: ImportantIcon,
};

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const styles = calloutStyles[type];
  const Icon = icons[type];
  const displayTitle = title ?? defaultTitles[type];

  return (
    <div
      className={`my-6 border-l-4 pl-4 py-3 ${styles.border}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${styles.icon}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${styles.title}`}>{displayTitle}</p>
          <div className="mt-1 text-sm text-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
