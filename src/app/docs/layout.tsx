import type { ReactNode } from 'react';
import { Header, Sidebar, Footer } from '@/components/layout';
import { docsNavigation } from '@/lib/navigation';

interface DocsLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar navigation={docsNavigation} />
      <main className="pt-[var(--header-height)] lg:pl-[var(--sidebar-width)]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {children}
        </div>
      </main>
      <div className="lg:pl-[var(--sidebar-width)]">
        <Footer />
      </div>
    </div>
  );
}
