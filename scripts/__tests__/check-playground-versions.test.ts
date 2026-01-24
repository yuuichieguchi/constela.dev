/**
 * Test suite for check-playground-versions script
 *
 * Coverage:
 * - Extract version from CDN URL
 * - Parse package.json version (strip ^ prefix)
 * - Check versions match
 * - Detect version mismatches
 *
 * This script validates that playground.json CDN versions match package.json versions
 * for @constela packages.
 */

import { describe, it, expect } from 'vitest';

// Import functions from the script (implementation does not exist yet - TDD Red phase)
import {
  extractVersionFromCdnUrl,
  parsePackageJsonVersion,
  checkPlaygroundVersions,
  type VersionCheckResult,
} from '../check-playground-versions.js';

describe('check-playground-versions', () => {
  // ==================== extractVersionFromCdnUrl ====================

  describe('extractVersionFromCdnUrl', () => {
    it('should extract version from CDN URL with +esm suffix', () => {
      // Arrange
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm';
      const expected = '0.14.0';

      // Act
      const result = extractVersionFromCdnUrl(cdnUrl);

      // Assert
      expect(result).toBe(expected);
    });

    it('should extract version from CDN URL without +esm suffix', () => {
      // Arrange
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/@constela/runtime@0.17.1';
      const expected = '0.17.1';

      // Act
      const result = extractVersionFromCdnUrl(cdnUrl);

      // Assert
      expect(result).toBe(expected);
    });

    it('should extract version from scoped package URL', () => {
      // Arrange
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/@constela/compiler@0.13.0/+esm';
      const expected = '0.13.0';

      // Act
      const result = extractVersionFromCdnUrl(cdnUrl);

      // Assert
      expect(result).toBe(expected);
    });

    it('should extract version from non-scoped package URL', () => {
      // Arrange
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/+esm';
      const expected = '0.52.0';

      // Act
      const result = extractVersionFromCdnUrl(cdnUrl);

      // Assert
      expect(result).toBe(expected);
    });

    it('should return null for invalid CDN URL', () => {
      // Arrange
      const cdnUrl = 'https://example.com/invalid-url';

      // Act
      const result = extractVersionFromCdnUrl(cdnUrl);

      // Assert
      expect(result).toBeNull();
    });
  });

  // ==================== parsePackageJsonVersion ====================

  describe('parsePackageJsonVersion', () => {
    it('should strip ^ prefix from version', () => {
      // Arrange
      const version = '^0.14.0';
      const expected = '0.14.0';

      // Act
      const result = parsePackageJsonVersion(version);

      // Assert
      expect(result).toBe(expected);
    });

    it('should strip ~ prefix from version', () => {
      // Arrange
      const version = '~0.13.0';
      const expected = '0.13.0';

      // Act
      const result = parsePackageJsonVersion(version);

      // Assert
      expect(result).toBe(expected);
    });

    it('should return version as-is when no prefix', () => {
      // Arrange
      const version = '0.17.1';
      const expected = '0.17.1';

      // Act
      const result = parsePackageJsonVersion(version);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle versions with >= prefix', () => {
      // Arrange
      const version = '>=1.0.0';
      const expected = '1.0.0';

      // Act
      const result = parsePackageJsonVersion(version);

      // Assert
      expect(result).toBe(expected);
    });
  });

  // ==================== checkPlaygroundVersions ====================

  describe('checkPlaygroundVersions', () => {
    it('should return success when all versions match', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.14.0',
          '@constela/compiler': '^0.13.0',
          '@constela/runtime': '^0.17.1',
        },
      };

      const playgroundJson = {
        externalImports: {
          '@constela/core': 'https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm',
          '@constela/compiler': 'https://cdn.jsdelivr.net/npm/@constela/compiler@0.13.0/+esm',
          '@constela/runtime': 'https://cdn.jsdelivr.net/npm/@constela/runtime@0.17.1/+esm',
        },
      };

      // Act
      const result = checkPlaygroundVersions(packageJson, playgroundJson);

      // Assert
      expect(result.success).toBe(true);
      expect(result.mismatches).toEqual([]);
    });

    it('should return failure when versions mismatch', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.15.0', // Updated version
          '@constela/compiler': '^0.13.0',
          '@constela/runtime': '^0.17.1',
        },
      };

      const playgroundJson = {
        externalImports: {
          '@constela/core': 'https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm', // Old version
          '@constela/compiler': 'https://cdn.jsdelivr.net/npm/@constela/compiler@0.13.0/+esm',
          '@constela/runtime': 'https://cdn.jsdelivr.net/npm/@constela/runtime@0.17.1/+esm',
        },
      };

      // Act
      const result = checkPlaygroundVersions(packageJson, playgroundJson);

      // Assert
      expect(result.success).toBe(false);
      expect(result.mismatches).toHaveLength(1);
      expect(result.mismatches[0]).toEqual({
        package: '@constela/core',
        packageJsonVersion: '0.15.0',
        playgroundVersion: '0.14.0',
      });
    });

    it('should detect multiple version mismatches', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.15.0',
          '@constela/compiler': '^0.14.0',
          '@constela/runtime': '^0.18.0',
        },
      };

      const playgroundJson = {
        externalImports: {
          '@constela/core': 'https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm',
          '@constela/compiler': 'https://cdn.jsdelivr.net/npm/@constela/compiler@0.13.0/+esm',
          '@constela/runtime': 'https://cdn.jsdelivr.net/npm/@constela/runtime@0.17.1/+esm',
        },
      };

      // Act
      const result = checkPlaygroundVersions(packageJson, playgroundJson);

      // Assert
      expect(result.success).toBe(false);
      expect(result.mismatches).toHaveLength(3);
    });

    it('should only check @constela packages', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.14.0',
          'monaco-editor': '^0.52.0', // Not a @constela package
        },
      };

      const playgroundJson = {
        externalImports: {
          '@constela/core': 'https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm',
          'monaco-editor': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm', // Different version
        },
      };

      // Act
      const result = checkPlaygroundVersions(packageJson, playgroundJson);

      // Assert
      // Should only check @constela packages, not monaco-editor
      expect(result.success).toBe(true);
      expect(result.mismatches).toEqual([]);
    });

    it('should handle package in package.json but not in playground.json', () => {
      // Arrange
      const packageJson = {
        dependencies: {
          '@constela/core': '^0.14.0',
          '@constela/router': '^16.0.0', // Not in playground.json
        },
      };

      const playgroundJson = {
        externalImports: {
          '@constela/core': 'https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm',
        },
      };

      // Act
      const result = checkPlaygroundVersions(packageJson, playgroundJson);

      // Assert
      // Only check packages that exist in both files
      expect(result.success).toBe(true);
    });
  });
});
