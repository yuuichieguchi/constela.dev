import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Constela
        </h1>
        <p className="mt-4 text-xl font-medium text-primary sm:text-2xl">
          A compiler-first UI language for vibecoding
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Define your UI as structured JSON, let the compiler validate your schema, 
          and render with a minimal, reactive runtime. Perfect for AI-assisted development.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            href="/playground"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border px-6 text-base font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
                clipRule="evenodd"
              />
            </svg>
            Playground
          </Link>
        </div>
      </div>
    </section>
  );
}
