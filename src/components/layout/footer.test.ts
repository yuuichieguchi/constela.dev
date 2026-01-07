/**
 * Test module for Footer layout component (createFooter function).
 *
 * Coverage:
 * - Function signature and return type
 * - Root element structure (footer tag, border-t)
 * - Copyright text
 * - GitHub link
 * - Documentation link
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/layout/footer.ts does not exist yet
 * - createFooter function is not implemented
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
 * Get all text content from node tree
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
 * Get text content from element children
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

describe('Footer Component (createFooter)', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export createFooter function', async () => {
      /**
       * Given: footer.ts module
       * When: Importing the module
       * Then: Should export createFooter function
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const module = await import('./footer');
      expect(module).toHaveProperty('createFooter');
      expect(typeof module.createFooter).toBe('function');
    });
  });

  // ==================== Return Type ====================

  describe('return type', () => {
    it('should return a CompiledNode with kind property', async () => {
      /**
       * Given: createFooter function
       * When: Called
       * Then: Should return a CompiledNode with kind property
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      expect(result).toHaveProperty('kind');
    });

    it('should return an element node', async () => {
      /**
       * Given: createFooter function
       * When: Called
       * Then: Should return node with kind "element"
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      expect(result.kind).toBe('element');
    });
  });

  // ==================== Root Element Structure ====================

  describe('root element structure', () => {
    it('should have footer tag as root element', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting root element
       * Then: Should have tag "footer"
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('footer');
      }
    });

    it('should have border-t class for top border', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting root element classes
       * Then: Should include "border-t" class
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      if (isElementNode(result)) {
        expect(hasClass(result, 'border-t')).toBe(true);
      }
    });

    it('should have border-border class for border color', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting root element classes
       * Then: Should include "border-border" class
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      if (isElementNode(result)) {
        expect(hasClass(result, 'border-border')).toBe(true);
      }
    });

    it('should have bg-background class', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting root element classes
       * Then: Should include "bg-background" class
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      if (isElementNode(result)) {
        expect(hasClass(result, 'bg-background')).toBe(true);
      }
    });
  });

  // ==================== Copyright Text ====================

  describe('copyright text', () => {
    it('should contain copyright symbol', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting text content
       * Then: Should contain copyright symbol
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const textContent = getAllTextContent(result);
      // Copyright can be rendered as © or &copy; or (c)
      expect(
        textContent.includes('\u00A9') ||
          textContent.includes('©') ||
          textContent.includes('Copyright')
      ).toBe(true);
    });

    it('should contain "Constela" in copyright text', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting text content
       * Then: Should contain brand name
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Constela');
    });

    it('should contain year in copyright text', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting text content
       * Then: Should contain current year or a year range
       *
       * Note: Since this is SSR-generated, the year is determined at build time
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const textContent = getAllTextContent(result);
      // Check for 4-digit year pattern
      expect(textContent).toMatch(/20\d{2}/);
    });

    it('should contain "All rights reserved" text', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting text content
       * Then: Should contain rights statement
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const textContent = getAllTextContent(result);
      expect(textContent.toLowerCase()).toContain('all rights reserved');
    });
  });

  // ==================== GitHub Link ====================

  describe('GitHub link', () => {
    it('should contain GitHub repository link', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting for GitHub link
       * Then: Should contain anchor to GitHub repository
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const githubLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela'
      );
      expect(githubLink).not.toBeNull();
    });

    it('should have "GitHub" as link text', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting GitHub link text
       * Then: Should display "GitHub"
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const githubLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela'
      );
      expect(githubLink).not.toBeNull();
      if (githubLink) {
        const text = getTextContent(githubLink);
        expect(text).toBe('GitHub');
      }
    });

    it('should have target="_blank" on GitHub link', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting GitHub link
       * Then: Should open in new tab
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const githubLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela'
      );
      expect(githubLink).not.toBeNull();
      if (githubLink) {
        const targetAttr = githubLink.props?.target;
        expect(targetAttr).toBeDefined();
        if (targetAttr && 'expr' in targetAttr) {
          expect(targetAttr.value).toBe('_blank');
        }
      }
    });

    it('should have rel="noopener noreferrer" on GitHub link', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting GitHub link
       * Then: Should have security attributes
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const githubLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela'
      );
      expect(githubLink).not.toBeNull();
      if (githubLink) {
        const relAttr = githubLink.props?.rel;
        expect(relAttr).toBeDefined();
        if (relAttr && 'expr' in relAttr) {
          expect(relAttr.value).toBe('noopener noreferrer');
        }
      }
    });
  });

  // ==================== Documentation Link ====================

  describe('documentation link', () => {
    it('should contain Documentation link', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting for Documentation link
       * Then: Should contain anchor to docs repository
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const docsLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela.dev'
      );
      expect(docsLink).not.toBeNull();
    });

    it('should have "Documentation" as link text', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting Documentation link text
       * Then: Should display "Documentation"
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const docsLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela.dev'
      );
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        const text = getTextContent(docsLink);
        expect(text).toBe('Documentation');
      }
    });

    it('should have target="_blank" on Documentation link', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting Documentation link
       * Then: Should open in new tab
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const docsLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela.dev'
      );
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        const targetAttr = docsLink.props?.target;
        expect(targetAttr).toBeDefined();
        if (targetAttr && 'expr' in targetAttr) {
          expect(targetAttr.value).toBe('_blank');
        }
      }
    });

    it('should have rel="noopener noreferrer" on Documentation link', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting Documentation link
       * Then: Should have security attributes
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const docsLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela.dev'
      );
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        const relAttr = docsLink.props?.rel;
        expect(relAttr).toBeDefined();
        if (relAttr && 'expr' in relAttr) {
          expect(relAttr.value).toBe('noopener noreferrer');
        }
      }
    });
  });

  // ==================== Layout Structure ====================

  describe('layout structure', () => {
    it('should have container div with max-w-7xl class', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting inner container
       * Then: Should have max-width container
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const divs = findElementsByTag(result, 'div');
      const containerDiv = divs.find((div) => hasClass(div, 'max-w-7xl'));
      expect(containerDiv).toBeDefined();
    });

    it('should have padding classes', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting container
       * Then: Should have padding classes
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const divs = findElementsByTag(result, 'div');
      const containerDiv = divs.find((div) => hasClass(div, 'px-6'));
      expect(containerDiv).toBeDefined();
    });

    it('should have paragraph element for copyright', async () => {
      /**
       * Given: createFooter function
       * When: Inspecting structure
       * Then: Should have p element for copyright text
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');
      const result = createFooter();

      const paragraphs = findElementsByTag(result, 'p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should be callable without arguments', async () => {
      /**
       * Given: createFooter function
       * When: Called with no arguments
       * Then: Should not throw and return valid node
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');

      expect(() => createFooter()).not.toThrow();
      const result = createFooter();
      expect(result).toBeDefined();
    });

    it('should return consistent structure on multiple calls', async () => {
      /**
       * Given: createFooter function
       * When: Called multiple times
       * Then: Should return same structure (pure function)
       *
       * RED PHASE: This test will FAIL - footer.ts does not exist
       */
      const { createFooter } = await import('./footer');

      const result1 = createFooter();
      const result2 = createFooter();

      expect(result1.kind).toBe(result2.kind);
      if (isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
      }
    });
  });
});
