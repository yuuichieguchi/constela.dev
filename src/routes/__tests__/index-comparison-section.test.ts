/**
 * Test suite for index.json Performance Comparison section
 *
 * Coverage:
 * - Performance Comparison section existence
 * - Four comparison metrics (Build Time, node_modules Size, Output Size, Deploy Time)
 * - Correct Constela and Next.js values
 *
 * Expected data:
 * | Metric          | Constela | Next.js | Improvement |
 * |-----------------|----------|---------|-------------|
 * | Build Time      | 2.2s     | 12.3s   | 5.6x faster |
 * | node_modules    | 297MB    | 794MB   | 2.7x lighter|
 * | Output Size     | 14MB     | 72MB    | 5.1x lighter|
 * | Deploy Time     | 10s      | 50s     | 5x faster   |
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Type definitions for index.json structure
interface TextNode {
  kind: 'text';
  value: { expr: string; value?: string; name?: string };
}

interface ElementNode {
  kind: 'element';
  tag: string;
  props?: Record<string, unknown>;
  children?: ViewNode[];
}

type ViewNode = TextNode | ElementNode;

interface IndexJson {
  version: string;
  route: {
    path: string;
    layout: string;
    meta: { title: string; description: string };
  };
  state?: Record<string, unknown>;
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
  return null;
}

// Helper function to find section containing specific heading
function findSectionWithHeading(node: ViewNode, headingPattern: RegExp): ElementNode | null {
  if (node.kind === 'element' && node.tag === 'section') {
    // Check if this section contains an h2 with the pattern
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

// Helper function to extract all text content from a section
function getAllTextInSection(section: ElementNode): string[] {
  const texts: string[] = [];
  
  function traverse(node: ViewNode) {
    if (node.kind === 'text' && node.value.value) {
      texts.push(node.value.value);
    }
    if (node.kind === 'element' && node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(section);
  return texts;
}

describe('index.json Performance Comparison Section', () => {
  // ==================== Setup ====================
  
  let indexJson: IndexJson;
  let performanceSection: ElementNode | null;
  
  beforeAll(() => {
    const indexPath = join(__dirname, '../../routes/index.json');
    const content = readFileSync(indexPath, 'utf-8');
    indexJson = JSON.parse(content) as IndexJson;
    
    // Find the Performance Comparison section
    performanceSection = findSectionWithHeading(
      indexJson.view,
      /Performance\s*(Comparison|vs|Benchmark)/i
    );
  });
  
  // ==================== Section Existence ====================
  
  describe('Section existence', () => {
    it('should have a Performance Comparison section with h2 heading', () => {
      /**
       * Given: The index.json file for the TOP page
       * When: Searching for a section with "Performance Comparison" heading
       * Then: The section should exist
       */
      expect(performanceSection).not.toBeNull();
      
      if (performanceSection) {
        const h2 = findElementWithText(performanceSection, 'h2', /Performance/i);
        expect(h2).not.toBeNull();
      }
    });
  });
  
  // ==================== Comparison Metrics ====================
  
  describe('Comparison metrics', () => {
    it('should include Build Time metric', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Looking for Build Time metric
       * Then: Build Time should be present with Constela (2.2s) and Next.js (12.3s) values
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      // Check for Build Time label
      expect(combinedText).toMatch(/Build\s*Time/i);
      
      // Check for values
      expect(combinedText).toMatch(/2\.2\s*s/i);
      expect(combinedText).toMatch(/12\.3\s*s/i);
    });
    
    it('should include node_modules Size metric', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Looking for node_modules Size metric
       * Then: node_modules Size should be present with Constela (297MB) and Next.js (794MB) values
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      // Check for node_modules label
      expect(combinedText).toMatch(/node_modules/i);
      
      // Check for values
      expect(combinedText).toMatch(/297\s*MB/i);
      expect(combinedText).toMatch(/794\s*MB/i);
    });
    
    it('should include Output Size metric', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Looking for Output Size metric
       * Then: Output Size should be present with Constela (14MB) and Next.js (72MB) values
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      // Check for Output Size label
      expect(combinedText).toMatch(/Output\s*Size/i);
      
      // Check for values
      expect(combinedText).toMatch(/14\s*MB/i);
      expect(combinedText).toMatch(/72\s*MB/i);
    });
    
    it('should include Deploy Time metric', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Looking for Deploy Time metric
       * Then: Deploy Time should be present with Constela (10s) and Next.js (50s) values
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      // Check for Deploy Time label
      expect(combinedText).toMatch(/Deploy\s*Time/i);
      
      // Check for values
      expect(combinedText).toMatch(/10\s*s/i);
      expect(combinedText).toMatch(/50\s*s/i);
    });
  });
  
  // ==================== Value Validation ====================
  
  describe('Constela and Next.js values', () => {
    const expectedMetrics = [
      { name: 'Build Time', constela: '2.2', nextjs: '12.3', unit: 's' },
      { name: 'node_modules', constela: '297', nextjs: '794', unit: 'MB' },
      { name: 'Output Size', constela: '14', nextjs: '72', unit: 'MB' },
      { name: 'Deploy Time', constela: '10', nextjs: '50', unit: 's' },
    ];
    
    it.each(expectedMetrics)(
      'should have correct values for $name metric',
      ({ name, constela, nextjs, unit }) => {
        /**
         * Given: The Performance Comparison section exists
         * When: Checking metric values
         * Then: Constela and Next.js values should match expected data
         */
        expect(performanceSection).not.toBeNull();
        
        const allText = getAllTextInSection(performanceSection!);
        const combinedText = allText.join(' ');
        
        // Verify Constela value
        const constelaPattern = new RegExp(`${constela}\\s*${unit}`, 'i');
        expect(combinedText).toMatch(constelaPattern);
        
        // Verify Next.js value
        const nextjsPattern = new RegExp(`${nextjs}\\s*${unit}`, 'i');
        expect(combinedText).toMatch(nextjsPattern);
      }
    );
    
    it('should have all four comparison metrics', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Counting the number of metrics
       * Then: There should be exactly 4 comparison metrics
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      const metricsFound = [
        /Build\s*Time/i,
        /node_modules/i,
        /Output\s*Size/i,
        /Deploy\s*Time/i,
      ].filter(pattern => pattern.test(combinedText));
      
      expect(metricsFound).toHaveLength(4);
    });
  });
  
  // ==================== Framework Labels ====================
  
  describe('Framework labels', () => {
    it('should mention Constela framework', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Looking for Constela label
       * Then: Constela should be mentioned
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      expect(combinedText).toMatch(/Constela/i);
    });
    
    it('should mention Next.js framework', () => {
      /**
       * Given: The Performance Comparison section exists
       * When: Looking for Next.js label
       * Then: Next.js should be mentioned
       */
      expect(performanceSection).not.toBeNull();
      
      const allText = getAllTextInSection(performanceSection!);
      const combinedText = allText.join(' ');
      
      expect(combinedText).toMatch(/Next\.?js/i);
    });
  });
});
