/**
 * Test module for Examples index page (createExamplesIndexPage function).
 *
 * Coverage:
 * - Module exports (createExamplesIndexPage)
 * - Page structure (root div, header, main, footer)
 * - Content rendering (h1 with "Examples" title)
 * - Example cards (4 cards with title, description, href)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/routes/examples/index.ts does not exist yet
 * - createExamplesIndexPage function is not implemented
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

describe('Examples Index Page (createExamplesIndexPage)', () => {
  // ==================== Module Exports ====================

  describe('module exports', () => {
    it('should export createExamplesIndexPage function', async () => {
      /**
       * Given: index.ts module
       * When: Importing the module
       * Then: Should export createExamplesIndexPage function
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const module = await import('./index');
      expect(module).toHaveProperty('createExamplesIndexPage');
      expect(typeof module.createExamplesIndexPage).toBe('function');
    });
  });

  // ==================== Page Structure ====================

  describe('page structure', () => {
    it('should return a CompiledNode with kind "element"', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Called
       * Then: Should return a CompiledNode with kind "element"
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      expect(result).toHaveProperty('kind');
      expect(result.kind).toBe('element');
    });

    it('should have root div with "min-h-screen" class', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting root element
       * Then: Should have div tag with min-h-screen class
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('div');
        expect(hasClass(result, 'min-h-screen')).toBe(true);
      }
    });

    it('should contain header element', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting page structure
       * Then: Should contain header element
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const header = findElementByTag(result, 'header');
      expect(header).not.toBeNull();
    });

    it('should contain main element', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting page structure
       * Then: Should contain main element
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
    });

    it('should contain footer element', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting page structure
       * Then: Should contain footer element
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const footer = findElementByTag(result, 'footer');
      expect(footer).not.toBeNull();
    });
  });

  // ==================== Content Rendering ====================

  describe('content rendering', () => {
    it('should contain h1 with "Examples" text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting page content
       * Then: Should contain h1 with "Examples" title
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('Examples');
      }
    });

    it('should contain 4 example cards', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting page content
       * Then: Should contain 4 example cards (links)
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const expectedHrefs = [
        '/examples/counter',
        '/examples/todo-list',
        '/examples/fetch-list',
        '/examples/router',
      ];

      for (const href of expectedHrefs) {
        const link = findLinkByHref(result, href);
        expect(link).not.toBeNull();
      }
    });
  });

  // ==================== Example Cards ====================

  describe('example cards', () => {
    it('should have link to /examples/counter', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting example cards
       * Then: Should contain link to counter example
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/counter');
      expect(link).not.toBeNull();
    });

    it('should have link to /examples/todo-list', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting example cards
       * Then: Should contain link to todo-list example
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/todo-list');
      expect(link).not.toBeNull();
    });

    it('should have link to /examples/fetch-list', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting example cards
       * Then: Should contain link to fetch-list example
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/fetch-list');
      expect(link).not.toBeNull();
    });

    it('should have link to /examples/router', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting example cards
       * Then: Should contain link to router example
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/router');
      expect(link).not.toBeNull();
    });

    it('should have Counter card with title text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting counter card
       * Then: Should contain "Counter" title text
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/counter');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('Counter');
      }
    });

    it('should have Counter card with description text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting counter card
       * Then: Should contain counter description
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/counter');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('increment');
      }
    });

    it('should have Todo List card with title text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting todo-list card
       * Then: Should contain "Todo List" title text
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/todo-list');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('Todo List');
      }
    });

    it('should have Todo List card with description text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting todo-list card
       * Then: Should contain todo-list description
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/todo-list');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('todo items');
      }
    });

    it('should have Fetch List card with title text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting fetch-list card
       * Then: Should contain "Fetch List" title text
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/fetch-list');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('Fetch List');
      }
    });

    it('should have Fetch List card with description text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting fetch-list card
       * Then: Should contain fetch-list description
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/fetch-list');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('API');
      }
    });

    it('should have Router card with title text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting router card
       * Then: Should contain "Router" title text
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/router');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('Router');
      }
    });

    it('should have Router card with description text', async () => {
      /**
       * Given: createExamplesIndexPage function
       * When: Inspecting router card
       * Then: Should contain router description
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createExamplesIndexPage } = await import('./index');
      const result = createExamplesIndexPage();

      const link = findLinkByHref(result, '/examples/router');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('routing');
      }
    });
  });
});
