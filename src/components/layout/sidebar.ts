/**
 * Sidebar layout component (createSidebar function)
 *
 * Creates a CompiledNode structure for the site sidebar.
 * Renders navigation sections with titles and links.
 *
 * @module components/layout/sidebar
 */

import type { CompiledElementNode, CompiledNode, CompiledTextNode, CompiledExpression } from '@constela/compiler';
import type { NavSection } from '@/lib/navigation';

export interface SidebarOptions {
  currentPath: string;
  navigation: NavSection[];
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
 * Creates the Sidebar component as a CompiledNode
 *
 * @param options - Sidebar options including currentPath and navigation
 * @returns CompiledElementNode representing the sidebar
 */
export function createSidebar(options: SidebarOptions): CompiledElementNode {
  const { currentPath, navigation } = options;

  // Normalize path for comparison (remove trailing slash)
  const normalizedPath = currentPath.endsWith('/') && currentPath !== '/'
    ? currentPath.slice(0, -1)
    : currentPath;

  // Check if a path is active (exact match)
  const isActive = (href: string): boolean => normalizedPath === href;

  // Create navigation sections
  const sections = navigation.map((section) => {
    // Create section title
    const sectionTitle = el(
      'h3',
      { class: 'mb-2 text-sm font-semibold text-foreground' },
      [text(section.title)]
    );

    // Create list items for each nav item
    const listItems = section.items.map((item) => {
      const active = isActive(item.href);
      const linkClass = active
        ? 'block rounded-md px-3 py-2 text-sm transition-colors bg-primary/10 font-medium text-primary'
        : 'block rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground';

      // Create link content (title + optional badge)
      const linkChildren: CompiledNode[] = [text(item.title)];

      if (item.badge) {
        const badge = el(
          'span',
          {
            class:
              'ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary',
          },
          [text(item.badge)]
        );
        linkChildren.push(badge);
      }

      const link = el('a', { href: item.href, class: linkClass }, linkChildren);

      return el('li', {}, [link]);
    });

    // Create ul for items
    const ul = el('ul', { class: 'space-y-1' }, listItems);

    // Create section container
    return el('div', {}, [sectionTitle, ul]);
  });

  // Create nav element
  const navElement = el('nav', { class: 'space-y-6' }, sections);

  // Create aside element
  const aside = el(
    'aside',
    {
      class:
        'fixed left-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] overflow-y-auto border-r border-border bg-background p-6 lg:block',
    },
    [navElement]
  );

  return aside;
}
