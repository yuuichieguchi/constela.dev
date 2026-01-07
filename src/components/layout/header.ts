/**
 * Header layout component (createHeader function)
 *
 * Creates a CompiledNode structure for the site header.
 * Renders logo, navigation links, GitHub link, theme toggle, and mobile menu button.
 *
 * @module components/layout/header
 */

import type { CompiledElementNode, CompiledNode, CompiledTextNode, CompiledExpression } from '@constela/compiler';
import { topNav } from '@/lib/navigation';
import { REPO_MAIN } from '@/lib/config';

export interface HeaderOptions {
  currentPath: string;
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
 * Creates the Header component as a CompiledNode
 *
 * @param options - Header options including currentPath
 * @returns CompiledElementNode representing the header
 */
export function createHeader(options: HeaderOptions): CompiledElementNode {
  const { currentPath } = options;

  // Check if a path is active (startsWith match)
  const isActive = (href: string): boolean => currentPath.startsWith(href);

  // Create navigation links
  const navLinks = topNav.map((item) => {
    const active = isActive(item.href);
    const linkClass = active
      ? 'text-sm transition-colors font-medium text-foreground'
      : 'text-sm transition-colors text-muted-foreground hover:text-foreground';

    return el('a', { href: item.href, class: linkClass }, [text(item.title)]);
  });

  // Create mobile menu button
  const mobileMenuButton = el(
    'button',
    {
      class:
        'flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted md:hidden',
      'aria-label': 'Open menu',
    },
    [
      el(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          class: 'h-5 w-5',
        },
        [
          el('line', { x1: '3', y1: '12', x2: '21', y2: '12' }),
          el('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
          el('line', { x1: '3', y1: '18', x2: '21', y2: '18' }),
        ]
      ),
    ]
  );

  // Create logo link
  const logoLink = el(
    'a',
    { href: '/', class: 'text-xl font-bold text-foreground' },
    [text('Constela')]
  );

  // Create nav element with links
  const navElement = el(
    'nav',
    { class: 'hidden items-center gap-6 md:flex' },
    navLinks
  );

  // Create GitHub link
  const githubLink = el(
    'a',
    {
      href: REPO_MAIN,
      target: '_blank',
      rel: 'noopener noreferrer',
      class:
        'flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted',
      'aria-label': 'GitHub repository',
    },
    [
      el(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'currentColor',
          class: 'h-5 w-5',
        },
        [
          el('path', {
            d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
          }),
        ]
      ),
    ]
  );

  // Create theme toggle button
  const themeToggleButton = el(
    'button',
    {
      'data-constela-escape': 'theme',
      class:
        'flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted',
      'aria-label': 'Toggle theme',
    },
    [
      el(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: 'h-5 w-5',
        },
        [
          el('circle', { cx: '12', cy: '12', r: '5' }),
          el('path', {
            d: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
          }),
        ]
      ),
    ]
  );

  // Create left section (mobile menu + logo + nav)
  const leftSection = el(
    'div',
    { class: 'flex items-center gap-4' },
    [mobileMenuButton, logoLink, navElement]
  );

  // Create right section (GitHub + theme toggle)
  const rightSection = el(
    'div',
    { class: 'flex items-center gap-3' },
    [githubLink, themeToggleButton]
  );

  // Create inner container
  const innerContainer = el(
    'div',
    { class: 'mx-auto flex h-full max-w-7xl items-center justify-between px-6' },
    [leftSection, rightSection]
  );

  // Create header element
  const header = el(
    'header',
    {
      class:
        'fixed top-0 left-0 right-0 z-40 h-[var(--header-height)] border-b border-transparent bg-background',
    },
    [innerContainer]
  );

  return header;
}
