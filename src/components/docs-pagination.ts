/**
 * DocsPagination layout component (createDocsPagination function)
 *
 * Creates a CompiledNode structure for prev/next navigation in docs pages.
 * Renders previous and next links with arrows and labels.
 *
 * @module components/docs-pagination
 */

import type { CompiledElementNode, CompiledNode, CompiledTextNode, CompiledExpression } from '@constela/compiler';
import type { NavItem } from '@/lib/navigation';

export interface DocsPaginationOptions {
  prev?: NavItem;
  next?: NavItem;
}

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
 * Creates left arrow SVG (chevron-left)
 */
function createLeftArrow(): CompiledElementNode {
  return el(
    'svg',
    {
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    },
    [el('path', { d: 'M15 19l-7-7 7-7' })]
  );
}

/**
 * Creates right arrow SVG (chevron-right)
 */
function createRightArrow(): CompiledElementNode {
  return el(
    'svg',
    {
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    },
    [el('path', { d: 'M9 5l7 7-7 7' })]
  );
}

/**
 * Creates the previous link element
 */
function createPrevLink(prev: NavItem): CompiledElementNode {
  const labelSpan = el(
    'span',
    { class: 'text-sm text-muted-foreground' },
    [text('Previous')]
  );

  const titleSpan = el(
    'span',
    { class: 'text-foreground font-medium group-hover:text-primary' },
    [text(prev.title)]
  );

  const contentWrapper = el(
    'div',
    { class: 'flex flex-col' },
    [labelSpan, titleSpan]
  );

  const arrowWrapper = el(
    'div',
    { class: 'flex items-center gap-2' },
    [createLeftArrow(), contentWrapper]
  );

  return el(
    'a',
    {
      href: prev.href,
      class: 'flex flex-col items-start group',
    },
    [arrowWrapper]
  );
}

/**
 * Creates the next link element
 */
function createNextLink(next: NavItem): CompiledElementNode {
  const labelSpan = el(
    'span',
    { class: 'text-sm text-muted-foreground' },
    [text('Next')]
  );

  const titleSpan = el(
    'span',
    { class: 'text-foreground font-medium group-hover:text-primary' },
    [text(next.title)]
  );

  const contentWrapper = el(
    'div',
    { class: 'flex flex-col items-end' },
    [labelSpan, titleSpan]
  );

  const arrowWrapper = el(
    'div',
    { class: 'flex items-center gap-2' },
    [contentWrapper, createRightArrow()]
  );

  return el(
    'a',
    {
      href: next.href,
      class: 'flex flex-col items-end ml-auto group',
    },
    [arrowWrapper]
  );
}

/**
 * Creates the DocsPagination component as a CompiledNode
 *
 * @param options - Pagination options including prev and next NavItems
 * @returns CompiledElementNode representing the pagination, or null if neither prev nor next is provided
 */
export function createDocsPagination(options: DocsPaginationOptions): CompiledElementNode | null {
  const { prev, next } = options;

  // Return null if neither prev nor next is provided
  if (!prev && !next) {
    return null;
  }

  const children: CompiledNode[] = [];

  if (prev) {
    children.push(createPrevLink(prev));
  }

  if (next) {
    children.push(createNextLink(next));
  }

  return el(
    'nav',
    {
      class: 'border-t border-border mt-12 pt-6 flex justify-between',
    },
    children
  );
}
