/**
 * Test module for robots.ts - SEO robots configuration.
 *
 * Coverage:
 * - robots() function return structure
 * - UserAgent and allow rules
 * - Sitemap URL validation
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/app/robots.ts does not exist yet
 */

import { describe, it, expect } from 'vitest';
import type { MetadataRoute } from 'next';

describe('robots.ts', () => {
  // ==================== Module Import ====================

  it('should export a default robots function', async () => {
    /**
     * Given: robots.ts module
     * When: Importing the module
     * Then: Should have a default export function
     *
     * RED PHASE: This test will FAIL - robots.ts does not exist
     */
    const robotsModule = await import('./robots');
    expect(robotsModule).toHaveProperty('default');
    expect(typeof robotsModule.default).toBe('function');
  });

  // ==================== Return Structure ====================

  describe('robots() function', () => {
    it('should return rules with userAgent "*" and allow "/"', async () => {
      /**
       * Given: robots() function
       * When: Calling the function
       * Then: Should return rules allowing all crawlers to access all paths
       *
       * RED PHASE: This test will FAIL - robots.ts does not exist
       */
      const { default: robots } = await import('./robots');
      const result = robots() as MetadataRoute.Robots;

      expect(result).toHaveProperty('rules');
      expect(result.rules).toEqual(
        expect.objectContaining({
          userAgent: '*',
          allow: '/',
        })
      );
    });

    it('should return sitemap URL pointing to siteConfig.url/sitemap.xml', async () => {
      /**
       * Given: robots() function
       * When: Calling the function
       * Then: Should return sitemap URL based on siteConfig.url
       *
       * RED PHASE: This test will FAIL - robots.ts does not exist
       */
      const { default: robots } = await import('./robots');
      const { siteConfig } = await import('@/lib/config');
      const result = robots() as MetadataRoute.Robots;

      expect(result).toHaveProperty('sitemap');
      expect(result.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    });

    it('should return sitemap URL with https protocol', async () => {
      /**
       * Given: robots() function
       * When: Calling the function
       * Then: Sitemap URL should use https protocol
       *
       * RED PHASE: This test will FAIL - robots.ts does not exist
       */
      const { default: robots } = await import('./robots');
      const result = robots() as MetadataRoute.Robots;

      expect(result.sitemap).toMatch(/^https:\/\//);
    });
  });
});
