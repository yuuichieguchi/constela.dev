/**
 * Test module for DocsPagination component (createDocsPagination function).
 *
 * Coverage:
 * - Function signature and return type
 * - Null return when no prev/next provided
 * - Root element structure (nav tag, border-t, flex)
 * - Previous link rendering
 * - Next link rendering
 * - SVG arrow icons
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/docs-pagination.ts does not exist yet
 * - createDocsPagination function is not implemented
 */

import { describe, it, expect } from 'vitest';
import type {
  CompiledNode,
  CompiledElementNode,
  CompiledExpression,
} from '@constela/compiler';
import type { NavItem } from '@/lib/navigation';

// ==================== Test Fixtures ====================

const mockPrev: NavItem = {
  title: 'Introduction',
  href: '/docs',
};

const mockNext: NavItem = {
  title: 'Installation',
  href: '/docs/installation',
};

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
 * Get all text content recursively
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

/**
 * Find SVG element with specific path d attribute
 */
function findSvgByPath(
  node: CompiledNode,
  pathD: string
): CompiledElementNode | null {
  const svgs = findElementsByTag(node, 'svg');
  for (const svg of svgs) {
    const paths = findElementsByTag(svg, 'path');
    for (const path of paths) {
      const dAttr = path.props?.d;
      if (dAttr && 'expr' in dAttr && dAttr.expr === 'lit' && dAttr.value === pathD) {
        return svg;
      }
    }
  }
  return null;
}

