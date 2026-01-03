'use client';

import type { ConstelaError } from '@constela/core';

interface PlaygroundErrorsProps {
  errors: ConstelaError[];
  runtimeError: Error | null;
}

export function PlaygroundErrors({ errors, runtimeError }: PlaygroundErrorsProps) {
  if (errors.length === 0 && !runtimeError) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10">
      <div className="flex items-center border-b border-red-500/30 px-4 py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 text-red-500"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-sm font-medium text-red-500">
          {errors.length + (runtimeError ? 1 : 0)} Error
          {errors.length + (runtimeError ? 1 : 0) > 1 ? 's' : ''}
        </span>
      </div>
      <ul className="divide-y divide-red-500/20">
        {errors.map((error, index) => (
          <li key={index} className="px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 rounded bg-red-500/20 px-2 py-0.5 text-xs font-mono text-red-500">
                {error.code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{error.message}</p>
                {error.path && (
                  <p className="mt-1 text-xs font-mono text-muted-foreground">
                    Path: {error.path}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
        {runtimeError && (
          <li className="px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 rounded bg-red-500/20 px-2 py-0.5 text-xs font-mono text-red-500">
                RUNTIME
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{runtimeError.message}</p>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
