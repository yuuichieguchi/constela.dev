import { ExampleCard } from '@/components/examples';

const examples = [
  {
    title: 'Counter',
    description: 'Basic counter with increment, decrement, and reset actions.',
    href: '/examples/counter',
    features: ['state', 'actions', 'events'],
  },
  {
    title: 'Todo List',
    description: 'Add and remove todo items with list state management.',
    href: '/examples/todo-list',
    features: ['list state', 'input binding', 'each loop'],
  },
  {
    title: 'Fetch List',
    description: 'Fetch data from an API with loading states and error handling.',
    href: '/examples/fetch-list',
    features: ['fetch', 'loading states', 'conditional rendering'],
  },
  {
    title: 'Router',
    description: 'Multi-page routing example with navigation.',
    href: '/examples/router',
    features: ['@constela/router', 'route definitions', 'navigation'],
  },
];

export default function ExamplesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Examples</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore these examples to learn how to build UIs with Constela.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {examples.map((example) => (
          <ExampleCard
            key={example.href}
            title={example.title}
            description={example.description}
            href={example.href}
            features={example.features}
          />
        ))}
      </div>
    </div>
  );
}
