import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PlaygroundWrapper } from './PlaygroundWrapper';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Write and run Constela code in your browser',
};

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <PlaygroundWrapper />
        </div>
      </main>
      <Footer />
    </div>
  );
}
