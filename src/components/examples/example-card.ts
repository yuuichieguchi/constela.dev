/**
 * ExampleCard component (createExampleCard function)
 *
 * Creates a CompiledNode structure for an example card link.
 * Renders title, description, and optional feature badges.
 *
 * @module components/examples/example-card
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';

export interface ExampleCardOptions {
  title: string;
  description: string;
  href: string;
  features?: string[];
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
 * Creates an ExampleCard component as a CompiledNode
 *
 * @param options - Card options including title, description, href, and optional features
 * @returns CompiledElementNode representing the example card
 */
export function createExampleCard(options: ExampleCardOptions): CompiledElementNode {
  const { title, description, href, features } = options;

  // Create title element
  const titleElement = el(
    'h3',
    { class: 'font-semibold text-foreground group-hover:text-primary' },
    [text(title)]
  );

  // Create description element
  const descriptionElement = el(
    'p',
    { class: 'mt-2 text-sm text-muted-foreground' },
    [text(description)]
  );

  // Build card children
  const cardChildren: CompiledNode[] = [titleElement, descriptionElement];

  // Add optional features list
  if (features && features.length > 0) {
    const featureBadges = features.map((feature) =>
      el(
        'span',
        { class: 'rounded-full bg-muted px-2.5 py-0.5 text-xs' },
        [text(feature)]
      )
    );

    const featuresContainer = el(
      'div',
      { class: 'mt-4 flex flex-wrap gap-2' },
      featureBadges
    );

    cardChildren.push(featuresContainer);
  }

  // Create link wrapper
  const card = el(
    'a',
    {
      href,
      class:
        'group block rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary hover:bg-muted/50',
    },
    cardChildren
  );

  return card;
}
