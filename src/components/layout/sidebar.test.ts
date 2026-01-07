/**
 * Test module for Sidebar layout component (createSidebar function).
 *
 * Coverage:
 * - Function signature and return type
 * - Root element structure (aside tag, fixed position)
 * - Navigation sections rendering
 * - Active link state based on currentPath
 * - Section titles (h3)
 * - Badge support
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/layout/sidebar.ts does not exist yet
 * - createSidebar function is not implemented
 */

import { describe, it, expect } from 'vitest';
import type {
  CompiledNode,
  CompiledElementNode,
  CompiledExpression,
} from '@constela/compiler';
import type { NavSection, NavItem } from '@/lib/navigation';

// ==================== Test Fixtures ====================

const mockNavigation: NavSection[] = [
  {
    title: 'Get Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'First App', href: '/docs/first-app' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'State Management', href: '/docs/state', badge: 'New' },
      { title: 'Routing', href: '/docs/routing' },
    ],
  },
];

const singleSectionNav: NavSection[] = [
  {
    title: 'Reference',
    items: [
      { title: 'API', href: '/reference/api' },
      { title: 'Types', href: '/reference/types' },
    ],
  },
];

const emptyNav: NavSection[] = [];

// ==================== Type Definitions for Testing ====================

interface SidebarOptions {
  currentPath: string;
  navigation: NavSection[];
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

describe('Sidebar Component (createSidebar)', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export createSidebar function', async () => {
      /**
       * Given: sidebar.ts module
       * When: Importing the module
       * Then: Should export createSidebar function
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const module = await import('./sidebar');
      expect(module).toHaveProperty('createSidebar');
      expect(typeof module.createSidebar).toBe('function');
    });

    it('should export SidebarOptions type', async () => {
      /**
       * Given: sidebar.ts module
       * When: Importing types
       * Then: Should be able to use SidebarOptions type
       *
       * Note: TypeScript types are erased at runtime
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const module = await import('./sidebar');
      expect(module.createSidebar).toBeDefined();
    });
  });

  // ==================== Return Type ====================

  describe('return type', () => {
    it('should return a CompiledNode with kind property', async () => {
      /**
       * Given: createSidebar function
       * When: Called with valid options
       * Then: Should return a CompiledNode with kind property
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      expect(result).toHaveProperty('kind');
    });

    it('should return an element node', async () => {
      /**
       * Given: createSidebar function
       * When: Called with valid options
       * Then: Should return node with kind "element"
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      expect(result.kind).toBe('element');
    });
  });

  // ==================== Root Element Structure ====================

  describe('root element structure', () => {
    it('should have aside tag as root element', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting root element
       * Then: Should have tag "aside"
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('aside');
      }
    });

    it('should have fixed position class', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting root element classes
       * Then: Should include "fixed" class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      if (isElementNode(result)) {
        expect(hasClass(result, 'fixed')).toBe(true);
      }
    });

    it('should have left-0 class for positioning', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting root element classes
       * Then: Should include "left-0" class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      if (isElementNode(result)) {
        expect(hasClass(result, 'left-0')).toBe(true);
      }
    });

    it('should have overflow-y-auto for scrolling', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting root element classes
       * Then: Should include "overflow-y-auto" class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      if (isElementNode(result)) {
        expect(hasClass(result, 'overflow-y-auto')).toBe(true);
      }
    });

    it('should have border-r class for right border', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting root element classes
       * Then: Should include "border-r" class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      if (isElementNode(result)) {
        expect(hasClass(result, 'border-r')).toBe(true);
      }
    });
  });

  // ==================== Navigation Sections ====================

  describe('navigation sections', () => {
    it('should render section titles as h3 elements', async () => {
      /**
       * Given: createSidebar with navigation containing sections
       * When: Inspecting the rendered output
       * Then: Should have h3 elements for each section title
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const h3Elements = findElementsByTag(result, 'h3');
      expect(h3Elements.length).toBe(mockNavigation.length);
    });

    it('should render "Get Started" section title', async () => {
      /**
       * Given: createSidebar with mockNavigation
       * When: Inspecting h3 elements
       * Then: Should contain "Get Started" text
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const h3Elements = findElementsByTag(result, 'h3');
      const sectionTitles = h3Elements.map((h3) => getTextContent(h3));
      expect(sectionTitles).toContain('Get Started');
    });

    it('should render "Advanced" section title', async () => {
      /**
       * Given: createSidebar with mockNavigation
       * When: Inspecting h3 elements
       * Then: Should contain "Advanced" text
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const h3Elements = findElementsByTag(result, 'h3');
      const sectionTitles = h3Elements.map((h3) => getTextContent(h3));
      expect(sectionTitles).toContain('Advanced');
    });

    it('should render ul elements for each section', async () => {
      /**
       * Given: createSidebar with navigation sections
       * When: Inspecting structure
       * Then: Should have ul element for each section
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const ulElements = findElementsByTag(result, 'ul');
      expect(ulElements.length).toBe(mockNavigation.length);
    });

    it('should render li elements for each nav item', async () => {
      /**
       * Given: createSidebar with navigation
       * When: Inspecting list structure
       * Then: Should have li element for each navigation item
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const liElements = findElementsByTag(result, 'li');
      const totalItems = mockNavigation.reduce(
        (sum, section) => sum + section.items.length,
        0
      );
      expect(liElements.length).toBe(totalItems);
    });
  });

  // ==================== Navigation Links ====================

  describe('navigation links', () => {
    it('should render anchor elements for each nav item', async () => {
      /**
       * Given: createSidebar with navigation
       * When: Inspecting links
       * Then: Should have anchor for each navigation item
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const anchors = findElementsByTag(result, 'a');
      const totalItems = mockNavigation.reduce(
        (sum, section) => sum + section.items.length,
        0
      );
      expect(anchors.length).toBe(totalItems);
    });

    it('should render link to /docs with correct href', async () => {
      /**
       * Given: createSidebar with mockNavigation
       * When: Inspecting links
       * Then: Should have link to /docs
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const link = findLinkByHref(result, '/docs');
      expect(link).not.toBeNull();
    });

    it('should render link to /docs/installation with correct href', async () => {
      /**
       * Given: createSidebar with mockNavigation
       * When: Inspecting links
       * Then: Should have link to /docs/installation
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const link = findLinkByHref(result, '/docs/installation');
      expect(link).not.toBeNull();
    });

    it('should render link text matching nav item title', async () => {
      /**
       * Given: createSidebar with mockNavigation
       * When: Inspecting link text
       * Then: Link text should match nav item title
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const link = findLinkByHref(result, '/docs');
      expect(link).not.toBeNull();
      if (link) {
        const text = getAllTextContent(link);
        expect(text).toContain('Introduction');
      }
    });
  });

  // ==================== Active Link State ====================

  describe('active link state', () => {
    it('should apply active class to current path link', async () => {
      /**
       * Given: createSidebar with currentPath="/docs"
       * When: Inspecting /docs link
       * Then: Should have active styling classes
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const activeLink = findLinkByHref(result, '/docs');
      expect(activeLink).not.toBeNull();
      if (activeLink) {
        // Active link should have primary color styling
        expect(hasClass(activeLink, 'bg-primary/10')).toBe(true);
      }
    });

    it('should apply font-medium class to active link', async () => {
      /**
       * Given: createSidebar with currentPath="/docs"
       * When: Inspecting active link
       * Then: Should have font-medium class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const activeLink = findLinkByHref(result, '/docs');
      expect(activeLink).not.toBeNull();
      if (activeLink) {
        expect(hasClass(activeLink, 'font-medium')).toBe(true);
      }
    });

    it('should apply text-primary class to active link', async () => {
      /**
       * Given: createSidebar with currentPath="/docs"
       * When: Inspecting active link
       * Then: Should have text-primary class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const activeLink = findLinkByHref(result, '/docs');
      expect(activeLink).not.toBeNull();
      if (activeLink) {
        expect(hasClass(activeLink, 'text-primary')).toBe(true);
      }
    });

    it('should apply inactive class to non-matching links', async () => {
      /**
       * Given: createSidebar with currentPath="/docs"
       * When: Inspecting other links
       * Then: Should have inactive styling
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const inactiveLink = findLinkByHref(result, '/docs/installation');
      expect(inactiveLink).not.toBeNull();
      if (inactiveLink) {
        expect(hasClass(inactiveLink, 'text-muted-foreground')).toBe(true);
      }
    });

    it('should use exact match for active state (not startsWith)', async () => {
      /**
       * Given: createSidebar with currentPath="/docs/installation"
       * When: Checking /docs link
       * Then: /docs link should NOT be active (exact match only)
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs/installation',
        navigation: mockNavigation,
      });

      const docsLink = findLinkByHref(result, '/docs');
      expect(docsLink).not.toBeNull();
      if (docsLink) {
        // /docs should be inactive when on /docs/installation
        expect(hasClass(docsLink, 'text-muted-foreground')).toBe(true);
      }

      const installationLink = findLinkByHref(result, '/docs/installation');
      expect(installationLink).not.toBeNull();
      if (installationLink) {
        // /docs/installation should be active
        expect(hasClass(installationLink, 'bg-primary/10')).toBe(true);
      }
    });
  });

  // ==================== Badge Support ====================

  describe('badge support', () => {
    it('should render badge when nav item has badge property', async () => {
      /**
       * Given: createSidebar with nav item containing badge
       * When: Inspecting link
       * Then: Should render badge element
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      // Find the State Management link which has a "New" badge
      const stateLink = findLinkByHref(result, '/docs/state');
      expect(stateLink).not.toBeNull();
      if (stateLink) {
        const spans = findElementsByTag(stateLink, 'span');
        const badgeSpan = spans.find((span) => {
          const text = getTextContent(span);
          return text === 'New';
        });
        expect(badgeSpan).toBeDefined();
      }
    });

    it('should apply badge styling classes', async () => {
      /**
       * Given: createSidebar with nav item containing badge
       * When: Inspecting badge element
       * Then: Should have badge styling classes
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const stateLink = findLinkByHref(result, '/docs/state');
      expect(stateLink).not.toBeNull();
      if (stateLink) {
        const spans = findElementsByTag(stateLink, 'span');
        const badgeSpan = spans.find((span) => {
          const text = getTextContent(span);
          return text === 'New';
        });
        expect(badgeSpan).toBeDefined();
        if (badgeSpan) {
          expect(hasClass(badgeSpan, 'rounded-full')).toBe(true);
        }
      }
    });

    it('should not render badge when nav item has no badge property', async () => {
      /**
       * Given: createSidebar with nav item without badge
       * When: Inspecting link
       * Then: Should not have badge span
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      // Find the Installation link which has no badge
      const installationLink = findLinkByHref(result, '/docs/installation');
      expect(installationLink).not.toBeNull();
      if (installationLink) {
        const text = getAllTextContent(installationLink);
        // Should only contain "Installation", no badge text
        expect(text.trim()).toBe('Installation');
      }
    });
  });

  // ==================== Empty Navigation ====================

  describe('empty navigation', () => {
    it('should handle empty navigation array', async () => {
      /**
       * Given: createSidebar with empty navigation
       * When: Creating sidebar
       * Then: Should render without errors
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: emptyNav,
      });

      expect(result).toBeDefined();
      expect(result.kind).toBe('element');
    });

    it('should render no sections for empty navigation', async () => {
      /**
       * Given: createSidebar with empty navigation
       * When: Inspecting rendered output
       * Then: Should have no h3 or ul elements
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: emptyNav,
      });

      const h3Elements = findElementsByTag(result, 'h3');
      const ulElements = findElementsByTag(result, 'ul');
      expect(h3Elements.length).toBe(0);
      expect(ulElements.length).toBe(0);
    });
  });

  // ==================== Single Section ====================

  describe('single section navigation', () => {
    it('should render single section correctly', async () => {
      /**
       * Given: createSidebar with single section navigation
       * When: Inspecting rendered output
       * Then: Should have one h3 and one ul
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/reference/api',
        navigation: singleSectionNav,
      });

      const h3Elements = findElementsByTag(result, 'h3');
      const ulElements = findElementsByTag(result, 'ul');
      expect(h3Elements.length).toBe(1);
      expect(ulElements.length).toBe(1);
    });

    it('should render section title for single section', async () => {
      /**
       * Given: createSidebar with single section navigation
       * When: Inspecting h3 element
       * Then: Should contain "Reference" text
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/reference/api',
        navigation: singleSectionNav,
      });

      const h3Elements = findElementsByTag(result, 'h3');
      expect(h3Elements.length).toBe(1);
      const title = getTextContent(h3Elements[0]);
      expect(title).toBe('Reference');
    });
  });

  // ==================== Nav Element ====================

  describe('nav element', () => {
    it('should wrap sections in nav element', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting structure
       * Then: Should have nav element containing sections
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const navElement = findElementByTag(result, 'nav');
      expect(navElement).not.toBeNull();
    });

    it('should have space-y-6 class on nav for section spacing', async () => {
      /**
       * Given: createSidebar function
       * When: Inspecting nav element
       * Then: Should have space-y-6 class
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs',
        navigation: mockNavigation,
      });

      const navElement = findElementByTag(result, 'nav');
      expect(navElement).not.toBeNull();
      if (navElement) {
        expect(hasClass(navElement, 'space-y-6')).toBe(true);
      }
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle path with trailing slash', async () => {
      /**
       * Given: createSidebar with path containing trailing slash
       * When: Checking active state
       * Then: Should match correctly (or normalize)
       *
       * Note: Implementation should handle this gracefully
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/docs/',
        navigation: mockNavigation,
      });

      // Should not throw
      expect(result).toBeDefined();
    });

    it('should handle navigation with special characters in titles', async () => {
      /**
       * Given: createSidebar with special characters in nav titles
       * When: Rendering
       * Then: Should handle without errors
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const specialNav: NavSection[] = [
        {
          title: 'API & SDK',
          items: [{ title: '@constela/core', href: '/api/core' }],
        },
      ];

      const { createSidebar } = await import('./sidebar');
      const result = createSidebar({
        currentPath: '/api/core',
        navigation: specialNav,
      });

      expect(result).toBeDefined();
      const h3 = findElementsByTag(result, 'h3')[0];
      if (h3) {
        const title = getTextContent(h3);
        expect(title).toBe('API & SDK');
      }
    });

    it('should return consistent structure on multiple calls with same options', async () => {
      /**
       * Given: createSidebar function
       * When: Called multiple times with same options
       * Then: Should return consistent structure (pure function)
       *
       * RED PHASE: This test will FAIL - sidebar.ts does not exist
       */
      const { createSidebar } = await import('./sidebar');
      const options = {
        currentPath: '/docs',
        navigation: mockNavigation,
      };

      const result1 = createSidebar(options);
      const result2 = createSidebar(options);

      expect(result1.kind).toBe(result2.kind);
      if (isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
        expect(result1.children?.length).toBe(result2.children?.length);
      }
    });
  });
});
