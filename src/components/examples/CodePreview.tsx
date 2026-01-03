'use client';

import { CopyButton } from './CopyButton';

interface CodePreviewProps {
  code: string;
  language?: string;
}

export function CodePreview({ code, language = 'json' }: CodePreviewProps) {
  return (
    <div className="group relative">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {language && (
          <span className="rounded bg-muted-foreground/20 px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {language}
          </span>
        )}
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}
