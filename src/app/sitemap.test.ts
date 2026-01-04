/**
 * Test module for sitemap.ts - SEO sitemap configuration.
 *
 * Coverage:
 * - sitemap() function return structure
 * - Static pages inclusion (/, /playground, /examples, /examples/*)
 * - URL validation with siteConfig.url
 * - Required properties (url, lastModified, changeFrequency, priority)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/app/sitemap.ts does not exist yet
 */

import { describe, it, expect } from 'vitest';
import type { MetadataRoute } from 'next';

describe('sitemap.ts', () => {
  // ==================== Module Import ====================

  it('should export a default sitemap function', async () => {
    /**
     * Given: sitemap.ts module
     * When: Importing the module
     * Then: Should have a default export function
     *
     * RED PHASE: This test will FAIL - sitemap.ts does not exist
     */
    const sitemapModule = await import('./sitemap');
    expect(sitemapModule).toHaveProperty('default');
    expect(typeof sitemapModule.default).toBe('function');
  });

  // ==================== Static Pages ====================

  describe('sitemap() function - static pages', () => {
    it('should include home page "/"', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Should include entry for home page
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const { siteConfig } = await import('@/lib/config');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      const homeEntry = result.find((entry) => entry.url === siteConfig.url);
      expect(homeEntry).toBeDefined();
    });

    it('should include playground page "/playground"', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Should include entry for playground page
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const { siteConfig } = await import('@/lib/config');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      const playgroundEntry = result.find(
        (entry) => entry.url === `${siteConfig.url}/playground`
      );
      expect(playgroundEntry).toBeDefined();
    });

    it('should include examples page "/examples"', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Should include entry for examples index page
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const { siteConfig } = await import('@/lib/config');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      const examplesEntry = result.find(
        (entry) => entry.url === `${siteConfig.url}/examples`
      );
      expect(examplesEntry).toBeDefined();
    });

    it('should include example subpages "/examples/*"', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Should include entries for individual example pages
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const { siteConfig } = await import('@/lib/config');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      // Should have at least one example subpage
      const exampleSubpages = result.filter((entry) =>
        entry.url.startsWith(`${siteConfig.url}/examples/`)
      );
      expect(exampleSubpages.length).toBeGreaterThan(0);
    });
  });

  // ==================== URL Validation ====================

  describe('sitemap() function - URL validation', () => {
    it('should have all URLs starting with siteConfig.url', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: All URLs should start with the configured site URL
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const { siteConfig } = await import('@/lib/config');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      result.forEach((entry) => {
        expect(entry.url).toMatch(new RegExp(`^${siteConfig.url}`));
      });
    });

    it('should have all URLs as valid URLs', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: All URLs should be valid URL format
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      result.forEach((entry) => {
        expect(() => new URL(entry.url)).not.toThrow();
      });
    });
  });

  // ==================== Required Properties ====================

  describe('sitemap() function - entry properties', () => {
    it('should have url property for each entry', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Each entry should have url property
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      result.forEach((entry) => {
        expect(entry).toHaveProperty('url');
        expect(typeof entry.url).toBe('string');
      });
    });

    it('should have lastModified property for each entry', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Each entry should have lastModified property
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      result.forEach((entry) => {
        expect(entry).toHaveProperty('lastModified');
        // Should be Date or string
        expect(
          entry.lastModified instanceof Date ||
            typeof entry.lastModified === 'string'
        ).toBe(true);
      });
    });

    it('should have changeFrequency property for each entry', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Each entry should have changeFrequency property
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      const validFrequencies = [
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
      ];

      result.forEach((entry) => {
        expect(entry).toHaveProperty('changeFrequency');
        expect(validFrequencies).toContain(entry.changeFrequency);
      });
    });

    it('should have priority property for each entry', async () => {
      /**
       * Given: sitemap() function
       * When: Calling the function
       * Then: Each entry should have priority property (0.0 to 1.0)
       *
       * RED PHASE: This test will FAIL - sitemap.ts does not exist
       */
      const { default: sitemap } = await import('./sitemap');
      const result = (await sitemap()) as MetadataRoute.Sitemap;

      result.forEach((entry) => {
        expect(entry).toHaveProperty('priority');
        expect(typeof entry.priority).toBe('number');
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      });
    });
  });
});
