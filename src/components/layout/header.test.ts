/**
 * Test module for Header layout component (createHeader function).
 *
 * Coverage:
 * - Function signature and return type
 * - Root element structure (header tag, fixed position)
 * - Logo link to '/'
 * - Navigation links (Docs, Reference, Examples, Playground)
 * - Active link state based on currentPath
 * - GitHub link
 * - Theme toggle button with data-constela-escape
 * - Mobile menu button
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/layout/header.ts does not exist yet
 * - createHeader function is not implemented
 */

import { describe, it, expect } from 'vitest';
import type {
  CompiledNode,
  CompiledElementNode,
  CompiledExpression,
} from '@constela/compiler';

// ==================== Type Definitions for Testing ====================

interface HeaderOptions {
  currentPath: string;
}

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

describe('Header Component (createHeader)', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export createHeader function', async () => {
      /**
       * Given: header.ts module
       * When: Importing the module
       * Then: Should export createHeader function
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const module = await import('./header');
      expect(module).toHaveProperty('createHeader');
      expect(typeof module.createHeader).toBe('function');
    });

    it('should export HeaderOptions type', async () => {
      /**
       * Given: header.ts module
       * When: Importing types
       * Then: Should be able to use HeaderOptions type
       *
       * Note: TypeScript types are erased at runtime, so this test
       * just verifies the module can be imported without type errors
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const module = await import('./header');
      // Type check happens at compile time, just verify module exists
      expect(module.createHeader).toBeDefined();
    });
  });

  // ==================== Return Type ====================

  describe('return type', () => {
    it('should return a CompiledNode with kind property', async () => {
      /**
       * Given: createHeader function
       * When: Called with valid options
       * Then: Should return a CompiledNode with kind property
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      expect(result).toHaveProperty('kind');
    });

    it('should return an element node', async () => {
      /**
       * Given: createHeader function
       * When: Called with valid options
       * Then: Should return node with kind "element"
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      expect(result.kind).toBe('element');
    });
  });

  // ==================== Root Element Structure ====================

  describe('root element structure', () => {
    it('should have header tag as root element', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting root element
       * Then: Should have tag "header"
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('header');
      }
    });

    it('should have fixed position class', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting root element classes
       * Then: Should include "fixed" class
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      if (isElementNode(result)) {
        expect(hasClass(result, 'fixed')).toBe(true);
      }
    });

    it('should have top-0 class for positioning', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting root element classes
       * Then: Should include "top-0" class
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      if (isElementNode(result)) {
        expect(hasClass(result, 'top-0')).toBe(true);
      }
    });

    it('should have z-40 class for stacking', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting root element classes
       * Then: Should include "z-40" class
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      if (isElementNode(result)) {
        expect(hasClass(result, 'z-40')).toBe(true);
      }
    });
  });

  // ==================== Logo ====================

  describe('logo', () => {
    it('should contain logo link to root path', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting for logo link
       * Then: Should contain anchor with href="/"
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const logoLink = findLinkByHref(result, '/');
      expect(logoLink).not.toBeNull();
    });

    it('should have logo text content "Constela"', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting logo link
       * Then: Should contain text "Constela"
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const logoLink = findLinkByHref(result, '/');
      expect(logoLink).not.toBeNull();
      if (logoLink) {
        const text = getTextContent(logoLink);
        expect(text).toBe('Constela');
      }
    });
  });

  // ==================== Navigation Links ====================

  describe('navigation links', () => {
    it('should contain link to /docs', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting navigation
       * Then: Should contain Docs link
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const docsLink = findLinkByHref(result, '/docs');
      expect(docsLink).not.toBeNull();
    });

    it('should contain link to /reference', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting navigation
       * Then: Should contain Reference link
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const referenceLink = findLinkByHref(result, '/reference');
      expect(referenceLink).not.toBeNull();
    });

    it('should contain link to /examples', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting navigation
       * Then: Should contain Examples link
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const examplesLink = findLinkByHref(result, '/examples');
      expect(examplesLink).not.toBeNull();
    });

    it('should contain link to /playground', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting navigation
       * Then: Should contain Playground link
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const playgroundLink = findLinkByHref(result, '/playground');
      expect(playgroundLink).not.toBeNull();
    });

    it('should have nav links inside nav element', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting structure
       * Then: Navigation links should be inside nav element
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const navElement = findElementByTag(result, 'nav');
      expect(navElement).not.toBeNull();
      if (navElement) {
        const docsLink = findLinkByHref(navElement, '/docs');
        expect(docsLink).not.toBeNull();
      }
    });
  });

  // ==================== Active Link State ====================

  describe('active link state', () => {
    it('should apply active class to docs link when currentPath starts with /docs', async () => {
      /**
       * Given: createHeader with currentPath="/docs"
       * When: Inspecting docs link
       * Then: Should have active styling class
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/docs' });

      const docsLink = findLinkByHref(result, '/docs');
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        // Active link should have font-medium class
        expect(hasClass(docsLink, 'font-medium')).toBe(true);
      }
    });

    it('should apply inactive class to non-matching links', async () => {
      /**
       * Given: createHeader with currentPath="/docs"
       * When: Inspecting reference link
       * Then: Should have inactive styling class
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/docs' });

      const referenceLink = findLinkByHref(result, '/reference');
      expect(referenceLink).not.toBeNull();
      if (referenceLink) {
        // Inactive link should have muted-foreground class
        expect(hasClass(referenceLink, 'text-muted-foreground')).toBe(true);
      }
    });

    it('should apply active class to reference link when on /reference path', async () => {
      /**
       * Given: createHeader with currentPath="/reference"
       * When: Inspecting reference link
       * Then: Should have active styling class
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/reference' });

      const referenceLink = findLinkByHref(result, '/reference');
      expect(referenceLink).not.toBeNull();
      if (referenceLink) {
        expect(hasClass(referenceLink, 'font-medium')).toBe(true);
      }
    });

    it('should apply active class when currentPath is nested under section', async () => {
      /**
       * Given: createHeader with currentPath="/docs/installation"
       * When: Inspecting docs link
       * Then: Should have active styling (startsWith match)
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/docs/installation' });

      const docsLink = findLinkByHref(result, '/docs');
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        expect(hasClass(docsLink, 'font-medium')).toBe(true);
      }
    });
  });

  // ==================== GitHub Link ====================

  describe('GitHub link', () => {
    it('should contain GitHub repository link', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting for GitHub link
       * Then: Should contain anchor to GitHub repository
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const githubLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela'
      );
      expect(githubLink).not.toBeNull();
    });

    it('should have target="_blank" on GitHub link', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting GitHub link
       * Then: Should open in new tab
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

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
       * Given: createHeader function
       * When: Inspecting GitHub link
       * Then: Should have security attributes
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

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

    it('should have aria-label on GitHub link', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting GitHub link
       * Then: Should have accessibility label
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const githubLink = findLinkByHref(
        result,
        'https://github.com/yuuichieguchi/constela'
      );
      expect(githubLink).not.toBeNull();
      if (githubLink) {
        const ariaLabel = githubLink.props?.['aria-label'];
        expect(ariaLabel).toBeDefined();
      }
    });
  });

  // ==================== Theme Toggle ====================

  describe('theme toggle', () => {
    it('should contain theme toggle button', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting for theme toggle
       * Then: Should contain button for theme switching
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const buttons = findElementsByTag(result, 'button');
      // Should have at least 2 buttons: mobile menu and theme toggle
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('should have data-constela-escape="theme" on theme toggle', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting theme toggle button
       * Then: Should have data-constela-escape attribute for client-side handling
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const themeToggle = findElementByAttribute(
        result,
        'data-constela-escape',
        'theme'
      );
      expect(themeToggle).not.toBeNull();
    });
  });

  // ==================== Mobile Menu Button ====================

  describe('mobile menu button', () => {
    it('should contain mobile menu button', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting for mobile menu
       * Then: Should contain button for mobile navigation
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const buttons = findElementsByTag(result, 'button');
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('should have mobile menu button with aria-label', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting mobile menu button
       * Then: Should have accessibility label
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const buttons = findElementsByTag(result, 'button');
      const mobileMenuButton = buttons.find((btn) => {
        const ariaLabel = btn.props?.['aria-label'];
        if (ariaLabel && 'expr' in ariaLabel && ariaLabel.expr === 'lit') {
          return String(ariaLabel.value).toLowerCase().includes('menu');
        }
        return false;
      });

      expect(mobileMenuButton).toBeDefined();
    });

    it('should hide mobile menu button on desktop (md:hidden class)', async () => {
      /**
       * Given: createHeader function
       * When: Inspecting mobile menu button
       * Then: Should be hidden on desktop viewports
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const buttons = findElementsByTag(result, 'button');
      const mobileMenuButton = buttons.find((btn) => {
        const ariaLabel = btn.props?.['aria-label'];
        if (ariaLabel && 'expr' in ariaLabel && ariaLabel.expr === 'lit') {
          return String(ariaLabel.value).toLowerCase().includes('menu');
        }
        return false;
      });

      expect(mobileMenuButton).toBeDefined();
      if (mobileMenuButton) {
        expect(hasClass(mobileMenuButton, 'md:hidden')).toBe(true);
      }
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle root path "/" correctly', async () => {
      /**
       * Given: createHeader with currentPath="/"
       * When: Checking active states
       * Then: No nav links should be active
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/' });

      const docsLink = findLinkByHref(result, '/docs');
      const referenceLink = findLinkByHref(result, '/reference');

      // Neither should be active on root path
      if (docsLink) {
        expect(hasClass(docsLink, 'text-muted-foreground')).toBe(true);
      }
      if (referenceLink) {
        expect(hasClass(referenceLink, 'text-muted-foreground')).toBe(true);
      }
    });

    it('should handle deep nested paths', async () => {
      /**
       * Given: createHeader with deep nested path
       * When: Checking active states
       * Then: Parent section should be active
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({
        currentPath: '/reference/expressions/operators',
      });

      const referenceLink = findLinkByHref(result, '/reference');
      if (referenceLink) {
        expect(hasClass(referenceLink, 'font-medium')).toBe(true);
      }
    });

    it('should handle unknown paths gracefully', async () => {
      /**
       * Given: createHeader with unknown path
       * When: Creating header
       * Then: Should render without errors, no active nav links
       *
       * RED PHASE: This test will FAIL - header.ts does not exist
       */
      const { createHeader } = await import('./header');
      const result = createHeader({ currentPath: '/unknown/path' });

      expect(result).toBeDefined();
      expect(result.kind).toBe('element');
    });
  });
});
