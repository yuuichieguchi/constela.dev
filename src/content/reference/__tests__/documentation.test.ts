/**
 * Test suite for Constela documentation updates.
 *
 * Coverage:
 * - package.json version verification
 * - navigation.json structure
 * - connections.mdx existence and content
 * - actions.mdx WebSocket-related sections
 * - nodes.mdx key property documentation
 * - index.mdx connections property
 *
 * TDD Red Phase: All tests should FAIL initially as the documentation
 * updates have not been implemented yet.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// __dirname = src/content/reference/__tests__
// PROJECT_ROOT = constela.dev (4 levels up)
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');
const REFERENCE_DIR = path.resolve(PROJECT_ROOT, 'src/content/reference');
const DATA_DIR = path.resolve(PROJECT_ROOT, 'src/data');

// ==================== Helper Functions ====================

async function readFileContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFileContent(filePath);
  return JSON.parse(content) as T;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ==================== Type Definitions ====================

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface NavigationItem {
  title: string;
  href: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface NavigationJson {
  topNav: NavigationItem[];
  docsNavigation: NavigationSection[];
  referenceNavigation: NavigationSection[];
}

// ==================== Test Suites ====================

describe('Constela Documentation Updates', () => {
  // ==================== 1. package.json versions ====================

  describe('package.json versions', () => {
    let packageJson: PackageJson;

    beforeAll(async () => {
      packageJson = await readJsonFile<PackageJson>(
        path.resolve(PROJECT_ROOT, 'package.json')
      );
    });

    it('should have @constela/compiler ^0.9.0', () => {
      expect(packageJson.dependencies['@constela/compiler']).toBe('^0.9.0');
    });

    it('should have @constela/core ^0.9.0', () => {
      expect(packageJson.dependencies['@constela/core']).toBe('^0.9.0');
    });

    it('should have @constela/router ^10.0.0', () => {
      expect(packageJson.dependencies['@constela/router']).toBe('^10.0.0');
    });

    it('should have @constela/runtime ^0.12.0', () => {
      expect(packageJson.dependencies['@constela/runtime']).toBe('^0.12.0');
    });

    it('should have @constela/server ^5.0.0', () => {
      expect(packageJson.dependencies['@constela/server']).toBe('^5.0.0');
    });

    it('should have @constela/start ^1.3.1', () => {
      expect(packageJson.dependencies['@constela/start']).toBe('^1.3.1');
    });
  });

  // ==================== 2. navigation.json ====================

  describe('navigation.json', () => {
    let navigationJson: NavigationJson;

    beforeAll(async () => {
      navigationJson = await readJsonFile<NavigationJson>(
        path.resolve(DATA_DIR, 'navigation.json')
      );
    });

    it('should contain a "Connections" link in referenceNavigation', () => {
      const referenceSection = navigationJson.referenceNavigation.find(
        (section) => section.title === 'Reference'
      );
      expect(referenceSection).toBeDefined();

      const connectionsItem = referenceSection?.items.find(
        (item) => item.title === 'Connections'
      );
      expect(connectionsItem).toBeDefined();
      expect(connectionsItem?.href).toBe('/reference/connections');
    });

    it('should have "Connections" positioned after "Actions" and before "Style System"', () => {
      const referenceSection = navigationJson.referenceNavigation.find(
        (section) => section.title === 'Reference'
      );
      expect(referenceSection).toBeDefined();

      const items = referenceSection?.items ?? [];
      const actionsIndex = items.findIndex((item) => item.title === 'Actions');
      const connectionsIndex = items.findIndex(
        (item) => item.title === 'Connections'
      );
      const styleSystemIndex = items.findIndex(
        (item) => item.title === 'Style System'
      );

      expect(actionsIndex).toBeGreaterThanOrEqual(0);
      expect(connectionsIndex).toBeGreaterThanOrEqual(0);
      expect(styleSystemIndex).toBeGreaterThanOrEqual(0);
      expect(connectionsIndex).toBeGreaterThan(actionsIndex);
      expect(connectionsIndex).toBeLessThan(styleSystemIndex);
    });
  });

  // ==================== 3. connections.mdx ====================

  describe('connections.mdx', () => {
    const connectionsPath = path.resolve(REFERENCE_DIR, 'connections.mdx');
    let connectionsMdx: string;

    beforeAll(async () => {
      if (await fileExists(connectionsPath)) {
        connectionsMdx = await readFileContent(connectionsPath);
      } else {
        connectionsMdx = '';
      }
    });

    it('should exist at src/content/reference/connections.mdx', async () => {
      const exists = await fileExists(connectionsPath);
      expect(exists).toBe(true);
    });

    it('should contain title "Connections"', () => {
      expect(connectionsMdx).toMatch(/title:\s*["']?Connections["']?/);
    });

    it('should contain WebSocket section', () => {
      expect(connectionsMdx).toMatch(/##\s*WebSocket/);
    });

    it('should contain onMessage section', () => {
      expect(connectionsMdx).toMatch(/##\s*onMessage|### onMessage/);
    });

    it('should contain onOpen section', () => {
      expect(connectionsMdx).toMatch(/##\s*onOpen|### onOpen/);
    });

    it('should contain onClose section', () => {
      expect(connectionsMdx).toMatch(/##\s*onClose|### onClose/);
    });

    it('should contain onError section', () => {
      expect(connectionsMdx).toMatch(/##\s*onError|### onError/);
    });

    it('should contain send section', () => {
      expect(connectionsMdx).toMatch(/##\s*send|### send/);
    });

    it('should contain close section', () => {
      expect(connectionsMdx).toMatch(/##\s*close|### close/);
    });

    it('should contain TypedStateStore section', () => {
      expect(connectionsMdx).toMatch(/TypedStateStore/);
    });
  });

  // ==================== 4. actions.mdx ====================

  describe('actions.mdx', () => {
    const actionsPath = path.resolve(REFERENCE_DIR, 'actions.mdx');
    let actionsMdx: string;

    beforeAll(async () => {
      actionsMdx = await readFileContent(actionsPath);
    });

    it('should contain "setPath" section for nested state updates', () => {
      expect(actionsMdx).toMatch(/##\s*setPath|## SetPath Step|### setPath/i);
    });

    it('should contain "send" step for WebSocket message sending', () => {
      expect(actionsMdx).toMatch(/##\s*Send Step|### send|"do":\s*"send"/);
    });

    it('should contain "close" step for WebSocket disconnection', () => {
      expect(actionsMdx).toMatch(/##\s*Close Step|### close|"do":\s*"close"/);
    });
  });

  // ==================== 5. nodes.mdx ====================

  describe('nodes.mdx', () => {
    const nodesPath = path.resolve(REFERENCE_DIR, 'nodes.mdx');
    let nodesMdx: string;

    beforeAll(async () => {
      nodesMdx = await readFileContent(nodesPath);
    });

    it('should contain detailed key property documentation for each node', () => {
      // The documentation should contain a dedicated section explaining key property
      // importance for efficient list rendering (not just the PropsTable entry)
      // Look for headings or dedicated paragraphs about key property
      expect(nodesMdx).toMatch(
        /###?\s*Key Property|###?\s*The key Property|Why Keys Matter|Key Best Practices/i
      );
    });

    it('should contain key-based diff update explanation', () => {
      // Should explain how the key is used for diffing and updates
      // More specific patterns that indicate actual explanation content
      expect(nodesMdx).toMatch(
        /reconcil.*algorithm|DOM.*reorder|stable.*identity|key.*identify.*element|minimize.*DOM/i
      );
    });
  });

  // ==================== 6. index.mdx ====================

  describe('index.mdx', () => {
    const indexPath = path.resolve(REFERENCE_DIR, 'index.mdx');
    let indexMdx: string;

    beforeAll(async () => {
      indexMdx = await readFileContent(indexPath);
    });

    it('should contain "connections" property in Root Properties', () => {
      // The connections property should be documented in the PropsTable
      // for root-level properties
      expect(indexMdx).toMatch(/name:\s*["']connections["']/);
    });
  });
});
