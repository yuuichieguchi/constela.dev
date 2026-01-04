'use client';

interface PlaygroundSuccessProps {
  show: boolean;
}

export function PlaygroundSuccess({ show }: PlaygroundSuccessProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-green-500/30 bg-green-500/10"
    >
      <div className="flex items-center px-4 py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 text-green-500"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span className="text-sm font-medium text-green-500">Valid JSON</span>
      </div>
    </div>
  );
}
