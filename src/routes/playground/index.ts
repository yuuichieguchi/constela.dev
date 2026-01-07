/**
 * Playground page route component (createPlaygroundPage function)
 *
 * Creates a CompiledNode structure for the playground page.
 * Renders header, main content with full playground UI, and footer.
 * The data-constela-escape="playground" attribute triggers the EscapeHandler
 * for client-side interactivity (validate, run, etc.).
 * The data-constela-escape="monaco" attribute triggers the Monaco editor.
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
 * Creates the play icon SVG for the Run button
 */
function createPlayIcon(): CompiledElementNode {
  return el(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'h-4 w-4',
    },
    [el('polygon', { points: '5 3 19 12 5 21 5 3' })]
  );
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

  // Create page title
  const title = el('h1', { class: 'text-2xl font-bold text-foreground' }, [
    text('Playground'),
  ]);

  // Create Validate button
  const validateBtn = el(
    'button',
    {
      id: 'validate-btn',
      class:
        'rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80',
    },
    [text('Validate')]
  );

  // Create Run button
  const runBtn = el(
    'button',
    {
      id: 'run-btn',
      class:
        'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90',
    },
    [createPlayIcon(), text('Run')]
  );

  // Create button container
  const buttonContainer = el('div', { class: 'flex items-center gap-2' }, [
    validateBtn,
    runBtn,
  ]);

  // Create header row
  const headerRow = el('div', { class: 'flex items-center justify-between' }, [
    title,
    buttonContainer,
  ]);

  // Create editor panel header
  const editorPanelHeader = el(
    'div',
    {
      class:
        'flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2',
    },
    [
      el('span', { class: 'text-sm font-medium text-muted-foreground' }, [
        text('Editor'),
      ]),
    ]
  );

  // Create editor container (monaco will mount here)
  const editorContainer = el('div', {
    id: 'editor-container',
    'data-constela-escape': 'monaco',
    class: 'h-[calc(100%-41px)]',
  });

  // Create editor panel
  const editorPanel = el(
    'div',
    { class: 'overflow-hidden rounded-lg border border-border bg-card' },
    [editorPanelHeader, editorContainer]
  );

  // Create preview panel header
  const previewPanelHeader = el(
    'div',
    {
      class:
        'flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2',
    },
    [
      el('span', { class: 'text-sm font-medium text-muted-foreground' }, [
        text('Preview'),
      ]),
    ]
  );

  // Create preview container
  const previewContainer = el('div', {
    id: 'preview-container',
    class: 'h-[calc(100%-41px)] overflow-auto p-4',
  });

  // Create preview panel
  const previewPanel = el(
    'div',
    { class: 'overflow-hidden rounded-lg border border-border bg-card' },
    [previewPanelHeader, previewContainer]
  );

  // Create editor/preview grid
  const editorPreviewGrid = el(
    'div',
    { class: 'grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2' },
    [editorPanel, previewPanel]
  );

  // Create message container (for errors/success)
  const messageContainer = el('div', { id: 'message-container' });

  // Create playground content container
  const playgroundContent = el(
    'div',
    { class: 'flex h-[calc(100vh-var(--header-height)-120px)] flex-col gap-4' },
    [headerRow, editorPreviewGrid, messageContainer]
  );

  // Create escape container (triggers EscapeHandler for client-side logic)
  const escapeContainer = el(
    'div',
    {
      'data-constela-escape': 'playground',
    },
    [playgroundContent]
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
