/**
 * Test module for Home page (createHomePage function).
 *
 * Coverage:
 * - Function signature and return type
 * - Page structure (root div, header, main, footer)
 * - Hero section (title, description, CTA buttons)
 * - ValueProps section (title, 5 value proposition cards)
 * - CodeDemo section (code panel, preview panel, escape attribute)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/routes/index.ts does not exist yet
 * - createHomePage function is not implemented
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

describe('Home Page (createHomePage)', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export createHomePage function', async () => {
      /**
       * Given: index.ts module
       * When: Importing the module
       * Then: Should export createHomePage function
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const module = await import('./index');
      expect(module).toHaveProperty('createHomePage');
      expect(typeof module.createHomePage).toBe('function');
    });
  });

  // ==================== Return Type ====================

  describe('return type', () => {
    it('should return a CompiledNode with kind property', async () => {
      /**
       * Given: createHomePage function
       * When: Called
       * Then: Should return a CompiledNode with kind property
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      expect(result).toHaveProperty('kind');
    });

    it('should return an element node', async () => {
      /**
       * Given: createHomePage function
       * When: Called
       * Then: Should return node with kind "element"
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      expect(result.kind).toBe('element');
    });
  });

  // ==================== Page Structure ====================

  describe('page structure', () => {
    it('should have div tag as root element', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting root element
       * Then: Should have tag "div"
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('div');
      }
    });

    it('should have flex min-h-screen flex-col bg-background class on root', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting root element classes
       * Then: Should include layout classes
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      if (isElementNode(result)) {
        expect(hasClass(result, 'flex')).toBe(true);
        expect(hasClass(result, 'min-h-screen')).toBe(true);
        expect(hasClass(result, 'flex-col')).toBe(true);
        expect(hasClass(result, 'bg-background')).toBe(true);
      }
    });

    it('should contain header element', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting page structure
       * Then: Should contain header element
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const header = findElementByTag(result, 'header');
      expect(header).not.toBeNull();
    });

    it('should contain main element', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting page structure
       * Then: Should contain main element
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
    });

    it('should contain footer element', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting page structure
       * Then: Should contain footer element
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const footer = findElementByTag(result, 'footer');
      expect(footer).not.toBeNull();
    });

    it('should have main with flex-1 pt-[var(--header-height)] class', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting main element
       * Then: Should have flex-1 and padding-top classes
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
      if (main) {
        expect(hasClass(main, 'flex-1')).toBe(true);
        expect(hasClass(main, 'pt-[var(--header-height)]')).toBe(true);
      }
    });
  });

  // ==================== Hero Section ====================

  describe('Hero section', () => {
    it('should contain Hero section element', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting page structure
       * Then: Should contain Hero section
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const sections = findElementsByTag(result, 'section');
      expect(sections.length).toBeGreaterThanOrEqual(1);
    });

    it('should have Hero section with px-6 py-24 class', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting Hero section
       * Then: Should have padding classes
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const sections = findElementsByTag(result, 'section');
      const heroSection = sections.find((s) => hasClass(s, 'py-24'));
      expect(heroSection).toBeDefined();
      if (heroSection) {
        expect(hasClass(heroSection, 'px-6')).toBe(true);
      }
    });

    it('should contain h1 with text "Constela"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting Hero section
       * Then: Should contain h1 with brand name
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const h1 = findElementByTag(result, 'h1');
      expect(h1).not.toBeNull();
      if (h1) {
        const text = getAllTextContent(h1);
        expect(text).toContain('Constela');
      }
    });

    it('should contain p with description "A compiler-first UI language for vibecoding"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting Hero section
       * Then: Should contain description paragraph
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('A compiler-first UI language for vibecoding');
    });

    it('should contain "Get Started" CTA button with href="/docs"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting Hero section
       * Then: Should contain Get Started button linking to /docs
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const docsLink = findLinkByHref(result, '/docs');
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        const text = getAllTextContent(docsLink);
        expect(text).toContain('Get Started');
      }
    });

    it('should contain "Playground" CTA button with href="/playground"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting Hero section
       * Then: Should contain Playground button linking to /playground
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const playgroundLink = findLinkByHref(result, '/playground');
      expect(playgroundLink).not.toBeNull();
      if (playgroundLink) {
        const text = getAllTextContent(playgroundLink);
        expect(text).toContain('Playground');
      }
    });
  });

  // ==================== ValueProps Section ====================

  describe('ValueProps section', () => {
    it('should contain ValueProps section with border-t border-border bg-muted/30 class', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting page structure
       * Then: Should contain ValueProps section with specific styling
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const sections = findElementsByTag(result, 'section');
      const valuePropsSection = sections.find(
        (s) => hasClass(s, 'border-t') && hasClass(s, 'bg-muted/30')
      );
      expect(valuePropsSection).toBeDefined();
    });

    it('should contain h2 with text "Built for the AI Era"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain section title
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const h2Elements = findElementsByTag(result, 'h2');
      const found = h2Elements.some((h2) => {
        const text = getAllTextContent(h2);
        return text.includes('Built for the AI Era');
      });
      expect(found).toBe(true);
    });

    it('should contain 5 value proposition cards', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain exactly 5 value prop cards
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      
      // Check for all 5 value prop titles
      expect(textContent).toContain('AI-Friendly DSL');
      expect(textContent).toContain('Deterministic Actions');
      expect(textContent).toContain('Schema Validation');
      expect(textContent).toContain('Minimal Runtime');
      expect(textContent).toContain('Structured Errors');
    });

    it('should have "AI-Friendly DSL" card', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain AI-Friendly DSL card
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('AI-Friendly DSL');
    });

    it('should have "Deterministic Actions" card', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain Deterministic Actions card
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Deterministic Actions');
    });

    it('should have "Schema Validation" card', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain Schema Validation card
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Schema Validation');
    });

    it('should have "Minimal Runtime" card', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain Minimal Runtime card
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Minimal Runtime');
    });

    it('should have "Structured Errors" card', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting ValueProps section
       * Then: Should contain Structured Errors card
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Structured Errors');
    });
  });

  // ==================== CodeDemo Section ====================

  describe('CodeDemo section', () => {
    it('should contain CodeDemo section', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting page structure
       * Then: Should contain CodeDemo section
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const sections = findElementsByTag(result, 'section');
      // At least 3 sections: Hero, ValueProps, CodeDemo
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });

    it('should contain h2 with text "See It in Action"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting CodeDemo section
       * Then: Should contain section title
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const h2Elements = findElementsByTag(result, 'h2');
      const found = h2Elements.some((h2) => {
        const text = getAllTextContent(h2);
        return text.includes('See It in Action');
      });
      expect(found).toBe(true);
    });

    it('should contain code panel with "counter.constela.json" text', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting CodeDemo section
       * Then: Should contain code panel with filename
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('counter.constela.json');
    });

    it('should contain preview panel with "Live Preview" text', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting CodeDemo section
       * Then: Should contain preview panel with title
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Live Preview');
    });

    it('should have preview container with data-constela-escape="code-demo"', async () => {
      /**
       * Given: createHomePage function
       * When: Inspecting CodeDemo section
       * Then: Should have escape attribute for client-side rendering
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');
      const result = createHomePage();

      const escapedElement = findElementByAttribute(
        result,
        'data-constela-escape',
        'code-demo'
      );
      expect(escapedElement).not.toBeNull();
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should be callable without arguments', async () => {
      /**
       * Given: createHomePage function
       * When: Called with no arguments
       * Then: Should not throw and return valid node
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');

      expect(() => createHomePage()).not.toThrow();
      const result = createHomePage();
      expect(result).toBeDefined();
    });

    it('should return consistent structure on multiple calls', async () => {
      /**
       * Given: createHomePage function
       * When: Called multiple times
       * Then: Should return same structure (pure function)
       *
       * RED PHASE: This test will FAIL - index.ts does not exist
       */
      const { createHomePage } = await import('./index');

      const result1 = createHomePage();
      const result2 = createHomePage();

      expect(result1.kind).toBe(result2.kind);
      if (isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
      }
    });
  });
});
