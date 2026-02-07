/**
 * Test suite for sync-cdn-versions script
 *
 * Coverage:
 * - Build CDN URL from package name and version
 * - Sync CDN versions to match package.json
 * - Handle version prefix stripping (^, ~)
 * - Skip non-@constela packages
 * - Immutability of input data
 *
 * This script syncs playground.json CDN URLs to match package.json versions
 * for @constela packages.
 */

import { describe, it, expect } from 'vitest';

import { buildCdnUrl, syncCdnVersions } from '../sync-cdn-versions.js';

// ==================== Test Fixtures ====================

const CDN_BASE = 'https://cdn.jsdelivr.net/npm';

function cdnUrl(pkg: string, version: string): string {
  return `${CDN_BASE}/${pkg}@${version}/+esm`;
}

describe('sync-cdn-versions', () => {
  // ==================== buildCdnUrl ====================

  describe('buildCdnUrl', () => {
    it('should build CDN URL for scoped package', () => {
      // Arrange
      const packageName = '@constela/core';
      const version = '0.19.0';
      const expected = 'https://cdn.jsdelivr.net/npm/@constela/core@0.19.0/+esm';

      // Act
      const result = buildCdnUrl(packageName, version);

      // Assert
      expect(result).toBe(expected);
    });

    it('should build CDN URL for non-scoped package', () => {
      // Arrange
      const packageName = 'monaco-editor';
      const version = '0.52.0';
      const expected = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/+esm';

      // Act
      const result = buildCdnUrl(packageName, version);

      // Assert
      expect(result).toBe(expected);
    });
  });

  // ==================== syncCdnVersions ====================

  describe('syncCdnVersions', () => {
    it('should return empty updated list when all @constela CDN versions already match', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
          '@constela/compiler': '^0.15.14',
          '@constela/runtime': '^3.0.1',
        },
      };

      const externalImports: Record<string, string> = {
        '@constela/core': cdnUrl('@constela/core', '0.19.0'),
        '@constela/compiler': cdnUrl('@constela/compiler', '0.15.14'),
        '@constela/runtime': cdnUrl('@constela/runtime', '3.0.1'),
      };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      expect(result.updated).toEqual([]);
      expect(result.externalImports).toEqual(externalImports);
    });

    it('should update CDN URL when single @constela version mismatches', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
          '@constela/compiler': '^0.15.14',
        },
      };

      const externalImports: Record<string, string> = {
        '@constela/core': cdnUrl('@constela/core', '0.14.0'), // Outdated
        '@constela/compiler': cdnUrl('@constela/compiler', '0.15.14'),
      };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      expect(result.updated).toEqual(['@constela/core']);
      expect(result.externalImports['@constela/core']).toBe(
        cdnUrl('@constela/core', '0.19.0'),
      );
      // Unchanged entry should remain the same
      expect(result.externalImports['@constela/compiler']).toBe(
        cdnUrl('@constela/compiler', '0.15.14'),
      );
    });

    it('should update all CDN URLs when multiple @constela versions mismatch', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
          '@constela/compiler': '^0.15.14',
          '@constela/runtime': '^3.0.1',
        },
      };

      const externalImports: Record<string, string> = {
        '@constela/core': cdnUrl('@constela/core', '0.14.0'), // Outdated
        '@constela/compiler': cdnUrl('@constela/compiler', '0.10.0'), // Outdated
        '@constela/runtime': cdnUrl('@constela/runtime', '2.0.0'), // Outdated
      };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      expect(result.updated).toHaveLength(3);
      expect(result.updated).toContain('@constela/core');
      expect(result.updated).toContain('@constela/compiler');
      expect(result.updated).toContain('@constela/runtime');
      expect(result.externalImports['@constela/core']).toBe(
        cdnUrl('@constela/core', '0.19.0'),
      );
      expect(result.externalImports['@constela/compiler']).toBe(
        cdnUrl('@constela/compiler', '0.15.14'),
      );
      expect(result.externalImports['@constela/runtime']).toBe(
        cdnUrl('@constela/runtime', '3.0.1'),
      );
    });

    it('should skip non-@constela packages even if version differs', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
          'monaco-editor': '^0.52.0',
        },
      };

      const externalImports: Record<string, string> = {
        '@constela/core': cdnUrl('@constela/core', '0.19.0'),
        'monaco-editor': cdnUrl('monaco-editor', '0.50.0'), // Different version, but not @constela
      };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      expect(result.updated).toEqual([]);
      expect(result.skipped).toContain('monaco-editor');
      // monaco-editor URL should remain unchanged
      expect(result.externalImports['monaco-editor']).toBe(
        cdnUrl('monaco-editor', '0.50.0'),
      );
    });

    it('should skip package in externalImports that is not in package.json dependencies', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
        },
      };

      const externalImports: Record<string, string> = {
        '@constela/core': cdnUrl('@constela/core', '0.19.0'),
        '@constela/compiler': cdnUrl('@constela/compiler', '0.10.0'), // Not in package.json
      };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      expect(result.skipped).toContain('@constela/compiler');
      expect(result.updated).not.toContain('@constela/compiler');
      // URL should remain unchanged
      expect(result.externalImports['@constela/compiler']).toBe(
        cdnUrl('@constela/compiler', '0.10.0'),
      );
    });

    it('should strip ^ and ~ version prefixes from package.json versions', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
          '@constela/runtime': '~3.0.1',
          '@constela/ui': '0.4.11', // No prefix
        },
      };

      const externalImports: Record<string, string> = {
        '@constela/core': cdnUrl('@constela/core', '0.1.0'), // Outdated
        '@constela/runtime': cdnUrl('@constela/runtime', '1.0.0'), // Outdated
        '@constela/ui': cdnUrl('@constela/ui', '0.1.0'), // Outdated
      };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      expect(result.externalImports['@constela/core']).toBe(
        cdnUrl('@constela/core', '0.19.0'),
      );
      expect(result.externalImports['@constela/runtime']).toBe(
        cdnUrl('@constela/runtime', '3.0.1'),
      );
      expect(result.externalImports['@constela/ui']).toBe(
        cdnUrl('@constela/ui', '0.4.11'),
      );
    });

    it('should not mutate the original externalImports object', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.19.0',
        },
      };

      const originalUrl = cdnUrl('@constela/core', '0.14.0');
      const externalImports: Record<string, string> = {
        '@constela/core': originalUrl,
      };

      // Snapshot of original state
      const originalSnapshot = { ...externalImports };

      // Act
      const result = syncCdnVersions(packageJson, externalImports);

      // Assert
      // Original object should be unchanged
      expect(externalImports).toEqual(originalSnapshot);
      expect(externalImports['@constela/core']).toBe(originalUrl);
      // Result should have the updated URL
      expect(result.externalImports['@constela/core']).toBe(
        cdnUrl('@constela/core', '0.19.0'),
      );
    });
  });
});
