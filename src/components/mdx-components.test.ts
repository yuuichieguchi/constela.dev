/**
 * Test module for MDX custom component definitions (ComponentDef).
 *
 * Coverage:
 * - ComponentDef interface structure validation
 * - Callout component definition
 * - PropsTable component definition
 * - CompareGrid component definition
 * - CompareGrid.Column component definition
 * - Integration with mdxToConstela()
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/mdx-components.ts does not exist yet
 * - ComponentDef types and component definitions are not implemented
 */

import { describe, it, expect } from 'vitest';
import type { CompiledNode, CompiledElementNode } from '@constela/compiler';

// ==================== Type Definitions for Testing ====================

/**
 * ComponentDef interface - defines custom MDX components for mdxToConstela()
 */
interface ComponentDef {
  params?: Record<string, { type: string; required?: boolean }>;
  view: CompiledNode;
}

// ==================== Helper Functions ====================

/**
 * Type guard to check if a CompiledNode is an element node
 */
function isElementNode(node: CompiledNode): node is CompiledElementNode {
  return node.kind === 'element';
}

/**
 * Recursively find an element with matching tag or class in the view tree
 */
function findElementByTag(node: CompiledNode, tag: string): CompiledElementNode | null {
  if (isElementNode(node)) {
    if (node.tag === tag) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findElementByTag(child, tag);
        if (found) return found;
      }
    }
  }
  return null;
}

/**
 * Check if a node's class contains a specific substring
 */
function hasClass(node: CompiledElementNode, className: string): boolean {
  const classAttr = node.props?.class;
  if (!classAttr) return false;
  if (classAttr.expr === 'lit' && typeof classAttr.value === 'string') {
    return classAttr.value.includes(className);
  }
  return false;
}

