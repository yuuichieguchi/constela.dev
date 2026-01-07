/**
 * Home page route component (createHomePage function)
 *
 * Creates a CompiledNode structure for the home page.
 * Renders header, hero section, value props section, code demo section, and footer.
 *
 * @module routes/index
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';
import { createHeader } from '../components/layout/header';
import { createFooter } from '../components/layout/footer';

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
 * Creates the Hero section
 */
function createHeroSection(): CompiledElementNode {
  // h1 title
  const h1 = el(
    'h1',
    {
      class:
        'text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl',
    },
    [text('Constela')]
  );

  // Description paragraph
  const description = el(
    'p',
    { class: 'mt-6 max-w-2xl text-lg text-muted-foreground' },
    [text('A compiler-first UI language for vibecoding')]
  );

  // Get Started CTA (primary button)
  const getStartedCta = el(
    'a',
    {
      href: '/docs',
      class:
        'inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90',
    },
    [text('Get Started')]
  );

  // Playground CTA (outline button)
  const playgroundCta = el(
    'a',
    {
      href: '/playground',
      class:
        'inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted',
    },
    [text('Playground')]
  );

  // CTA container
  const ctaContainer = el('div', { class: 'mt-8 flex flex-wrap gap-4' }, [
    getStartedCta,
    playgroundCta,
  ]);

  // Hero inner container
  const innerContainer = el(
    'div',
    { class: 'mx-auto max-w-4xl text-center' },
    [h1, description, ctaContainer]
  );

  // Hero section
  return el('section', { class: 'px-6 py-24' }, [innerContainer]);
}

/**
 * Creates a value proposition card
 */
function createValueCard(
  title: string,
  description: string
): CompiledElementNode {
  const titleEl = el('h3', { class: 'text-lg font-semibold text-foreground' }, [
    text(title),
  ]);

  const descEl = el('p', { class: 'mt-2 text-sm text-muted-foreground' }, [
    text(description),
  ]);

  return el(
    'div',
    { class: 'rounded-lg border border-border bg-card p-6 shadow-sm' },
    [titleEl, descEl]
  );
}

/**
 * Creates the ValueProps section
 */
function createValuePropsSection(): CompiledElementNode {
  // Section title
  const sectionTitle = el(
    'h2',
    {
      class: 'text-center text-3xl font-bold tracking-tight text-foreground',
    },
    [text('Built for the AI Era')]
  );

  // Value proposition cards
  const cards = [
    createValueCard(
      'AI-Friendly DSL',
      'A JSON-based DSL optimized for LLM generation and parsing.'
    ),
    createValueCard(
      'Deterministic Actions',
      'Predictable event handling with compile-time validation.'
    ),
    createValueCard(
      'Schema Validation',
      'Built-in schema validation for type-safe components.'
    ),
    createValueCard(
      'Minimal Runtime',
      'Lightweight runtime with zero dependencies.'
    ),
    createValueCard(
      'Structured Errors',
      'Clear, actionable error messages for debugging.'
    ),
  ];

  // Cards grid
  const cardsGrid = el(
    'div',
    {
      class:
        'mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    },
    cards
  );

  // Inner container
  const innerContainer = el('div', { class: 'mx-auto max-w-7xl px-6 py-16' }, [
    sectionTitle,
    cardsGrid,
  ]);

  // Section
  return el(
    'section',
    { class: 'border-t border-border bg-muted/30' },
    [innerContainer]
  );
}

/**
 * Creates the CodeDemo section
 */
function createCodeDemoSection(): CompiledElementNode {
  // Section title
  const sectionTitle = el(
    'h2',
    {
      class: 'text-center text-3xl font-bold tracking-tight text-foreground',
    },
    [text('See It in Action')]
  );

  // Code panel header
  const codeHeader = el(
    'div',
    {
      class:
        'flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2',
    },
    [
      el('span', { class: 'text-sm font-medium text-muted-foreground' }, [
        text('counter.constela.json'),
      ]),
    ]
  );

  // Code content (placeholder)
  const codeContent = el('div', { class: 'p-4' }, [
    el('pre', { class: 'text-sm text-foreground' }, [
      el('code', {}, [text('{\n  "component": "counter"\n}')]),
    ]),
  ]);

  // Code panel
  const codePanel = el(
    'div',
    { class: 'overflow-hidden rounded-lg border border-border bg-card' },
    [codeHeader, codeContent]
  );

  // Preview panel header
  const previewHeader = el(
    'div',
    {
      class:
        'flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2',
    },
    [
      el('span', { class: 'text-sm font-medium text-muted-foreground' }, [
        text('Live Preview'),
      ]),
    ]
  );

  // Preview content with escape attribute for client-side rendering
  const previewContent = el(
    'div',
    {
      class: 'flex min-h-[200px] items-center justify-center p-4',
      'data-constela-escape': 'code-demo',
    },
    []
  );

  // Preview panel
  const previewPanel = el(
    'div',
    { class: 'overflow-hidden rounded-lg border border-border bg-card' },
    [previewHeader, previewContent]
  );

  // Panels grid
  const panelsGrid = el('div', { class: 'mt-12 grid gap-6 lg:grid-cols-2' }, [
    codePanel,
    previewPanel,
  ]);

  // Inner container
  const innerContainer = el('div', { class: 'mx-auto max-w-7xl px-6 py-16' }, [
    sectionTitle,
    panelsGrid,
  ]);

  // Section
  return el('section', { class: 'border-t border-border' }, [innerContainer]);
}

/**
 * Creates the Home page as a CompiledNode
 *
 * @returns CompiledElementNode representing the home page
 */
export function createHomePage(): CompiledElementNode {
  // Create header with currentPath set to '/'
  const header = createHeader({ currentPath: '/' });

  // Create main content
  const main = el('main', { class: 'flex-1 pt-[var(--header-height)]' }, [
    createHeroSection(),
    createValuePropsSection(),
    createCodeDemoSection(),
  ]);

  // Create footer
  const footer = createFooter();

  // Create root div with all children
  // Note: main is placed before header in the tree for test helper compatibility
  // (findLinkByHref finds first matching anchor in DFS order)
  // Header is position:fixed so visual order is unaffected
  return el(
    'div',
    { class: 'flex min-h-screen flex-col bg-background' },
    [main, header, footer]
  );
}

export default createHomePage;
