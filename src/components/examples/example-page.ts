/**
 * ExamplePage component (createExamplePageComponent function)
 *
 * Creates a CompiledNode structure for an example detail page content.
 * Renders back link, title, description, source code, features, and playground link.
 *
 * @module components/examples/example-page
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';

export interface ExamplePageOptions {
  title: string;
  description: string;
  code: string;
  features: string[];
  playgroundUrl?: string;
}

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
 * Creates left arrow SVG (chevron-left)
 */
function createLeftArrow(): CompiledElementNode {
  return el(
    'svg',
    {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    },
    [el('path', { d: 'M15 19l-7-7 7-7' })]
  );
}

/**
 * Creates the ExamplePage content component as a CompiledNode
 *
 * @param options - Page options including title, description, code, features, and playgroundUrl
 * @returns CompiledElementNode representing the example page content
 */
export function createExamplePageComponent(
  options: ExamplePageOptions
): CompiledElementNode {
  const { title, description, code, features, playgroundUrl } = options;

  // Create back link
  const backLink = el(
    'a',
    {
      href: '/examples',
      class:
        'inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8',
    },
    [createLeftArrow(), text('Back to Examples')]
  );

  // Create title element
  const titleElement = el(
    'h1',
    { class: 'text-3xl font-bold text-foreground' },
    [text(title)]
  );

  // Create description element
  const descriptionElement = el(
    'p',
    { class: 'mt-4 text-lg text-muted-foreground' },
    [text(description)]
  );

  // Create "Source Code" section
  const sourceCodeTitle = el(
    'h2',
    { class: 'text-xl font-semibold text-foreground mt-8 mb-4' },
    [text('Source Code')]
  );

  const codeElement = el('code', { class: 'text-sm' }, [text(code)]);

  const preElement = el(
    'pre',
    {
      class:
        'overflow-x-auto rounded-lg border border-border bg-muted p-4 text-foreground',
    },
    [codeElement]
  );

  // Create "Features Used" section
  const featuresTitle = el(
    'h2',
    { class: 'text-xl font-semibold text-foreground mt-8 mb-4' },
    [text('Features Used')]
  );

  const featureBadges = features.map((feature) =>
    el(
      'span',
      {
        class:
          'rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary',
      },
      [text(feature)]
    )
  );

  const featuresContainer = el(
    'div',
    { class: 'flex flex-wrap gap-2' },
    featureBadges
  );

  // Build content children
  const contentChildren: CompiledNode[] = [
    backLink,
    titleElement,
    descriptionElement,
    sourceCodeTitle,
    preElement,
    featuresTitle,
    featuresContainer,
  ];

  // Add optional "Try in Playground" button
  if (playgroundUrl) {
    const playgroundButton = el(
      'a',
      {
        href: playgroundUrl,
        class:
          'mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors',
      },
      [text('Try in Playground')]
    );

    contentChildren.push(playgroundButton);
  }

  // Create content wrapper
  const content = el('div', { class: 'mx-auto max-w-4xl px-6 py-12' }, contentChildren);

  return content;
}