describe('DocsPagination Component (createDocsPagination)', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export createDocsPagination function', async () => {
      /**
       * Given: docs-pagination.ts module
       * When: Importing the module
       * Then: Should export createDocsPagination function
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const module = await import('./docs-pagination');
      expect(module).toHaveProperty('createDocsPagination');
      expect(typeof module.createDocsPagination).toBe('function');
    });
  });

  // ==================== Null Returns ====================

  describe('null returns', () => {
    it('should return null when neither prev nor next is provided', async () => {
      /**
       * Given: createDocsPagination function
       * When: Called with empty options
       * Then: Should return null
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({});

      expect(result).toBeNull();
    });

    it('should return null when options has undefined prev and next', async () => {
      /**
       * Given: createDocsPagination function
       * When: Called with undefined prev and next
       * Then: Should return null
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: undefined, next: undefined });

      expect(result).toBeNull();
    });
  });

  // ==================== Return Type ====================

  describe('return type', () => {
    it('should return a CompiledElementNode when prev is provided', async () => {
      /**
       * Given: createDocsPagination function
       * When: Called with prev option
       * Then: Should return a CompiledElementNode
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      expect(result?.kind).toBe('element');
    });

    it('should return a CompiledElementNode when next is provided', async () => {
      /**
       * Given: createDocsPagination function
       * When: Called with next option
       * Then: Should return a CompiledElementNode
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      expect(result?.kind).toBe('element');
    });

    it('should return a CompiledElementNode when both prev and next are provided', async () => {
      /**
       * Given: createDocsPagination function
       * When: Called with both prev and next options
       * Then: Should return a CompiledElementNode
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      expect(result?.kind).toBe('element');
    });
  });

  // ==================== Root Element Structure ====================

  describe('root element structure', () => {
    it('should have nav tag as root element', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element
       * Then: Should have tag "nav"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(result.tag).toBe('nav');
      }
    });

    it('should have border-t class', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element classes
       * Then: Should include "border-t" class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(hasClass(result, 'border-t')).toBe(true);
      }
    });

    it('should have border-border class', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element classes
       * Then: Should include "border-border" class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(hasClass(result, 'border-border')).toBe(true);
      }
    });

    it('should have mt-12 class for margin-top', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element classes
       * Then: Should include "mt-12" class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(hasClass(result, 'mt-12')).toBe(true);
      }
    });

    it('should have pt-6 class for padding-top', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element classes
       * Then: Should include "pt-6" class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(hasClass(result, 'pt-6')).toBe(true);
      }
    });

    it('should have flex class', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element classes
       * Then: Should include "flex" class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(hasClass(result, 'flex')).toBe(true);
      }
    });

    it('should have justify-between class', async () => {
      /**
       * Given: createDocsPagination function
       * When: Inspecting root element classes
       * Then: Should include "justify-between" class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result && isElementNode(result)) {
        expect(hasClass(result, 'justify-between')).toBe(true);
      }
    });
  });

  // ==================== Previous Link ====================

  describe('previous link', () => {
    it('should render previous link when prev is provided', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting rendered output
       * Then: Should have anchor element with prev.href
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
      }
    });

    it('should have flex flex-col items-start on prev link', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting prev link classes
       * Then: Should have flex flex-col items-start
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          expect(hasClass(link, 'flex')).toBe(true);
          expect(hasClass(link, 'flex-col')).toBe(true);
          expect(hasClass(link, 'items-start')).toBe(true);
        }
      }
    });

    it('should have group class on prev link for hover effects', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting prev link classes
       * Then: Should have group class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          expect(hasClass(link, 'group')).toBe(true);
        }
      }
    });

    it('should contain "Previous" label text', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting prev link content
       * Then: Should contain "Previous" label
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          const textContent = getAllTextContent(link);
          expect(textContent).toContain('Previous');
        }
      }
    });

    it('should contain prev.title text', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting prev link content
       * Then: Should contain prev.title
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          const textContent = getAllTextContent(link);
          expect(textContent).toContain(mockPrev.title);
        }
      }
    });

    it('should have text-sm text-muted-foreground on label span', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting label span
       * Then: Should have text-sm text-muted-foreground classes
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          const spans = findElementsByTag(link, 'span');
          const labelSpan = spans.find((span) => {
            const text = getTextContent(span);
            return text === 'Previous';
          });
          expect(labelSpan).toBeDefined();
          if (labelSpan) {
            expect(hasClass(labelSpan, 'text-sm')).toBe(true);
            expect(hasClass(labelSpan, 'text-muted-foreground')).toBe(true);
          }
        }
      }
    });

    it('should have font-medium on title span', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting title span
       * Then: Should have font-medium class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          const spans = findElementsByTag(link, 'span');
          const titleSpan = spans.find((span) => {
            const text = getTextContent(span);
            return text === mockPrev.title;
          });
          expect(titleSpan).toBeDefined();
          if (titleSpan) {
            expect(hasClass(titleSpan, 'font-medium')).toBe(true);
          }
        }
      }
    });

    it('should have group-hover:text-primary on title span', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting title span
       * Then: Should have group-hover:text-primary class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).not.toBeNull();
        if (link) {
          const spans = findElementsByTag(link, 'span');
          const titleSpan = spans.find((span) => {
            const text = getTextContent(span);
            return text === mockPrev.title;
          });
          expect(titleSpan).toBeDefined();
          if (titleSpan) {
            expect(hasClass(titleSpan, 'group-hover:text-primary')).toBe(true);
          }
        }
      }
    });

    it('should contain left arrow SVG with chevron-left path', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting prev link
       * Then: Should contain SVG with chevron-left path
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svg = findSvgByPath(result, 'M15 19l-7-7 7-7');
        expect(svg).not.toBeNull();
      }
    });

    it('should not render prev link when prev is not provided', async () => {
      /**
       * Given: createDocsPagination without prev option
       * When: Inspecting rendered output
       * Then: Should not have prev link
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockPrev.href);
        expect(link).toBeNull();
      }
    });
  });

  // ==================== Next Link ====================

  describe('next link', () => {
    it('should render next link when next is provided', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting rendered output
       * Then: Should have anchor element with next.href
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).not.toBeNull();
      }
    });

    it('should have flex flex-col items-end on next link', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting next link classes
       * Then: Should have flex flex-col items-end
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).not.toBeNull();
        if (link) {
          expect(hasClass(link, 'flex')).toBe(true);
          expect(hasClass(link, 'flex-col')).toBe(true);
          expect(hasClass(link, 'items-end')).toBe(true);
        }
      }
    });

    it('should have ml-auto class on next link', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting next link classes
       * Then: Should have ml-auto class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).not.toBeNull();
        if (link) {
          expect(hasClass(link, 'ml-auto')).toBe(true);
        }
      }
    });

    it('should have group class on next link for hover effects', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting next link classes
       * Then: Should have group class
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).not.toBeNull();
        if (link) {
          expect(hasClass(link, 'group')).toBe(true);
        }
      }
    });

    it('should contain "Next" label text', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting next link content
       * Then: Should contain "Next" label
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).not.toBeNull();
        if (link) {
          const textContent = getAllTextContent(link);
          expect(textContent).toContain('Next');
        }
      }
    });

    it('should contain next.title text', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting next link content
       * Then: Should contain next.title
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).not.toBeNull();
        if (link) {
          const textContent = getAllTextContent(link);
          expect(textContent).toContain(mockNext.title);
        }
      }
    });

    it('should contain right arrow SVG with chevron-right path', async () => {
      /**
       * Given: createDocsPagination with next option
       * When: Inspecting next link
       * Then: Should contain SVG with chevron-right path
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const svg = findSvgByPath(result, 'M9 5l7 7-7 7');
        expect(svg).not.toBeNull();
      }
    });

    it('should not render next link when next is not provided', async () => {
      /**
       * Given: createDocsPagination without next option
       * When: Inspecting rendered output
       * Then: Should not have next link
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const link = findLinkByHref(result, mockNext.href);
        expect(link).toBeNull();
      }
    });
  });

  // ==================== SVG Attributes ====================

  describe('SVG attributes', () => {
    it('should have width="20" on SVG', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting SVG attributes
       * Then: Should have width="20"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svgs = findElementsByTag(result, 'svg');
        expect(svgs.length).toBeGreaterThan(0);
        const svg = svgs[0];
        const widthAttr = svg.props?.width;
        expect(widthAttr).toBeDefined();
        if (widthAttr && 'expr' in widthAttr && widthAttr.expr === 'lit') {
          expect(widthAttr.value).toBe('20');
        }
      }
    });

    it('should have height="20" on SVG', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting SVG attributes
       * Then: Should have height="20"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svgs = findElementsByTag(result, 'svg');
        expect(svgs.length).toBeGreaterThan(0);
        const svg = svgs[0];
        const heightAttr = svg.props?.height;
        expect(heightAttr).toBeDefined();
        if (heightAttr && 'expr' in heightAttr && heightAttr.expr === 'lit') {
          expect(heightAttr.value).toBe('20');
        }
      }
    });

    it('should have viewBox="0 0 24 24" on SVG', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting SVG attributes
       * Then: Should have viewBox="0 0 24 24"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svgs = findElementsByTag(result, 'svg');
        expect(svgs.length).toBeGreaterThan(0);
        const svg = svgs[0];
        const viewBoxAttr = svg.props?.viewBox;
        expect(viewBoxAttr).toBeDefined();
        if (viewBoxAttr && 'expr' in viewBoxAttr && viewBoxAttr.expr === 'lit') {
          expect(viewBoxAttr.value).toBe('0 0 24 24');
        }
      }
    });

    it('should have fill="none" on SVG', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting SVG attributes
       * Then: Should have fill="none"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svgs = findElementsByTag(result, 'svg');
        expect(svgs.length).toBeGreaterThan(0);
        const svg = svgs[0];
        const fillAttr = svg.props?.fill;
        expect(fillAttr).toBeDefined();
        if (fillAttr && 'expr' in fillAttr && fillAttr.expr === 'lit') {
          expect(fillAttr.value).toBe('none');
        }
      }
    });

    it('should have stroke="currentColor" on SVG', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting SVG attributes
       * Then: Should have stroke="currentColor"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svgs = findElementsByTag(result, 'svg');
        expect(svgs.length).toBeGreaterThan(0);
        const svg = svgs[0];
        const strokeAttr = svg.props?.stroke;
        expect(strokeAttr).toBeDefined();
        if (strokeAttr && 'expr' in strokeAttr && strokeAttr.expr === 'lit') {
          expect(strokeAttr.value).toBe('currentColor');
        }
      }
    });

    it('should have stroke-width="2" on SVG', async () => {
      /**
       * Given: createDocsPagination with prev option
       * When: Inspecting SVG attributes
       * Then: Should have stroke-width="2"
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev });

      expect(result).not.toBeNull();
      if (result) {
        const svgs = findElementsByTag(result, 'svg');
        expect(svgs.length).toBeGreaterThan(0);
        const svg = svgs[0];
        const strokeWidthAttr = svg.props?.['stroke-width'];
        expect(strokeWidthAttr).toBeDefined();
        if (strokeWidthAttr && 'expr' in strokeWidthAttr && strokeWidthAttr.expr === 'lit') {
          expect(strokeWidthAttr.value).toBe('2');
        }
      }
    });
  });

  // ==================== Both Links Together ====================

  describe('both links together', () => {
    it('should render both prev and next links when both provided', async () => {
      /**
       * Given: createDocsPagination with both prev and next
       * When: Inspecting rendered output
       * Then: Should have both anchor elements
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const prevLink = findLinkByHref(result, mockPrev.href);
        const nextLink = findLinkByHref(result, mockNext.href);
        expect(prevLink).not.toBeNull();
        expect(nextLink).not.toBeNull();
      }
    });

    it('should have 2 anchor elements when both provided', async () => {
      /**
       * Given: createDocsPagination with both prev and next
       * When: Counting anchor elements
       * Then: Should have exactly 2 anchors
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const anchors = findElementsByTag(result, 'a');
        expect(anchors.length).toBe(2);
      }
    });

    it('should have both left and right arrow SVGs', async () => {
      /**
       * Given: createDocsPagination with both prev and next
       * When: Inspecting SVGs
       * Then: Should have both chevron-left and chevron-right
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: mockPrev, next: mockNext });

      expect(result).not.toBeNull();
      if (result) {
        const leftArrow = findSvgByPath(result, 'M15 19l-7-7 7-7');
        const rightArrow = findSvgByPath(result, 'M9 5l7 7-7 7');
        expect(leftArrow).not.toBeNull();
        expect(rightArrow).not.toBeNull();
      }
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle special characters in title', async () => {
      /**
       * Given: createDocsPagination with special characters in title
       * When: Rendering
       * Then: Should handle without errors
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const specialNav: NavItem = {
        title: '@constela/start',
        href: '/docs/start',
      };

      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ prev: specialNav });

      expect(result).not.toBeNull();
      if (result) {
        const textContent = getAllTextContent(result);
        expect(textContent).toContain('@constela/start');
      }
    });

    it('should handle ampersand in title', async () => {
      /**
       * Given: createDocsPagination with ampersand in title
       * When: Rendering
       * Then: Should render ampersand correctly
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const specialNav: NavItem = {
        title: 'State & Expressions',
        href: '/docs/state-expressions',
      };

      const { createDocsPagination } = await import('./docs-pagination');
      const result = createDocsPagination({ next: specialNav });

      expect(result).not.toBeNull();
      if (result) {
        const textContent = getAllTextContent(result);
        expect(textContent).toContain('State & Expressions');
      }
    });

    it('should return consistent structure on multiple calls', async () => {
      /**
       * Given: createDocsPagination function
       * When: Called multiple times with same options
       * Then: Should return consistent structure (pure function)
       *
       * RED PHASE: This test will FAIL - docs-pagination.ts does not exist
       */
      const { createDocsPagination } = await import('./docs-pagination');
      const options = { prev: mockPrev, next: mockNext };

      const result1 = createDocsPagination(options);
      const result2 = createDocsPagination(options);

      expect(result1?.kind).toBe(result2?.kind);
      if (result1 && result2 && isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
        expect(result1.children?.length).toBe(result2.children?.length);
      }
    });
  });
});
