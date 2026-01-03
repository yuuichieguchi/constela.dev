'use client';

import dynamic from 'next/dynamic';

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

export function PlaygroundWrapper() {
  return <Playground />;
}
