/**
 * Example detail page route component (createExamplePage and getStaticPaths functions)
 *
 * Creates a CompiledNode structure for individual example pages.
 * Renders header, main content with example details, and footer.
 *
 * @module routes/examples/[slug]
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';
import { createHeader } from '@/components/layout/header';
import { createFooter } from '@/components/layout/footer';
import { createExamplePageComponent } from '@/components/examples/example-page';
import { EXAMPLE_CODES } from '@/components/playground/example-codes';

export interface ExamplePageParams {
  slug: string;
}

export interface StaticPath {
  params: { slug: string };
}

/**
 * Example data for individual example pages
 */
const EXAMPLES_DATA: Record<
  string,
  {
    title: string;
    description: string;
    features: string[];
  }
> = {
  counter: {
    title: 'Counter',
    description: 'A simple counter with increment, decrement, and reset.',
    features: ['State', 'Actions', 'Events'],
  },
  'todo-list': {
    title: 'Todo List',
    description: 'Manage your todo items with list operations.',
    features: ['State', 'List Operations', 'Input Binding', 'Each Loop'],
  },
  'fetch-list': {
    title: 'Fetch List',
    description: 'Fetch data from an external API and display results.',
    features: ['Async Actions', 'Fetch', 'Loading States', 'Conditional Rendering'],
  },
  router: {
    title: 'Router',
    description: 'Client-side routing between multiple pages.',
    features: ['Router', 'Navigation', 'Dynamic Routes', 'URL Parameters'],
  },
};

/**
 * Router example code (not in EXAMPLE_CODES)
 */
const ROUTER_CODE = `{
  "version": "1.0",
  "state": {
    "currentPage": { "type": "string", "initial": "home" }
  },
  "actions": [
    {
      "name": "navigate",
      "steps": [
        { "do": "set", "target": "currentPage", "value": { "expr": "var", "name": "page" } }
      ]
    }
  ],
  "view": {
    "kind": "element",
    "tag": "div",
    "props": { "style": { "expr": "lit", "value": "font-family: system-ui, sans-serif; padding: 16px;" } },
    "children": [
      {
        "kind": "element",
        "tag": "h1",
        "props": { "style": { "expr": "lit", "value": "margin: 0 0 8px 0; font-size: 24px;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Router Example" } }]
      },
      {
        "kind": "element",
        "tag": "p",
        "props": { "style": { "expr": "lit", "value": "color: #666; margin: 0 0 16px 0;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Client-side routing between pages." } }]
      },
      {
        "kind": "element",
        "tag": "nav",
        "props": { "style": { "expr": "lit", "value": "display: flex; gap: 8px; margin-bottom: 16px;" } },
        "children": [
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "lit", "value": "padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;" },
              "onClick": { "event": "click", "action": "navigate", "payload": { "page": { "expr": "lit", "value": "home" } } }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Home" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "lit", "value": "padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;" },
              "onClick": { "event": "click", "action": "navigate", "payload": { "page": { "expr": "lit", "value": "about" } } }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "About" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "lit", "value": "padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;" },
              "onClick": { "event": "click", "action": "navigate", "payload": { "page": { "expr": "lit", "value": "contact" } } }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Contact" } }]
          }
        ]
      },
      {
        "kind": "element",
        "tag": "div",
        "props": { "style": { "expr": "lit", "value": "padding: 16px; background: #f5f5f5; border-radius: 8px;" } },
        "children": [
          {
            "kind": "element",
            "tag": "p",
            "props": { "style": { "expr": "lit", "value": "font-size: 18px; color: #333;" } },
            "children": [
              { "kind": "text", "value": { "expr": "lit", "value": "Current page: " } },
              { "kind": "text", "value": { "expr": "state", "name": "currentPage" } }
            ]
          }
        ]
      }
    ]
  }
}`;

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
 * Creates a 404 not found page structure
 */
function createNotFoundPage(currentPath: string): CompiledElementNode {
  const header = createHeader({ currentPath });
  const footer = createFooter();

  const notFoundContent = el(
    'div',
    { class: 'mx-auto max-w-4xl px-6 py-12 text-center' },
    [
      el('h1', { class: 'text-4xl font-bold text-foreground' }, [text('404')]),
      el('p', { class: 'mt-4 text-muted-foreground' }, [
        text('Example not found'),
      ]),
    ]
  );

  const main = el('main', { class: 'pt-[var(--header-height)]' }, [
    notFoundContent,
  ]);

  return el('div', { class: 'min-h-screen bg-background' }, [
    header,
    main,
    footer,
  ]);
}

/**
 * Gets the example code for a given slug
 */
function getExampleCode(slug: string): string | undefined {
  if (slug === 'router') {
    return ROUTER_CODE;
  }
  return EXAMPLE_CODES[slug];
}

/**
 * Creates the Example detail page as a CompiledNode
 *
 * @param params - Page params including slug
 * @returns CompiledElementNode representing the example page
 */
export function createExamplePage(params: ExamplePageParams): CompiledElementNode {
  const { slug } = params;
  const currentPath = `/examples/${slug}`;

  // Get example data
  const exampleData = EXAMPLES_DATA[slug];
  const exampleCode = getExampleCode(slug);

  // Handle 404
  if (!exampleData || !exampleCode) {
    return createNotFoundPage(currentPath);
  }

  // Create layout components
  const header = createHeader({ currentPath });
  const footer = createFooter();

  // Create example page content
  const content = createExamplePageComponent({
    title: exampleData.title,
    description: exampleData.description,
    code: exampleCode,
    features: exampleData.features,
    playgroundUrl: `/playground?example=${slug}`,
  });

  // Create main element (no sidebar for examples)
  const main = el('main', { class: 'pt-[var(--header-height)]' }, [content]);

  // Create root div
  return el('div', { class: 'min-h-screen bg-background' }, [
    header,
    main,
    footer,
  ]);
}

/**
 * Returns all static paths for example pages
 *
 * @returns Array of StaticPath objects for static generation
 */
export function getStaticPaths(): StaticPath[] {
  return Object.keys(EXAMPLES_DATA).map((slug) => ({
    params: { slug },
  }));
}

export default createExamplePage;
