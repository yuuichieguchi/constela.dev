import { Header, Footer } from '@/components/layout';
import { Hero, ValueProps, CodeDemo } from '@/components/home';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <Hero />
        <ValueProps />
        <CodeDemo />
      </main>
      <Footer />
    </div>
  );
}
