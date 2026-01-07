/**
 * Examples index page route component (createExamplesIndexPage function)
 *
 * Creates a CompiledNode structure for the examples listing page.
 * Renders header, main content with example cards, and footer.
 *
 * @module routes/examples/index
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';
import { createHeader } from '@/components/layout/header';
import { createFooter } from '@/components/layout/footer';
import { createExampleCard } from '@/components/examples/example-card';

/**
 * Example data for the examples index page
 */
const EXAMPLES_DATA = [
  {
    slug: 'counter',
    title: 'Counter',
    description: 'A simple counter with increment, decrement, and reset.',
    features: ['State', 'Actions', 'Events'],
  },
  {
    slug: 'todo-list',
    title: 'Todo List',
    description: 'Manage your todo items with list operations.',
    features: ['State', 'List Operations', 'Input Binding'],
  },
  {
    slug: 'fetch-list',
    title: 'Fetch List',
    description: 'Fetch data from an external API and display results.',
    features: ['Async Actions', 'Fetch', 'Loading States'],
  },
  {
    slug: 'router',
    title: 'Router',
    description: 'Client-side routing between multiple pages.',
    features: ['Router', 'Navigation', 'Dynamic Routes'],
  },
];

/**
 * Helper to create a literal expression
 */
function lit(
  value: string | number | boolean | null | unknown[]
): CompiledExpression {
  return { expr: 'lit', value };
}

/**
 * Helper to create an element node
 */
function el(
  tag: string,
  props?: Record<string, string | number | boolean | null | unknown[]>,
  children?: CompiledNode[]
): CompiledElementNode {
  const node: CompiledElementNode = { kind: 'element', tag };
  if (props && Object.keys(props).length > 0) {
    node.props = Object.fromEntries(
      Object.entries(props).map(([k, v]) => [k, lit(v)])
    );
  }
  if (children && children.length > 0) {
    node.children = children;
  }
  return node;
}

/**
 * Helper to create a text node
 */
function text(value: string): CompiledTextNode {
  return { kind: 'text', value: lit(value) as CompiledExpression };
}

/**
 * Creates the Examples index page as a CompiledNode
 *
 * @returns CompiledElementNode representing the examples index page
 */
export function createExamplesIndexPage(): CompiledElementNode {
  const currentPath = '/examples';

  // Create layout components
  const header = createHeader({ currentPath });
  const footer = createFooter();

  // Create page title
  const pageTitle = el(
    'h1',
    { class: 'text-3xl font-bold text-foreground' },
    [text('Examples')]
  );

  // Create page description
  const pageDescription = el(
    'p',
    { class: 'mt-4 text-lg text-muted-foreground' },
    [text('Explore interactive examples showcasing Constela features.')]
  );

  // Create example cards
  const exampleCards = EXAMPLES_DATA.map((example) =>
    createExampleCard({
      title: example.title,
      description: example.description,
      href: `/examples/${example.slug}`,
      features: example.features,
    })
  );

  // Create cards grid
  const cardsGrid = el(
    'div',
    { class: 'mt-8 grid gap-6 sm:grid-cols-2' },
    exampleCards
  );

  // Create content wrapper
  const contentWrapper = el('div', { class: 'mx-auto max-w-4xl px-6 py-12' }, [
    pageTitle,
    pageDescription,
    cardsGrid,
  ]);

  // Create main element (no sidebar for examples)
  const main = el('main', { class: 'pt-[var(--header-height)]' }, [
    contentWrapper,
  ]);

  // Create root div
  return el('div', { class: 'min-h-screen bg-background' }, [
    header,
    main,
    footer,
  ]);
}

export default createExamplesIndexPage;
