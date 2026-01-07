/**
 * Playground page route component (createPlaygroundPage function)
 *
 * Creates a CompiledNode structure for the playground page.
 * Renders header, main content with loading state, and footer.
 * The data-constela-escape="playground" attribute triggers the EscapeHandler
 * to mount the full Playground React component dynamically.
 *
 * @module routes/playground/index
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';
import { createHeader } from '@/components/layout/header';
import { createFooter } from '@/components/layout/footer';

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
 * Creates the Playground page as a CompiledNode
 *
 * @returns CompiledElementNode representing the playground page
 */
export function createPlaygroundPage(): CompiledElementNode {
  const currentPath = '/playground';

  // Create layout components
  const header = createHeader({ currentPath });
  const footer = createFooter();

  // Create loading spinner
  const spinner = el('div', {
    class:
      'mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto',
  });

  // Create loading text
  const loadingText = el('p', { class: 'text-sm text-muted-foreground' }, [
    text('Loading editor...'),
  ]);

  // Create loading center container
  const loadingCenter = el('div', { class: 'text-center' }, [
    spinner,
    loadingText,
  ]);

  // Create loading container with centered content
  const loadingContainer = el(
    'div',
    {
      class:
        'flex h-[calc(100vh-var(--header-height)-120px)] items-center justify-center',
    },
    [loadingCenter]
  );

  // Create escape container (triggers EscapeHandler for client-side mounting)
  const escapeContainer = el(
    'div',
    {
      'data-constela-escape': 'playground',
    },
    [loadingContainer]
  );

  // Create content wrapper
  const contentWrapper = el('div', { class: 'mx-auto max-w-7xl px-6 py-8' }, [
    escapeContainer,
  ]);

  // Create main element
  const main = el('main', { class: 'flex-1 pt-[var(--header-height)]' }, [
    contentWrapper,
  ]);

  // Create root div
  return el('div', { class: 'flex min-h-screen flex-col bg-background' }, [
    header,
    main,
    footer,
  ]);
}

export default createPlaygroundPage;
