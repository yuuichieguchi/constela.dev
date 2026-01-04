'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { EXAMPLE_CODES } from '@/components/playground/example-codes';

const Playground = dynamic(
  () => import('@/components/playground').then((mod) => mod.Playground),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-var(--header-height)-120px)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

function PlaygroundWithParams() {
  const searchParams = useSearchParams();
  const example = searchParams.get('example');
  const initialCode = example && EXAMPLE_CODES[example] ? EXAMPLE_CODES[example] : undefined;

  return <Playground initialCode={initialCode} />;
}

export function PlaygroundWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-var(--header-height)-120px)] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      }
    >
      <PlaygroundWithParams />
    </Suspense>
  );
}
