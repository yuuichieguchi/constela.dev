/**
 * Test module for Reference page (createReferencePage and getStaticPaths functions).
 *
 * Coverage:
 * - Module exports (createReferencePage, getStaticPaths)
 * - Page structure (root div, header, sidebar, main, footer)
 * - Content rendering (h1 with frontmatter title, pagination)
 * - getStaticPaths (returns array of paths, contains index and nested slugs)
 * - Edge cases (empty slug, non-existent slug)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/routes/reference/[...slug].ts does not exist yet
 * - createReferencePage and getStaticPaths functions are not implemented
 */

import { describe, it, expect } from 'vitest';
import type {
  CompiledNode,
  CompiledElementNode,
  CompiledExpression,
} from '@constela/compiler';

// ==================== Helper Functions ====================

/**
 * Type guard to check if a CompiledNode is an element node
 */
function isElementNode(node: CompiledNode): node is CompiledElementNode {
  return node.kind === 'element';
}

/**
 * Check if a node's class contains a specific substring
 */
function hasClass(node: CompiledElementNode, className: string): boolean {
  const classAttr = node.props?.class;
  if (!classAttr) return false;
  if ('expr' in classAttr && classAttr.expr === 'lit' && typeof classAttr.value === 'string') {
    return classAttr.value.includes(className);
  }
  return false;
}

/**
 * Get class string from node
 */
function getClassString(node: CompiledElementNode): string {
  const classAttr = node.props?.class;
  if (!classAttr) return '';
  if ('expr' in classAttr && classAttr.expr === 'lit' && typeof classAttr.value === 'string') {
    return classAttr.value;
  }
  return '';
}

/**
 * Recursively find all elements with matching tag in the view tree
 */
function findElementsByTag(
  node: CompiledNode,
  tag: string
): CompiledElementNode[] {
  const results: CompiledElementNode[] = [];

  if (isElementNode(node)) {
    if (node.tag === tag) {
      results.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        results.push(...findElementsByTag(child, tag));
      }
    }
  }

  return results;
}

/**
 * Find first element with matching tag
 */
function findElementByTag(
  node: CompiledNode,
  tag: string
): CompiledElementNode | null {
  const elements = findElementsByTag(node, tag);
  return elements[0] ?? null;
}

/**
 * Find element by attribute value
 */
function findElementByAttribute(
  node: CompiledNode,
  attr: string,
  value: string
): CompiledElementNode | null {
  if (isElementNode(node)) {
    const attrValue = node.props?.[attr];
    if (attrValue && 'expr' in attrValue && attrValue.expr === 'lit' && attrValue.value === value) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findElementByAttribute(child, attr, value);
        if (found) return found;
      }
    }
  }
  return null;
}

/**
 * Find all anchor elements with specific href
 */
function findLinkByHref(
  node: CompiledNode,
  href: string
): CompiledElementNode | null {
  const anchors = findElementsByTag(node, 'a');
  for (const anchor of anchors) {
    const hrefAttr = anchor.props?.href;
    if (hrefAttr && 'expr' in hrefAttr && hrefAttr.expr === 'lit' && hrefAttr.value === href) {
      return anchor;
    }
  }
  return null;
}

/**
 * Get text content from element children (direct only)
 */
function getTextContent(node: CompiledElementNode): string {
  if (!node.children) return '';

  const texts: string[] = [];
  for (const child of node.children) {
    if (child.kind === 'text') {
      const valueExpr = child.value as CompiledExpression;
      if (valueExpr.expr === 'lit' && typeof valueExpr.value === 'string') {
        texts.push(valueExpr.value);
      }
    }
  }
  return texts.join('');
}

/**
 * Get all text content recursively from node tree
 */
function getAllTextContent(node: CompiledNode): string {
  const texts: string[] = [];

  function collectTexts(n: CompiledNode) {
    if (n.kind === 'text') {
      const valueExpr = n.value as CompiledExpression;
      if (valueExpr.expr === 'lit' && typeof valueExpr.value === 'string') {
        texts.push(valueExpr.value);
      }
    } else if (isElementNode(n) && n.children) {
      for (const child of n.children) {
        collectTexts(child);
      }
    }
  }

  collectTexts(node);
  return texts.join(' ');
}

