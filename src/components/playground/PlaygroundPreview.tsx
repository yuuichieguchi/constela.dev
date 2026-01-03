'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { AppInstance } from '@constela/runtime';
import type { CompiledProgram } from '@constela/compiler';

interface PlaygroundPreviewProps {
  program: CompiledProgram | null;
  onError: (error: Error) => void;
}

export function PlaygroundPreview({ program, onError }: PlaygroundPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<AppInstance | null>(null);

  const mountApp = useCallback(async () => {
    if (!containerRef.current || !program) return;

    // Clean up previous app
    if (appRef.current) {
      try {
        appRef.current.destroy();
      } catch {
        // Ignore cleanup errors
      }
      appRef.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = '';

    try {
      // Dynamic import to avoid SSR issues
      const { createApp } = await import('@constela/runtime');
      const app = createApp(program, containerRef.current);
      appRef.current = app;
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [program, onError]);

  useEffect(() => {
    mountApp();

    return () => {
      if (appRef.current) {
        try {
          appRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
        appRef.current = null;
      }
    };
  }, [mountApp]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center border-b border-border bg-muted px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">Preview</span>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
