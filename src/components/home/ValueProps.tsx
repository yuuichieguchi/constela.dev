interface ValuePropItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const valueProps: ValuePropItem[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3V7a5 5 0 0 1 5-5z" />
        <circle cx="12" cy="15" r="1" />
      </svg>
    ),
    title: 'AI-Friendly DSL',
    description:
      'JSON-based structure that AI models can easily generate, understand, and validate without ambiguity.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Deterministic Actions',
    description:
      'Every action step is typed and predictable. No hidden side effects, no surprises.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
    title: 'Schema Validation',
    description:
      'Compile-time validation catches errors before runtime. Invalid UI definitions never make it to production.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Minimal Runtime',
    description:
      'Fine-grained reactivity without a virtual DOM. Only what changes gets updated.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    title: 'Structured Errors',
    description:
      'JSON Pointer paths pinpoint exact error locations. Debug faster with precise, actionable messages.',
  },
];

export function ValueProps() {
  return (
    <section className="border-t border-border bg-muted/30 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for the AI Era
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Constela bridges the gap between human intent and machine-generated
            UI with a language designed from the ground up for reliability.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {prop.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