/**
 * Find element containing specific text
 */
function findElementByText(
  node: CompiledNode,
  text: string,
  tag?: string
): CompiledElementNode | null {
  if (isElementNode(node)) {
    if (!tag || node.tag === tag) {
      const content = getAllTextContent(node);
      if (content.includes(text)) {
        // Check if this is the most specific element
        if (node.children) {
          for (const child of node.children) {
            const found = findElementByText(child, text, tag);
            if (found) return found;
          }
        }
        return node;
      }
    } else if (node.children) {
      for (const child of node.children) {
        const found = findElementByText(child, text, tag);
        if (found) return found;
      }
    }
  }
  return null;
}

describe('Reference Page (createReferencePage)', () => {
  // ==================== Module Exports ====================

  describe('module exports', () => {
    it('should export createReferencePage function', async () => {
      /**
       * Given: [...slug].ts module
       * When: Importing the module
       * Then: Should export createReferencePage function
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const module = await import('./[...slug]');
      expect(module).toHaveProperty('createReferencePage');
      expect(typeof module.createReferencePage).toBe('function');
    });

    it('should export getStaticPaths function', async () => {
      /**
       * Given: [...slug].ts module
       * When: Importing the module
       * Then: Should export getStaticPaths function
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const module = await import('./[...slug]');
      expect(module).toHaveProperty('getStaticPaths');
      expect(typeof module.getStaticPaths).toBe('function');
    });
  });

  // ==================== createReferencePage Structure ====================

  describe('createReferencePage structure', () => {
    it('should return a CompiledNode with kind "element"', async () => {
      /**
       * Given: createReferencePage function
       * When: Called with valid params
       * Then: Should return a CompiledNode with kind "element"
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      expect(result).toHaveProperty('kind');
      expect(result.kind).toBe('element');
    });

    it('should have root div with "min-h-screen" class', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting root element
       * Then: Should have div tag with min-h-screen class
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('div');
        expect(hasClass(result, 'min-h-screen')).toBe(true);
      }
    });

    it('should contain header element', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain header element
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const header = findElementByTag(result, 'header');
      expect(header).not.toBeNull();
    });

    it('should contain aside (sidebar) element', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain aside element for sidebar
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const aside = findElementByTag(result, 'aside');
      expect(aside).not.toBeNull();
    });

    it('should contain main element', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain main element
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
    });

    it('should contain footer element', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain footer element
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const footer = findElementByTag(result, 'footer');
      expect(footer).not.toBeNull();
    });

    it('should have main with "pt-[var(--header-height)]" class', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting main element
       * Then: Should have header-height padding-top class
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
      if (main) {
        expect(hasClass(main, 'pt-[var(--header-height)]')).toBe(true);
      }
    });

    it('should have main with "lg:pl-[var(--sidebar-width)]" class', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting main element
       * Then: Should have sidebar-width padding-left class for large screens
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
      if (main) {
        expect(hasClass(main, 'lg:pl-[var(--sidebar-width)]')).toBe(true);
      }
    });
  });

  // ==================== Content Rendering ====================

  describe('content rendering', () => {
    it('should contain article element', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain article element for content
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const article = findElementByTag(result, 'article');
      expect(article).not.toBeNull();
    });

    it('should contain h1 with frontmatter title for index page', async () => {
      /**
       * Given: createReferencePage with undefined slug (index page)
       * When: Inspecting article content
       * Then: Should contain h1 with "DSL Root Schema" title from frontmatter
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('DSL Root Schema');
      }
    });

    it('should contain h1 with frontmatter title for nested slug', async () => {
      /**
       * Given: createReferencePage with ['nodes'] slug
       * When: Inspecting article content
       * Then: Should contain h1 with "View Nodes" title from frontmatter
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: ['nodes'] });

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('View Nodes');
      }
    });

    it('should contain pagination navigation', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain nav element for pagination
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const navElements = findElementsByTag(result, 'nav');
      // Should have at least one nav element for pagination (separate from sidebar nav)
      expect(navElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should contain pagination nav with border-t class', async () => {
      /**
       * Given: createReferencePage function
       * When: Inspecting page structure
       * Then: Should contain nav with border-t class for pagination
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = await createReferencePage({ slug: undefined });

      const navElements = findElementsByTag(result, 'nav');
      const paginationNav = navElements.find((nav) => hasClass(nav, 'border-t'));
      expect(paginationNav).toBeDefined();
    });
  });

  // ==================== getStaticPaths ====================

  describe('getStaticPaths', () => {
    it('should return an array of paths', async () => {
      /**
       * Given: getStaticPaths function
       * When: Called
       * Then: Should return an array
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[...slug]');
      const result = await getStaticPaths();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should contain path for index (undefined slug)', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path with undefined slug for index page
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[...slug]');
      const result = await getStaticPaths();

      const indexPath = result.find(
        (path) => path.params.slug === undefined || path.params.slug?.length === 0
      );
      expect(indexPath).toBeDefined();
    });

    it('should contain paths for nested slugs', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain paths with nested slug arrays
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[...slug]');
      const result = await getStaticPaths();

      // Should have paths like ['nodes'], ['expressions'], etc.
      const nestedPaths = result.filter(
        (path) => path.params.slug && path.params.slug.length > 0
      );
      expect(nestedPaths.length).toBeGreaterThan(0);
    });

    it('should contain path for nodes slug', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path for ['nodes']
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[...slug]');
      const result = await getStaticPaths();

      const nodesPath = result.find(
        (path) =>
          path.params.slug &&
          path.params.slug.length === 1 &&
          path.params.slug[0] === 'nodes'
      );
      expect(nodesPath).toBeDefined();
    });

    it('should contain path for expressions slug', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path for ['expressions']
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[...slug]');
      const result = await getStaticPaths();

      const expressionsPath = result.find(
        (path) =>
          path.params.slug &&
          path.params.slug.length === 1 &&
          path.params.slug[0] === 'expressions'
      );
      expect(expressionsPath).toBeDefined();
    });

    it('should have params object in each path', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Each path should have a params object
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[...slug]');
      const result = await getStaticPaths();

      for (const path of result) {
        expect(path).toHaveProperty('params');
        expect(typeof path.params).toBe('object');
      }
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle empty slug (index page)', async () => {
      /**
       * Given: createReferencePage function
       * When: Called with undefined slug
       * Then: Should render index page without error
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');

      await expect(createReferencePage({ slug: undefined })).resolves.toBeDefined();
    });

    it('should handle empty array slug (index page)', async () => {
      /**
       * Given: createReferencePage function
       * When: Called with empty array slug
       * Then: Should render index page without error
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');

      await expect(createReferencePage({ slug: [] })).resolves.toBeDefined();
    });

    it('should return 404 structure for non-existent slug', async () => {
      /**
       * Given: createReferencePage function
       * When: Called with non-existent slug
       * Then: Should return a 404-like structure or throw
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');

      // Either throws an error or returns a 404 page structure
      try {
        const result = await createReferencePage({ slug: ['non-existent-page-xyz'] });
        // If it returns a result, it should indicate 404
        const textContent = getAllTextContent(result);
        expect(textContent).toMatch(/404|not found/i);
      } catch (error) {
        // If it throws, that's also acceptable behavior
        expect(error).toBeDefined();
      }
    });

    it('should be an async function (returns Promise)', async () => {
      /**
       * Given: createReferencePage function
       * When: Called
       * Then: Should return a Promise
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');
      const result = createReferencePage({ slug: undefined });

      expect(result).toBeInstanceOf(Promise);
    });

    it('should return consistent structure on multiple calls with same params', async () => {
      /**
       * Given: createReferencePage function
       * When: Called multiple times with same params
       * Then: Should return same structure (deterministic)
       *
       * RED PHASE: This test will FAIL - [...slug].ts does not exist
       */
      const { createReferencePage } = await import('./[...slug]');

      const result1 = await createReferencePage({ slug: undefined });
      const result2 = await createReferencePage({ slug: undefined });

      expect(result1.kind).toBe(result2.kind);
      if (isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
      }
    });
  });
});
