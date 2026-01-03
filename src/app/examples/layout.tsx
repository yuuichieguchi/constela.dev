import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';

interface ExamplesLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Explore Constela examples to learn how to build UIs with the DSL',
};

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
