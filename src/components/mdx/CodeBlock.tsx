'use client';

import { useState, useCallback, type ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  'data-language'?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const language = props['data-language'] || '';

  const handleCopy = useCallback(async () => {
    const codeElement = document.querySelector(`[data-code-block="${language}"]`);
    const text = codeElement?.textContent || '';
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [language]);

  return (
    <div className="group relative">
      {language && (
        <div className="absolute right-12 top-3 z-10 rounded bg-muted-foreground/20 px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/80 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-green-500"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <pre className={className} data-code-block={language}>
        {children}
      </pre>
    </div>
  );
}
