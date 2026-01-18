/**
 * Test suite for examples/[slug].json layout and structure
 *
 * Coverage:
 * - Features Used section data path (should use featuresPreview, not features)
 * - Features Used section category-based styling
 * - Layout section order validation
 *
 * Expected layout order:
 * 1. Header (title, description, back link)
 * 2. Try in Playground section
 * 3. Features Used section
 * 4. How to Run section
 * 5. Source Code section (LAST)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Type definitions for [slug].json structure
interface TextNode {
  kind: 'text';
  value: { expr: string; value?: string; name?: string; path?: string };
}

interface ElementNode {
  kind: 'element';
  tag: string;
  props?: Record<string, unknown>;
  children?: ViewNode[];
}

interface EachNode {
  kind: 'each';
  items: { expr: string; path?: string; base?: unknown };
  as: string;
  body: ViewNode;
}

interface CodeNode {
  kind: 'code';
  content: unknown;
  language: unknown;
}

type ViewNode = TextNode | ElementNode | EachNode | CodeNode;

interface SlugJson {
  version: string;
  route: {
    path: string;
    layout: string;
    meta: Record<string, string>;
  };
  imports?: Record<string, string>;
  getStaticPaths?: unknown;
  view: ViewNode;
}

// Helper function to extract text content from a node recursively
function extractTextContent(node: ViewNode): string {
  if (node.kind === 'text') {
    return node.value.value ?? '';
  }
  if (node.kind === 'element' && node.children) {
    return node.children.map(extractTextContent).join('');
  }
  if (node.kind === 'each' && node.body) {
    return extractTextContent(node.body);
  }
  return '';
}

// Helper function to find all elements by tag name
function findElementsByTag(node: ViewNode, tag: string): ElementNode[] {
  const results: ElementNode[] = [];

  if (node.kind === 'element') {
    if (node.tag === tag) {
      results.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        results.push(...findElementsByTag(child, tag));
      }
    }
  }
  if (node.kind === 'each' && node.body) {
    results.push(...findElementsByTag(node.body, tag));
  }

  return results;
}

// Helper function to find elements with specific text content
function findElementWithText(node: ViewNode, tag: string, textPattern: RegExp): ElementNode | null {
  if (node.kind === 'element') {
    if (node.tag === tag) {
      const text = extractTextContent(node);
      if (textPattern.test(text)) {
        return node;
      }
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findElementWithText(child, tag, textPattern);
        if (found) return found;
      }
    }
  }
  if (node.kind === 'each' && node.body) {
    return findElementWithText(node.body, tag, textPattern);
  }
  return null;
}

// Helper function to find section containing specific heading text
function findSectionWithHeading(node: ViewNode, headingPattern: RegExp): ElementNode | null {
  if (node.kind === 'element' && node.tag === 'section') {
    const h2s = findElementsByTag(node, 'h2');
    for (const h2 of h2s) {
      const text = extractTextContent(h2);
      if (headingPattern.test(text)) {
        return node;
      }
    }
  }

  if (node.kind === 'element' && node.children) {
    for (const child of node.children) {
      const found = findSectionWithHeading(child, headingPattern);
      if (found) return found;
    }
  }

  return null;
}

// Helper function to find all each nodes with their data path
function findEachNodes(node: ViewNode): EachNode[] {
  const results: EachNode[] = [];

  if (node.kind === 'each') {
    results.push(node);
  }
  if (node.kind === 'element' && node.children) {
    for (const child of node.children) {
      results.push(...findEachNodes(child));
    }
  }

  return results;
}

// Helper function to extract class value from props
function getClassValue(props: Record<string, unknown> | undefined): string {
  if (!props?.class) return '';
  const classObj = props.class as { value?: string; expr?: string };
  if (classObj.value) return classObj.value;
  return '';
}

// Helper to check if an expression contains conditional class logic
function hasConditionalExpr(props: Record<string, unknown> | undefined): boolean {
  if (!props?.class) return false;
  const classObj = props.class as { expr?: string };
  return classObj.expr === 'cond';
}

// Helper function to find section order by examining view children
function getSectionOrder(view: ViewNode): string[] {
  const order: string[] = [];

  if (view.kind !== 'element' || !view.children) return order;

  for (const child of view.children) {
    if (child.kind === 'element') {
      // Check for header
      if (child.tag === 'header') {
        order.push('Header');
        continue;
      }

      // Check for section with h2
      if (child.tag === 'section') {
        const h2s = findElementsByTag(child, 'h2');
        if (h2s.length > 0) {
          const text = extractTextContent(h2s[0]);
          if (text) {
            order.push(text);
          }
        } else {
          // Section without h2 - check for "Try in Playground" link
          const anchors = findElementsByTag(child, 'a');
          for (const anchor of anchors) {
            const text = extractTextContent(anchor);
            if (/Try in Playground/i.test(text)) {
              order.push('Try in Playground');
              break;
            }
          }
        }
      }
    }
  }

  return order;
}

// Helper to get data path from each node's items expression
function getEachDataPath(eachNode: EachNode): string | null {
  const items = eachNode.items as { expr: string; path?: string; base?: { path?: string } };
  if (items.path) return items.path;
  if (items.base && typeof items.base === 'object' && 'path' in items.base) {
    return items.base.path as string;
  }
  return null;
}

describe('examples/[slug].json Layout Tests', () => {
  // ==================== Setup ====================

  let slugJson: SlugJson;

  beforeAll(() => {
    const slugPath = join(__dirname, '../../examples/[slug].json');
    const content = readFileSync(slugPath, 'utf-8');
    slugJson = JSON.parse(content) as SlugJson;
  });

  // ==================== Features Used Data Path ====================

  describe('Features Used section data path', () => {
    it('should use featuresPreview path (not features)', () => {
      /**
       * Given: The [slug].json view structure
       * When: Looking at the Features Used section's each loop
       * Then: The data path should be "featuresPreview" (not "features")
       *
       * CURRENT BUG: Code uses "features" which doesn't exist in examples.json
       * The correct path is "featuresPreview"
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      // Find the each loop in the features section
      const eachNodes = findEachNodes(featuresSection!);
      expect(eachNodes.length).toBeGreaterThan(0);

      // The items expression should reference "featuresPreview"
      const featureEach = eachNodes[0];
      const dataPath = getEachDataPath(featureEach);

      // This test should FAIL because current code uses "features" instead of "featuresPreview"
      expect(dataPath).toBe('featuresPreview');
    });

    it('should iterate over feature objects with name and category properties', () => {
      /**
       * Given: The Features Used section with correct data binding
       * When: Rendering feature items
       * Then: Each item should have access to name and category from featuresPreview
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      const eachNodes = findEachNodes(featuresSection!);
      expect(eachNodes.length).toBeGreaterThan(0);

      const featureEach = eachNodes[0];

      // The body should reference feature.name for display
      // Current implementation just shows the feature as a string, not an object property
      const bodyText = extractTextContent(featureEach.body);
      // We expect the body to use feature.name, not just feature
      // This validates that the data structure expectation is correct

      // Check if the body element accesses .name property
      const body = featureEach.body as ElementNode;
      const textNodes = findTextNodesWithPath(body, 'name');

      // Should have at least one text node that accesses the "name" property
      expect(textNodes.length).toBeGreaterThan(0);
    });
  });

  // ==================== Category-based Styling ====================

  describe('Features Used section category-based styling', () => {
    it('should have conditional class expression for category-based colors', () => {
      /**
       * Given: The Features Used section
       * When: Rendering feature chips
       * Then: The class should be conditional based on category
       *
       * CURRENT BUG: Code uses static class without category differentiation
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      const eachNodes = findEachNodes(featuresSection!);
      expect(eachNodes.length).toBeGreaterThan(0);

      const featureEach = eachNodes[0];
      const body = featureEach.body as ElementNode;

      // The body element should have a conditional class expression
      expect(hasConditionalExpr(body.props)).toBe(true);
    });

    it('should apply purple styling for state category features', () => {
      /**
       * Given: A feature with category "state"
       * When: Rendering the feature chip
       * Then: Should have purple text color (text-purple-*)
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      const eachNodes = findEachNodes(featuresSection!);
      const featureEach = eachNodes[0];
      const body = featureEach.body as ElementNode;

      // Check if class contains purple styling reference
      const classExpr = body.props?.class as { expr?: string; cases?: unknown[] } | undefined;

      // Should have conditional expression checking for "state" category
      const classStr = JSON.stringify(classExpr);
      expect(classStr).toMatch(/purple/i);
    });

    it('should apply cyan styling for action category features', () => {
      /**
       * Given: A feature with category "action"
       * When: Rendering the feature chip
       * Then: Should have cyan text color (text-cyan-*)
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      const eachNodes = findEachNodes(featuresSection!);
      const featureEach = eachNodes[0];
      const body = featureEach.body as ElementNode;

      const classExpr = body.props?.class;
      const classStr = JSON.stringify(classExpr);

      expect(classStr).toMatch(/cyan/i);
    });

    it('should apply pink styling for component category features', () => {
      /**
       * Given: A feature with category "component"
       * When: Rendering the feature chip
       * Then: Should have pink text color (text-pink-*)
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      const eachNodes = findEachNodes(featuresSection!);
      const featureEach = eachNodes[0];
      const body = featureEach.body as ElementNode;

      const classExpr = body.props?.class;
      const classStr = JSON.stringify(classExpr);

      expect(classStr).toMatch(/pink/i);
    });

    it('should apply gray styling as default for other categories', () => {
      /**
       * Given: A feature with category other than state/action/component
       * When: Rendering the feature chip
       * Then: Should have gray text color as fallback
       */
      const featuresSection = findSectionWithHeading(slugJson.view, /Features Used/i);
      expect(featuresSection).not.toBeNull();

      const eachNodes = findEachNodes(featuresSection!);
      const featureEach = eachNodes[0];
      const body = featureEach.body as ElementNode;

      const classExpr = body.props?.class;
      const classStr = JSON.stringify(classExpr);

      // Should have a default/fallback case with gray styling
      expect(classStr).toMatch(/gray|muted-foreground/i);
    });
  });

  // ==================== Layout Order Validation ====================

  describe('Layout section order', () => {
    it('should have Try in Playground section BEFORE Source Code section', () => {
      /**
       * Given: The [slug].json view structure
       * When: Checking the order of sections
       * Then: "Try in Playground" should appear before "Source Code"
       *
       * CURRENT BUG: Source Code comes before Try in Playground
       */
      const order = getSectionOrder(slugJson.view);

      const tryPlaygroundIndex = order.findIndex(s => /Try in Playground/i.test(s));
      const sourceCodeIndex = order.findIndex(s => /Source Code/i.test(s));

      expect(tryPlaygroundIndex).toBeGreaterThan(-1);
      expect(sourceCodeIndex).toBeGreaterThan(-1);

      // Try in Playground should come BEFORE Source Code
      expect(tryPlaygroundIndex).toBeLessThan(sourceCodeIndex);
    });

    it('should have Source Code section as the LAST main content section', () => {
      /**
       * Given: The [slug].json view structure
       * When: Checking the position of Source Code section
       * Then: Source Code should be the last section in the layout
       *
       * CURRENT BUG: Source Code is not last (Try in Playground is last)
       */
      const order = getSectionOrder(slugJson.view);

      const sourceCodeIndex = order.findIndex(s => /Source Code/i.test(s));
      const lastIndex = order.length - 1;

      // Source Code should be the last section
      expect(sourceCodeIndex).toBe(lastIndex);
    });

    it('should have correct overall section order', () => {
      /**
       * Given: The [slug].json view structure
       * When: Checking all section positions
       * Then: Order should be Header → Try in Playground → Features Used → How to Run → Source Code
       */
      const order = getSectionOrder(slugJson.view);

      const expectedOrder = [
        'Header',
        'Try in Playground',
        'Features Used',
        'How to Run',
        'Source Code'
      ];

      // Match against expected patterns
      expect(order.length).toBe(expectedOrder.length);

      for (let i = 0; i < expectedOrder.length; i++) {
        const pattern = new RegExp(expectedOrder[i], 'i');
        expect(order[i]).toMatch(pattern);
      }
    });

    it('should have Features Used section after Try in Playground', () => {
      /**
       * Given: The [slug].json view structure
       * When: Checking section positions
       * Then: Features Used should come after Try in Playground
       */
      const order = getSectionOrder(slugJson.view);

      const tryPlaygroundIndex = order.findIndex(s => /Try in Playground/i.test(s));
      const featuresIndex = order.findIndex(s => /Features Used/i.test(s));

      expect(featuresIndex).toBeGreaterThan(tryPlaygroundIndex);
    });

    it('should have How to Run section before Source Code', () => {
      /**
       * Given: The [slug].json view structure
       * When: Checking section positions
       * Then: How to Run should come immediately before Source Code
       */
      const order = getSectionOrder(slugJson.view);

      const howToRunIndex = order.findIndex(s => /How to Run/i.test(s));
      const sourceCodeIndex = order.findIndex(s => /Source Code/i.test(s));

      expect(howToRunIndex).toBeLessThan(sourceCodeIndex);
      // Should be immediately before
      expect(sourceCodeIndex - howToRunIndex).toBe(1);
    });
  });
});

// Helper to find text nodes that access a specific property path
function findTextNodesWithPath(node: ViewNode, pathName: string): TextNode[] {
  const results: TextNode[] = [];

  if (node.kind === 'text') {
    const value = node.value as { expr?: string; path?: string; name?: string };
    if (value.path === pathName) {
      results.push(node);
    }
  }
  if (node.kind === 'element' && node.children) {
    for (const child of node.children) {
      results.push(...findTextNodesWithPath(child, pathName));
    }
  }

  return results;
}
