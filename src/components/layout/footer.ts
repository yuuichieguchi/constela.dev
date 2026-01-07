/**
 * Footer layout component (createFooter function)
 *
 * Creates a CompiledNode structure for the site footer.
 * Renders copyright text, GitHub link, and Documentation link.
 *
 * @module components/layout/footer
 */

import type { CompiledElementNode, CompiledNode, CompiledTextNode, CompiledExpression } from '@constela/compiler';
import { REPO_MAIN, REPO_DOCS } from '@/lib/config';

/**
 * Helper to create a literal expression
 */
function lit(value: string | number | boolean | null | unknown[]): CompiledExpression {
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
 * Creates the Footer component as a CompiledNode
 *
 * @returns CompiledElementNode representing the footer
 */
export function createFooter(): CompiledElementNode {
  const currentYear = new Date().getFullYear();

  // Create copyright text
  const copyrightText = el(
    'p',
    { class: 'text-sm text-muted-foreground' },
    [text(`© ${currentYear} Constela. All rights reserved.`)]
  );

  // Create "Built with Constela" text
  const builtWithText = el(
    'span',
    { class: 'text-xs text-muted-foreground sm:justify-self-center' },
    [text('Built with Constela')]
  );

  // Create GitHub link
  const githubLink = el(
    'a',
    {
      href: REPO_MAIN,
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'text-sm text-muted-foreground transition-colors hover:text-foreground',
    },
    [text('GitHub')]
  );

  // Create Documentation link
  const docsLink = el(
    'a',
    {
      href: REPO_DOCS,
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'text-sm text-muted-foreground transition-colors hover:text-foreground',
    },
    [text('Documentation')]
  );

  // Create links container
  const linksContainer = el(
    'div',
    { class: 'flex items-center justify-center gap-6 sm:justify-self-end' },
    [githubLink, docsLink]
  );

  // Create inner grid
  const innerGrid = el(
    'div',
    { class: 'grid items-center gap-4 text-center sm:grid-cols-3 sm:text-left' },
    [copyrightText, builtWithText, linksContainer]
  );

  // Create inner container
  const innerContainer = el(
    'div',
    { class: 'mx-auto max-w-7xl px-6 py-8' },
    [innerGrid]
  );

  // Create footer element
  const footer = el(
    'footer',
    { class: 'border-t border-border bg-background' },
    [innerContainer]
  );

  return footer;
}
