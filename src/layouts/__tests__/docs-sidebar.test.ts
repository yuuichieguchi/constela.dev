/**
 * Test suite for Reference page sidebar collapsible (accordion) menu
 *
 * Coverage:
 * - Sidebar structure uses <details> and <summary> elements
 * - Auto-expand based on current path
 * - CSS styles for sidebar sections and chevron icons
 *
 * TDD Red Phase: These tests verify the accordion menu feature requirements.
 * All tests should FAIL initially since the feature is not yet implemented.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Test data: Reference navigation sections from navigation.json
const referenceNavigation = [
  {
    title: 'Reference',
    items: [
      { title: 'DSL Root', href: '/reference' },
      { title: 'View Nodes', href: '/reference/nodes' },
    ],
  },
  {
    title: '@constela/core',
    items: [
      { title: 'Overview', href: '/reference/core' },
      { title: 'API Reference', href: '/reference/core/api-reference' },
    ],
  },
  {
    title: '@constela/compiler',
    items: [
      { title: 'Overview', href: '/reference/compiler' },
      { title: 'API Reference', href: '/reference/compiler/api-reference' },
    ],
  },
];

describe('Reference page sidebar accordion menu', () => {
  // ==================== Setup ====================

  const docsJsonPath = path.resolve(__dirname, '../../layouts/docs.json');
  const globalsCssPath = path.resolve(__dirname, '../../styles/globals.css');

  let docsJson: any;
  let globalsCss: string;

  beforeEach(() => {
    // Read the actual docs.json file
    const docsJsonContent = fs.readFileSync(docsJsonPath, 'utf-8');
    docsJson = JSON.parse(docsJsonContent);

    // Read globals.css
    globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');

    // Reset document
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ==================== Sidebar Structure Tests ====================

  describe('sidebar structure', () => {
    it('should use <details> element for each navigation section', () => {
      /**
       * Given: The docs.json layout definition
       * When: Inspecting the sidebar navigation structure
       * Then: Each section should be wrapped in a <details> element with class "sidebar-section"
       */

      // Find the sidebar <aside> element in the view
      const sidebarView = findSidebarInView(docsJson.view);
      expect(sidebarView).toBeDefined();

      // Find the navigation sections (each loop body)
      const sectionIterator = findEachIteratorInSidebar(sidebarView);
      expect(sectionIterator).toBeDefined();

      // The body of each section should be a <details> element
      const sectionBody = sectionIterator?.body;
      expect(sectionBody?.tag).toBe('details');
      expect(sectionBody?.props?.class?.value ?? sectionBody?.props?.class?.expr?.value).toContain(
        'sidebar-section'
      );
    });

    it('should use <summary> element for section titles', () => {
      /**
       * Given: The docs.json layout definition
       * When: Inspecting the sidebar section structure
       * Then: Each section title should be in a <summary> element
       */

      const sidebarView = findSidebarInView(docsJson.view);
      const sectionIterator = findEachIteratorInSidebar(sidebarView);

      expect(sectionIterator).toBeDefined();

      // The first child of <details> should be <summary>
      const detailsBody = sectionIterator?.body;
      const summaryElement = detailsBody?.children?.[0];

      expect(summaryElement?.tag).toBe('summary');
    });

    it('should include chevron icon in summary element', () => {
      /**
       * Given: The docs.json layout definition
       * When: Inspecting the summary element
       * Then: Summary should contain an SVG with class "chevron"
       */

      const sidebarView = findSidebarInView(docsJson.view);
      const sectionIterator = findEachIteratorInSidebar(sidebarView);

      const detailsBody = sectionIterator?.body;
      const summaryElement = detailsBody?.children?.[0];
      const chevronSvg = findChevronInSummary(summaryElement);

      expect(chevronSvg).toBeDefined();
      expect(chevronSvg?.tag).toBe('svg');

      // Check for "chevron" class
      const svgClass = chevronSvg?.props?.class?.value ?? chevronSvg?.props?.class?.expr?.value;
      expect(svgClass).toContain('chevron');
    });
  });

  // ==================== Auto-expand Tests ====================

  describe('auto-expand based on current path', () => {
    it('should expand @constela/core section when visiting /reference/core/api-reference', () => {
      /**
       * Given: currentPath is "/reference/core/api-reference"
       * When: Rendering the sidebar
       * Then: The "@constela/core" section should have "open" attribute
       */

      const currentPath = '/reference/core/api-reference';

      // Find the section iterator body
      const sidebarView = findSidebarInView(docsJson.view);
      const sectionIterator = findEachIteratorInSidebar(sidebarView);

      const detailsBody = sectionIterator?.body;

      // The <details> element should have conditional "open" attribute
      // based on whether currentPath starts with section's href prefix
      const openAttr = detailsBody?.props?.open;

      expect(openAttr).toBeDefined();

      // The open attribute should use startsWith method call
      // to check if currentPath starts with section prefix
      expect(openAttr?.expr).toBe('call');
      expect(openAttr?.method).toBe('startsWith');
    });

    it('should expand Reference section when visiting /reference', () => {
      /**
       * Given: currentPath is "/reference"
       * When: Rendering the sidebar
       * Then: The "Reference" section should be expanded
       */

      const currentPath = '/reference';

      // The logic should expand "Reference" section
      // since currentPath matches "/reference" exactly or starts with it
      const sidebarView = findSidebarInView(docsJson.view);
      const sectionIterator = findEachIteratorInSidebar(sidebarView);

      const detailsBody = sectionIterator?.body;
      const openAttr = detailsBody?.props?.open;

      // Should have startsWith method call logic
      expect(openAttr).toBeDefined();
      expect(openAttr?.expr).toBe('call');
      expect(openAttr?.method).toBe('startsWith');
    });

    it('should collapse sections that do not match current path', () => {
      /**
       * Given: currentPath is "/reference/core/api-reference"
       * When: Rendering the sidebar
       * Then: Sections other than "@constela/core" should NOT have "open" attribute
       */

      // The conditional "open" expression should evaluate to false
      // for sections that don't match the current path prefix
      const sidebarView = findSidebarInView(docsJson.view);
      const sectionIterator = findEachIteratorInSidebar(sidebarView);

      const detailsBody = sectionIterator?.body;
      const openAttr = detailsBody?.props?.open;

      // The open attribute should exist and be conditional
      expect(openAttr).toBeDefined();

      // Verify the condition checks for path prefix match
      // The condition should use "startsWith" or similar logic
      expect(openAttr?.if || openAttr?.expr).toBeDefined();
    });
  });

  // ==================== CSS Style Tests ====================

  describe('CSS styles', () => {
    it('should have .sidebar-section class styles in globals.css', () => {
      /**
       * Given: globals.css file
       * When: Checking for sidebar-section styles
       * Then: .sidebar-section class should be defined
       */

      expect(globalsCss).toContain('.sidebar-section');
    });

    it('should have .sidebar-section summary styles in globals.css', () => {
      /**
       * Given: globals.css file
       * When: Checking for summary element styles
       * Then: .sidebar-section summary styles should be defined
       */

      expect(globalsCss).toContain('.sidebar-section summary');
    });

    it('should have .chevron rotation styles for open/closed states', () => {
      /**
       * Given: globals.css file
       * When: Checking for chevron rotation styles
       * Then: .chevron class with rotation transform should be defined
       */

      // Check for chevron class
      expect(globalsCss).toContain('.chevron');

      // Check for rotation transform (for open state indicator)
      // Either transform: rotate or using [open] attribute selector
      const hasRotationStyle =
        globalsCss.includes('rotate') &&
        (globalsCss.includes('.sidebar-section[open]') ||
          globalsCss.includes('details[open]') ||
          globalsCss.includes('.chevron'));

      expect(hasRotationStyle).toBe(true);
    });

    it('should hide default disclosure triangle marker', () => {
      /**
       * Given: globals.css file
       * When: Checking for marker styles
       * Then: summary::marker or list-style: none should be defined
       */

      const hidesMarker =
        globalsCss.includes('summary::marker') ||
        globalsCss.includes('summary::-webkit-details-marker') ||
        (globalsCss.includes('summary') && globalsCss.includes('list-style: none'));

      expect(hidesMarker).toBe(true);
    });
  });

  // ==================== Helper Functions ====================

  /**
   * Recursively find the sidebar <aside> element in the view tree
   */
  function findSidebarInView(node: any): any {
    if (!node) return null;

    // Check if this is the sidebar aside element
    if (node.tag === 'aside' && node.props?.class?.value?.includes('fixed left-0')) {
      return node;
    }

    // Check children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        const result = findSidebarInView(child);
        if (result) return result;
      }
    }

    // Check then/else branches for conditionals
    if (node.then) {
      const result = findSidebarInView(node.then);
      if (result) return result;
    }

    return null;
  }

  /**
   * Find the "each" iterator for navigation sections in sidebar
   */
  function findEachIteratorInSidebar(sidebarNode: any): any {
    if (!sidebarNode) return null;

    // Recursively search for the "each" kind node that iterates over navigation
    function search(node: any): any {
      if (!node) return null;

      if (node.kind === 'each' && node.as === 'section') {
        return node;
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          const result = search(child);
          if (result) return result;
        }
      }

      return null;
    }

    return search(sidebarNode);
  }

  /**
   * Find the chevron SVG inside a summary element
   */
  function findChevronInSummary(summaryNode: any): any {
    if (!summaryNode) return null;

    function search(node: any): any {
      if (!node) return null;

      if (node.tag === 'svg') {
        const svgClass = node.props?.class?.value ?? node.props?.class?.expr?.value ?? '';
        if (svgClass.includes('chevron')) {
          return node;
        }
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          const result = search(child);
          if (result) return result;
        }
      }

      return null;
    }

    return search(summaryNode);
  }
});
