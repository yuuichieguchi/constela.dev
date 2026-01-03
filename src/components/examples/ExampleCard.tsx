import Link from 'next/link';

interface ExampleCardProps {
  title: string;
  description: string;
  href: string;
  features?: string[];
}

export function ExampleCard({ title, description, href, features }: ExampleCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary hover:bg-muted/50"
    >
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {features && features.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
