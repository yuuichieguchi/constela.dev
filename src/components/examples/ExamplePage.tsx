import Link from 'next/link';
import { CodePreview } from './CodePreview';

interface ExamplePageProps {
  title: string;
  description: string;
  code: string;
  language?: string;
  features: string[];
  runCommands?: string[];
  playgroundUrl?: string;
  note?: string;
}

export function ExamplePage({
  title,
  description,
  code,
  language = 'json',
  features,
  runCommands,
  playgroundUrl,
  note,
}: ExamplePageProps) {
  return (
    <article className="space-y-8">
      <header>
        <Link
          href="/examples"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Examples
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      </header>

      {note && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground">{note}</p>
        </div>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Source Code</h2>
        <CodePreview code={code} language={language} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Features Used</h2>
        <ul className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {runCommands && runCommands.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">How to Run</h2>
          <div className="space-y-3">
            {runCommands.map((cmd, index) => (
              <div key={index} className="group relative">
                <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
                  <code className="font-mono text-foreground">{cmd}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {playgroundUrl && (
        <section>
          <Link
            href={playgroundUrl}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Try in Playground
          </Link>
        </section>
      )}
    </article>
  );
}
