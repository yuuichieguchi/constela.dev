'use client';

import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface PlaygroundEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlaygroundEditor({ value, onChange }: PlaygroundEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border">
      <Editor
        height="100%"
        language="json"
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'var(--font-geist-mono), monospace',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