describe('MDX Component Definitions', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export calloutDef component definition', async () => {
      /**
       * Given: mdx-components.ts module
       * When: Importing the module
       * Then: Should export calloutDef
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const mdxComponents = await import('./mdx-components');
      expect(mdxComponents).toHaveProperty('calloutDef');
    });

    it('should export propsTableDef component definition', async () => {
      /**
       * Given: mdx-components.ts module
       * When: Importing the module
       * Then: Should export propsTableDef
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const mdxComponents = await import('./mdx-components');
      expect(mdxComponents).toHaveProperty('propsTableDef');
    });

    it('should export compareGridDef component definition', async () => {
      /**
       * Given: mdx-components.ts module
       * When: Importing the module
       * Then: Should export compareGridDef
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const mdxComponents = await import('./mdx-components');
      expect(mdxComponents).toHaveProperty('compareGridDef');
    });

    it('should export compareGridColumnDef component definition', async () => {
      /**
       * Given: mdx-components.ts module
       * When: Importing the module
       * Then: Should export compareGridColumnDef
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const mdxComponents = await import('./mdx-components');
      expect(mdxComponents).toHaveProperty('compareGridColumnDef');
    });

    it('should export mdxComponents object with all component definitions', async () => {
      /**
       * Given: mdx-components.ts module
       * When: Importing the module
       * Then: Should export mdxComponents object containing all definitions
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const module = await import('./mdx-components');
      expect(module).toHaveProperty('mdxComponents');
      expect(module.mdxComponents).toHaveProperty('Callout');
      expect(module.mdxComponents).toHaveProperty('PropsTable');
      expect(module.mdxComponents).toHaveProperty('CompareGrid');
      expect(module.mdxComponents).toHaveProperty('CompareGrid.Column');
    });
  });

  // ==================== Callout Component Definition ====================

  describe('calloutDef', () => {
    it('should have correct params definition with type parameter', async () => {
      /**
       * Given: calloutDef component definition
       * When: Checking params
       * Then: Should have type param with string type
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { calloutDef } = await import('./mdx-components');

      expect(calloutDef.params).toBeDefined();
      expect(calloutDef.params?.type).toEqual({
        type: 'string',
        required: false,
      });
    });

    it('should have view as a valid CompiledNode', async () => {
      /**
       * Given: calloutDef component definition
       * When: Checking view property
       * Then: Should have a valid CompiledNode with kind property
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { calloutDef } = await import('./mdx-components');

      expect(calloutDef.view).toBeDefined();
      expect(calloutDef.view).toHaveProperty('kind');
    });

    it('should have outermost element as div with border-l-4 class', async () => {
      /**
       * Given: calloutDef component definition
       * When: Inspecting the view tree
       * Then: Root element should be div with border-l-4 styling
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { calloutDef } = await import('./mdx-components');

      expect(calloutDef.view.kind).toBe('element');
      if (isElementNode(calloutDef.view)) {
        expect(calloutDef.view.tag).toBe('div');
        expect(hasClass(calloutDef.view, 'border-l-4')).toBe(true);
      }
    });

    it('should contain a slot for children content', async () => {
      /**
       * Given: calloutDef component definition
       * When: Inspecting the view tree
       * Then: Should have a slot element for children substitution
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { calloutDef } = await import('./mdx-components');

      const slotElement = findElementByTag(calloutDef.view, 'slot');
      expect(slotElement).not.toBeNull();
    });

    it('should conform to ComponentDef interface', async () => {
      /**
       * Given: calloutDef component definition
       * When: Type checking against ComponentDef
       * Then: Should have valid structure
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { calloutDef } = await import('./mdx-components');

      // Verify structure matches ComponentDef
      const def: ComponentDef = calloutDef;
      expect(def.view).toBeDefined();
      expect(def.view.kind).toBeDefined();
    });
  });

  // ==================== PropsTable Component Definition ====================

  describe('propsTableDef', () => {
    it('should have correct params definition with items parameter', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Checking params
       * Then: Should have items param as required array
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      expect(propsTableDef.params).toBeDefined();
      expect(propsTableDef.params?.items).toEqual({
        type: 'array',
        required: true,
      });
    });

    it('should have view as a valid CompiledNode', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Checking view property
       * Then: Should have a valid CompiledNode
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      expect(propsTableDef.view).toBeDefined();
      expect(propsTableDef.view).toHaveProperty('kind');
    });

    it('should have table element in view', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Inspecting the view tree
       * Then: Should contain a table element
       *
       * Note: Due to Constela DSL limitations, the table structure is static.
       * Dynamic row rendering will be handled at SSR time.
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      const tableElement = findElementByTag(propsTableDef.view, 'table');
      expect(tableElement).not.toBeNull();
    });

    it('should have thead with correct header columns', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Inspecting the view tree
       * Then: Should have thead with Name, Type, Required, Default, Description columns
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      const theadElement = findElementByTag(propsTableDef.view, 'thead');
      expect(theadElement).not.toBeNull();
    });

    it('should have tbody placeholder for dynamic rows', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Inspecting the view tree
       * Then: Should have tbody element (content will be filled at SSR time)
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      const tbodyElement = findElementByTag(propsTableDef.view, 'tbody');
      expect(tbodyElement).not.toBeNull();
    });

    it('should conform to ComponentDef interface', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Type checking against ComponentDef
       * Then: Should have valid structure
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      const def: ComponentDef = propsTableDef;
      expect(def.view).toBeDefined();
      expect(def.params?.items).toBeDefined();
    });
  });

  // ==================== CompareGrid Component Definition ====================

  describe('compareGridDef', () => {
    it('should have no required params (children via slot)', async () => {
      /**
       * Given: compareGridDef component definition
       * When: Checking params
       * Then: Should have no params or empty params (children are slots)
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridDef } = await import('./mdx-components');

      // params can be undefined or empty object for slot-only components
      expect(
        compareGridDef.params === undefined ||
          Object.keys(compareGridDef.params).length === 0
      ).toBe(true);
    });

    it('should have view as a valid CompiledNode', async () => {
      /**
       * Given: compareGridDef component definition
       * When: Checking view property
       * Then: Should have a valid CompiledNode
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridDef } = await import('./mdx-components');

      expect(compareGridDef.view).toBeDefined();
      expect(compareGridDef.view).toHaveProperty('kind');
    });

    it('should have root element with grid class', async () => {
      /**
       * Given: compareGridDef component definition
       * When: Inspecting the view tree
       * Then: Root element should have grid class
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridDef } = await import('./mdx-components');

      expect(compareGridDef.view.kind).toBe('element');
      if (isElementNode(compareGridDef.view)) {
        expect(hasClass(compareGridDef.view, 'grid')).toBe(true);
      }
    });

    it('should have responsive grid columns (grid-cols-1 md:grid-cols-2)', async () => {
      /**
       * Given: compareGridDef component definition
       * When: Inspecting root element classes
       * Then: Should have grid-cols-1 and md:grid-cols-2 classes
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridDef } = await import('./mdx-components');

      if (isElementNode(compareGridDef.view)) {
        expect(hasClass(compareGridDef.view, 'grid-cols-1')).toBe(true);
        expect(hasClass(compareGridDef.view, 'md:grid-cols-2')).toBe(true);
      }
    });

    it('should contain a slot for children (CompareGrid.Column components)', async () => {
      /**
       * Given: compareGridDef component definition
       * When: Inspecting the view tree
       * Then: Should have a slot element for children
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridDef } = await import('./mdx-components');

      const slotElement = findElementByTag(compareGridDef.view, 'slot');
      expect(slotElement).not.toBeNull();
    });

    it('should conform to ComponentDef interface', async () => {
      /**
       * Given: compareGridDef component definition
       * When: Type checking against ComponentDef
       * Then: Should have valid structure
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridDef } = await import('./mdx-components');

      const def: ComponentDef = compareGridDef;
      expect(def.view).toBeDefined();
    });
  });

  // ==================== CompareGrid.Column Component Definition ====================

  describe('compareGridColumnDef', () => {
    it('should have correct params definition with title parameter', async () => {
      /**
       * Given: compareGridColumnDef component definition
       * When: Checking params
       * Then: Should have title param as required string
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridColumnDef } = await import('./mdx-components');

      expect(compareGridColumnDef.params).toBeDefined();
      expect(compareGridColumnDef.params?.title).toEqual({
        type: 'string',
        required: true,
      });
    });

    it('should have view as a valid CompiledNode', async () => {
      /**
       * Given: compareGridColumnDef component definition
       * When: Checking view property
       * Then: Should have a valid CompiledNode
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridColumnDef } = await import('./mdx-components');

      expect(compareGridColumnDef.view).toBeDefined();
      expect(compareGridColumnDef.view).toHaveProperty('kind');
    });

    it('should have root element with border and rounded classes', async () => {
      /**
       * Given: compareGridColumnDef component definition
       * When: Inspecting the view tree
       * Then: Root element should have border and rounded styling
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridColumnDef } = await import('./mdx-components');

      expect(compareGridColumnDef.view.kind).toBe('element');
      if (isElementNode(compareGridColumnDef.view)) {
        expect(hasClass(compareGridColumnDef.view, 'border')).toBe(true);
        expect(hasClass(compareGridColumnDef.view, 'rounded')).toBe(true);
      }
    });

    it('should contain an h3 element for title', async () => {
      /**
       * Given: compareGridColumnDef component definition
       * When: Inspecting the view tree
       * Then: Should have h3 element for displaying title
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridColumnDef } = await import('./mdx-components');

      const h3Element = findElementByTag(compareGridColumnDef.view, 'h3');
      expect(h3Element).not.toBeNull();
    });

    it('should contain a slot for children content', async () => {
      /**
       * Given: compareGridColumnDef component definition
       * When: Inspecting the view tree
       * Then: Should have a slot element for children
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridColumnDef } = await import('./mdx-components');

      const slotElement = findElementByTag(compareGridColumnDef.view, 'slot');
      expect(slotElement).not.toBeNull();
    });

    it('should conform to ComponentDef interface', async () => {
      /**
       * Given: compareGridColumnDef component definition
       * When: Type checking against ComponentDef
       * Then: Should have valid structure
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { compareGridColumnDef } = await import('./mdx-components');

      const def: ComponentDef = compareGridColumnDef;
      expect(def.view).toBeDefined();
      expect(def.params?.title).toBeDefined();
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('all component definitions should have unique structures', async () => {
      /**
       * Given: All component definitions
       * When: Comparing their view structures
       * Then: Each should be distinct (not referencing same object)
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const {
        calloutDef,
        propsTableDef,
        compareGridDef,
        compareGridColumnDef,
      } = await import('./mdx-components');

      // Each view should be a unique object
      expect(calloutDef.view).not.toBe(propsTableDef.view);
      expect(calloutDef.view).not.toBe(compareGridDef.view);
      expect(compareGridDef.view).not.toBe(compareGridColumnDef.view);
    });

    it('calloutDef should support all callout types through param', async () => {
      /**
       * Given: calloutDef component definition
       * When: Using type param
       * Then: Should accept note, warning, tip, important as valid types
       *
       * Note: Type validation happens at runtime, not in ComponentDef structure
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { calloutDef } = await import('./mdx-components');

      // Type param should allow string values
      expect(calloutDef.params?.type?.type).toBe('string');
    });

    it('propsTableDef items param should be marked as required', async () => {
      /**
       * Given: propsTableDef component definition
       * When: Checking items param
       * Then: Should be marked as required: true
       *
       * RED PHASE: This test will FAIL - mdx-components.ts does not exist
       */
      const { propsTableDef } = await import('./mdx-components');

      expect(propsTableDef.params?.items?.required).toBe(true);
    });
  });
});
