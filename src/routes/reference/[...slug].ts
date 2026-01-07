/**
 * Reference page route component (createReferencePage function)
 *
 * Creates a CompiledNode structure for reference pages.
 * Renders header, sidebar, main content with MDX, and footer.
 *
 * @module routes/reference/[...slug]
 */

import type {
  CompiledElementNode,
  CompiledNode,
  CompiledTextNode,
  CompiledExpression,
} from '@constela/compiler';
import { createHeader } from '@/components/layout/header';
import { createSidebar } from '@/components/layout/sidebar';
import { createFooter } from '@/components/layout/footer';
import { createDocsPagination } from '@/components/docs-pagination';
import { getDocBySlug, getAllDocSlugs, compileDocToConstela } from '@/lib/mdx';
import { referenceNavigation, getPagination } from '@/lib/navigation';

export interface ReferencePageParams {
  slug?: string[];
}

export interface StaticPath {
  params: { slug?: string[] };
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
 * Creates a 404 not found page structure
 */
function createNotFoundPage(currentPath: string): CompiledElementNode {
  const header = createHeader({ currentPath });
  const sidebar = createSidebar({ currentPath, navigation: referenceNavigation });
  const footer = createFooter();

  const notFoundContent = el(
    'div',
    { class: 'not-found mx-auto max-w-4xl px-6 py-12 text-center' },
    [
      el('h1', { class: 'text-4xl font-bold text-foreground' }, [
        text('404'),
      ]),
      el('p', { class: 'mt-4 text-muted-foreground' }, [
        text('Page not found'),
      ]),
    ]
  );

  const main = el(
    'main',
    { class: 'pt-[var(--header-height)] lg:pl-[var(--sidebar-width)]' },
    [notFoundContent]
  );

  const footerWrapper = el('div', { class: 'lg:pl-[var(--sidebar-width)]' }, [
    footer,
  ]);

  return el('div', { class: 'min-h-screen bg-background' }, [
    header,
    sidebar,
    main,
    footerWrapper,
  ]);
}

/**
 * Creates the Reference page as a CompiledNode
 *
 * @param params - Page params including optional slug array
 * @returns CompiledElementNode representing the reference page
 */
export async function createReferencePage(
  params: ReferencePageParams
): Promise<CompiledElementNode> {
  // Normalize slug: undefined or empty array -> []
  const slug = params.slug ?? [];
  const slugPath = slug.length === 0 ? '' : '/' + slug.join('/');
  const currentPath = '/reference' + slugPath;

  // Fetch document content
  const doc = await getDocBySlug('reference', slug);

  // Handle 404
  if (!doc) {
    return createNotFoundPage(currentPath);
  }

  // Compile MDX content to Constela
  const mdxContent = await compileDocToConstela(doc.content);

  // Get pagination
  const { prev, next } = getPagination(currentPath, referenceNavigation);

  // Create layout components
  const header = createHeader({ currentPath });
  const sidebar = createSidebar({ currentPath, navigation: referenceNavigation });
  const footer = createFooter();

  // Create article content
  const articleChildren: CompiledNode[] = [
    el('h1', { class: 'text-3xl font-bold text-foreground' }, [
      text(doc.frontmatter.title),
    ]),
  ];

  if (doc.frontmatter.description) {
    articleChildren.push(
      el('p', { class: 'lead mt-4 text-lg text-muted-foreground' }, [
        text(doc.frontmatter.description),
      ])
    );
  }

  // Add MDX content
  articleChildren.push(mdxContent as CompiledNode);

  const article = el(
    'article',
    { class: 'prose prose-slate dark:prose-invert max-w-none' },
    articleChildren
  );

  // Create main content wrapper
  const contentWrapper = el('div', { class: 'mx-auto max-w-4xl px-6 py-12' }, [
    article,
  ]);

  // Add pagination if available
  const pagination = createDocsPagination({ prev, next });
  if (pagination) {
    contentWrapper.children?.push(pagination);
  }

  // Create main element
  const main = el(
    'main',
    { class: 'pt-[var(--header-height)] lg:pl-[var(--sidebar-width)]' },
    [contentWrapper]
  );

  // Create footer wrapper
  const footerWrapper = el('div', { class: 'lg:pl-[var(--sidebar-width)]' }, [
    footer,
  ]);

  // Create root div
  return el('div', { class: 'min-h-screen bg-background' }, [
    header,
    sidebar,
    main,
    footerWrapper,
  ]);
}

/**
 * Returns all static paths for reference pages
 *
 * @returns Array of StaticPath objects for static generation
 */
export async function getStaticPaths(): Promise<StaticPath[]> {
  const slugs = await getAllDocSlugs('reference');

  return slugs.map((slug) => ({
    params: {
      slug: slug.length === 0 ? undefined : slug,
    },
  }));
}

export default createReferencePage;
