/**
 * Test module for Playground page (createPlaygroundPage function).
 *
 * Coverage:
 * - Function signature and return type (CompiledElementNode)
 * - Page structure (root div, header, main, footer)
 * - Main element with pt-[var(--header-height)] class
 * - Escape container with data-constela-escape="playground" attribute
 * - Full Playground UI structure (header with title/buttons, editor/preview grid)
 * - Editor container with data-constela-escape="monaco" attribute
 * - Preview container with id="preview-container"
 * - Message container with id="message-container"
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
 * Find element by class name (exact or partial match)
 */
function findElementByClass(
  node: CompiledNode,
  className: string
): CompiledElementNode | null {
  if (isElementNode(node)) {
    if (hasClass(node, className)) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findElementByClass(child, className);
        if (found) return found;
      }
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

// ==================== Tests ====================

describe('Playground Page (createPlaygroundPage)', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export createPlaygroundPage function', async () => {
      /**
       * Given: playground/index.ts module
       * When: Importing the module
       * Then: Should export createPlaygroundPage function
       */
      const module = await import('./index');
      expect(module).toHaveProperty('createPlaygroundPage');
      expect(typeof module.createPlaygroundPage).toBe('function');
    });
  });

  // ==================== Return Type ====================

  describe('return type', () => {
    it('should return a CompiledNode with kind property', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Called
       * Then: Should return a CompiledNode with kind property
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      expect(result).toHaveProperty('kind');
    });

    it('should return an element node (CompiledElementNode)', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Called
       * Then: Should return node with kind "element"
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      expect(result.kind).toBe('element');
    });
  });

  // ==================== Page Structure ====================

  describe('page structure', () => {
    it('should have div tag as root element', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting root element
       * Then: Should have tag "div"
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      expect(isElementNode(result)).toBe(true);
      if (isElementNode(result)) {
        expect(result.tag).toBe('div');
      }
    });

    it('should have min-h-screen class on root element', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting root element classes
       * Then: Should include min-h-screen class
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      if (isElementNode(result)) {
        expect(hasClass(result, 'min-h-screen')).toBe(true);
      }
    });

    it('should contain header element', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain header element
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const header = findElementByTag(result, 'header');
      expect(header).not.toBeNull();
    });

    it('should contain main element', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain main element
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
    });

    it('should contain footer element', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain footer element
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const footer = findElementByTag(result, 'footer');
      expect(footer).not.toBeNull();
    });

    it('should have main element with pt-[var(--header-height)] class', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting main element
       * Then: Should have padding-top class for header offset
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const main = findElementByTag(result, 'main');
      expect(main).not.toBeNull();
      if (main) {
        expect(hasClass(main, 'pt-[var(--header-height)]')).toBe(true);
      }
    });
  });

  // ==================== Escape Container ====================

  describe('escape container', () => {
    it('should contain div with data-constela-escape="playground" attribute', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain escape container for client-side mounting
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const escapeContainer = findElementByAttribute(
        result,
        'data-constela-escape',
        'playground'
      );
      expect(escapeContainer).not.toBeNull();
    });
  });

  // ==================== Playground UI Structure ====================

  describe('playground UI structure', () => {
    it('should contain "Playground" title text', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page content
       * Then: Should contain Playground title
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Playground');
    });

    it('should contain Validate button', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page content
       * Then: Should contain Validate button text
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Validate');
    });

    it('should contain Run button', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page content
       * Then: Should contain Run button text
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Run');
    });

    it('should contain button with id="validate-btn"', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain validate button with id
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const validateBtn = findElementByAttribute(result, 'id', 'validate-btn');
      expect(validateBtn).not.toBeNull();
      expect(validateBtn?.tag).toBe('button');
    });

    it('should contain button with id="run-btn"', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain run button with id
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const runBtn = findElementByAttribute(result, 'id', 'run-btn');
      expect(runBtn).not.toBeNull();
      expect(runBtn?.tag).toBe('button');
    });

    it('should contain editor container with data-constela-escape="monaco"', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain monaco editor escape container
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const editorContainer = findElementByAttribute(
        result,
        'data-constela-escape',
        'monaco'
      );
      expect(editorContainer).not.toBeNull();
    });

    it('should contain editor container with id="editor-container"', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain editor container with id
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const editorContainer = findElementByAttribute(result, 'id', 'editor-container');
      expect(editorContainer).not.toBeNull();
    });

    it('should contain preview container with id="preview-container"', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain preview container with id
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const previewContainer = findElementByAttribute(result, 'id', 'preview-container');
      expect(previewContainer).not.toBeNull();
    });

    it('should contain message container with id="message-container"', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page structure
       * Then: Should contain message container for errors/success
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const messageContainer = findElementByAttribute(result, 'id', 'message-container');
      expect(messageContainer).not.toBeNull();
    });

    it('should contain "Editor" label text', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page content
       * Then: Should contain Editor panel label
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Editor');
    });

    it('should contain "Preview" label text', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Inspecting page content
       * Then: Should contain Preview panel label
       */
      const { createPlaygroundPage } = await import('./index');
      const result = createPlaygroundPage();

      const textContent = getAllTextContent(result);
      expect(textContent).toContain('Preview');
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should be callable without arguments', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Called with no arguments
       * Then: Should not throw and return valid node
       */
      const { createPlaygroundPage } = await import('./index');

      expect(() => createPlaygroundPage()).not.toThrow();
      const result = createPlaygroundPage();
      expect(result).toBeDefined();
    });

    it('should return consistent structure on multiple calls', async () => {
      /**
       * Given: createPlaygroundPage function
       * When: Called multiple times
       * Then: Should return same structure (pure function)
       */
      const { createPlaygroundPage } = await import('./index');

      const result1 = createPlaygroundPage();
      const result2 = createPlaygroundPage();

      expect(result1.kind).toBe(result2.kind);
      if (isElementNode(result1) && isElementNode(result2)) {
        expect(result1.tag).toBe(result2.tag);
      }
    });
  });
});
