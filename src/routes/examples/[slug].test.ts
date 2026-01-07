/**
 * Test module for Example detail page (createExamplePage and getStaticPaths functions).
 *
 * Coverage:
 * - Module exports (createExamplePage, getStaticPaths)
 * - Page structure (root div, header, main, footer)
 * - Content rendering (h1 with example title, back link, source code, features)
 * - getStaticPaths (returns paths for all 4 examples)
 * - Edge cases (non-existent slug returns 404)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/routes/examples/[slug].ts does not exist yet
 * - createExamplePage and getStaticPaths functions are not implemented
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

describe('Example Detail Page (createExamplePage)', () => {
  // ==================== Module Exports ====================

  describe('module exports', () => {
    it('should export createExamplePage function', async () => {
      /**
       * Given: [slug].ts module
       * When: Importing the module
       * Then: Should export createExamplePage function
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const module = await import('./[slug]');
      expect(module).toHaveProperty('createExamplePage');
      expect(typeof module.createExamplePage).toBe('function');
    });

    it('should export getStaticPaths function', async () => {
      /**
       * Given: [slug].ts module
       * When: Importing the module
       * Then: Should export getStaticPaths function
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const module = await import('./[slug]');
      expect(module).toHaveProperty('getStaticPaths');
      expect(typeof module.getStaticPaths).toBe('function');
    });
  });

  // ==================== createExamplePage Structure ====================

  describe('createExamplePage structure', () => {
    it('should return a CompiledNode with kind "element"', async () => {
      /**
       * Given: createExamplePage function
       * When: Called with valid slug
       * Then: Should return a CompiledNode with kind "element"
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      expect(result).toHaveProperty('kind');
      expect(result.kind).toBe('element');
    });

    it('should have root div with "min-h-screen" class', async () => {
      /**
       * Given: createExamplePage function
       * When: Inspecting root element
       * Then: Should have div tag with min-h-screen class
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('div');
        expect(hasClass(result, 'min-h-screen')).toBe(true);
      }
    });

    it('should contain header element', async () => {
      /**
       * Given: createExamplePage function
       * When: Inspecting page structure
       * Then: Should contain header element
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const header = findElementByTag(result, 'header');
      expect(header).not.toBeNull();
    });

    it('should contain main element', async () => {
      /**
       * Given: createExamplePage function
       * When: Inspecting page structure
       * Then: Should contain main element
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
    });

    it('should contain footer element', async () => {
      /**
       * Given: createExamplePage function
       * When: Inspecting page structure
       * Then: Should contain footer element
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const footer = findElementByTag(result, 'footer');
      expect(footer).not.toBeNull();
    });
  });

  // ==================== Counter Example ====================

  describe('counter example page', () => {
    it('should contain h1 with "Counter" title', async () => {
      /**
       * Given: createExamplePage with slug "counter"
       * When: Inspecting page content
       * Then: Should contain h1 with "Counter" title
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('Counter');
      }
    });

    it('should contain "Back to Examples" link', async () => {
      /**
       * Given: createExamplePage with slug "counter"
       * When: Inspecting page content
       * Then: Should contain link back to examples
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const backLink = findLinkByHref(result, '/examples');
      expect(backLink).not.toBeNull();
      // Verify "Back to Examples" text exists somewhere in the page
      const pageText = getAllTextContent(result);
      expect(pageText).toContain('Back to Examples');
    });

    it('should contain "Source Code" section', async () => {
      /**
       * Given: createExamplePage with slug "counter"
       * When: Inspecting page content
       * Then: Should contain "Source Code" section
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Source Code');
    });

    it('should contain "Features Used" section', async () => {
      /**
       * Given: createExamplePage with slug "counter"
       * When: Inspecting page content
       * Then: Should contain "Features Used" section
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Features Used');
    });

    it('should contain "Try in Playground" link', async () => {
      /**
       * Given: createExamplePage with slug "counter"
       * When: Inspecting page content
       * Then: Should contain "Try in Playground" link
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'counter' });

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Try in Playground');
    });
  });

  // ==================== Todo List Example ====================

  describe('todo-list example page', () => {
    it('should contain h1 with "Todo List" title', async () => {
      /**
       * Given: createExamplePage with slug "todo-list"
       * When: Inspecting page content
       * Then: Should contain h1 with "Todo List" title
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'todo-list' });

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('Todo List');
      }
    });

    it('should contain "Back to Examples" link', async () => {
      /**
       * Given: createExamplePage with slug "todo-list"
       * When: Inspecting page content
       * Then: Should contain link back to examples
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'todo-list' });

      const backLink = findLinkByHref(result, '/examples');
      expect(backLink).not.toBeNull();
    });
  });

  // ==================== Fetch List Example ====================

  describe('fetch-list example page', () => {
    it('should contain h1 with "Fetch List" title', async () => {
      /**
       * Given: createExamplePage with slug "fetch-list"
       * When: Inspecting page content
       * Then: Should contain h1 with "Fetch List" title
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'fetch-list' });

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('Fetch List');
      }
    });

    it('should contain "Back to Examples" link', async () => {
      /**
       * Given: createExamplePage with slug "fetch-list"
       * When: Inspecting page content
       * Then: Should contain link back to examples
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'fetch-list' });

      const backLink = findLinkByHref(result, '/examples');
      expect(backLink).not.toBeNull();
    });
  });

  // ==================== Router Example ====================

  describe('router example page', () => {
    it('should contain h1 with "Router" title', async () => {
      /**
       * Given: createExamplePage with slug "router"
       * When: Inspecting page content
       * Then: Should contain h1 with "Router" title
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'router' });

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('Router');
      }
    });

    it('should contain "Back to Examples" link', async () => {
      /**
       * Given: createExamplePage with slug "router"
       * When: Inspecting page content
       * Then: Should contain link back to examples
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');
      const result = createExamplePage({ slug: 'router' });

      const backLink = findLinkByHref(result, '/examples');
      expect(backLink).not.toBeNull();
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
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[slug]');
      const result = getStaticPaths();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });

    it('should contain path for counter', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path for counter
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[slug]');
      const result = getStaticPaths();

      const counterPath = result.find(
        (path) => path.params.slug === 'counter'
      );
      expect(counterPath).toBeDefined();
    });

    it('should contain path for todo-list', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path for todo-list
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[slug]');
      const result = getStaticPaths();

      const todoPath = result.find(
        (path) => path.params.slug === 'todo-list'
      );
      expect(todoPath).toBeDefined();
    });

    it('should contain path for fetch-list', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path for fetch-list
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[slug]');
      const result = getStaticPaths();

      const fetchPath = result.find(
        (path) => path.params.slug === 'fetch-list'
      );
      expect(fetchPath).toBeDefined();
    });

    it('should contain path for router', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Should contain path for router
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[slug]');
      const result = getStaticPaths();

      const routerPath = result.find(
        (path) => path.params.slug === 'router'
      );
      expect(routerPath).toBeDefined();
    });

    it('should have params object in each path', async () => {
      /**
       * Given: getStaticPaths function
       * When: Inspecting returned paths
       * Then: Each path should have a params object
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { getStaticPaths } = await import('./[slug]');
      const result = getStaticPaths();

      for (const path of result) {
        expect(path).toHaveProperty('params');
        expect(typeof path.params).toBe('object');
        expect(path.params).toHaveProperty('slug');
      }
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should return 404 structure for non-existent slug', async () => {
      /**
       * Given: createExamplePage function
       * When: Called with non-existent slug
       * Then: Should return a 404-like structure or throw
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');

      // Either throws an error or returns a 404 page structure
      try {
        const result = createExamplePage({ slug: 'non-existent-example-xyz' });
        // If it returns a result, it should indicate 404
        const textContent = getAllTextContent(result);
        expect(textContent).toMatch(/404|not found/i);
      } catch (error) {
        // If it throws, that's also acceptable behavior
        expect(error).toBeDefined();
      }
    });

    it('should return consistent structure on multiple calls with same params', async () => {
      /**
       * Given: createExamplePage function
       * When: Called multiple times with same params
       * Then: Should return same structure (deterministic)
       *
       * RED PHASE: This test will FAIL - [slug].ts does not exist
       */
      const { createExamplePage } = await import('./[slug]');

      const result1 = createExamplePage({ slug: 'counter' });
      const result2 = createExamplePage({ slug: 'counter' });

      expect(result1.kind).toBe(result2.kind);
      if (isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
      }
    });
  });
});
