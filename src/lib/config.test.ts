/**
 * Test module for siteConfig - SEO configuration.
 *
 * Coverage:
 * - Required properties existence
 * - URL validation
 * - Keywords array validation
 * - Links validation
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - siteConfig is missing: author, keywords properties
 */

import { describe, it, expect } from 'vitest';
import { siteConfig } from './config';

describe('siteConfig', () => {
  // ==================== Required Properties ====================

  describe('required properties', () => {
    it('should have a name property as string', () => {
      /**
       * Given: siteConfig object
       * When: Accessing name property
       * Then: Should be a non-empty string
       */
      expect(siteConfig).toHaveProperty('name');
      expect(typeof siteConfig.name).toBe('string');
      expect(siteConfig.name.length).toBeGreaterThan(0);
    });

    it('should have a description property as string', () => {
      /**
       * Given: siteConfig object
       * When: Accessing description property
       * Then: Should be a non-empty string
       */
      expect(siteConfig).toHaveProperty('description');
      expect(typeof siteConfig.description).toBe('string');
      expect(siteConfig.description.length).toBeGreaterThan(0);
    });

    it('should have a url property as valid URL', () => {
      /**
       * Given: siteConfig object
       * When: Accessing url property
       * Then: Should be a valid URL string
       */
      expect(siteConfig).toHaveProperty('url');
      expect(typeof siteConfig.url).toBe('string');
      // Validate URL format
      expect(() => new URL(siteConfig.url)).not.toThrow();
      expect(siteConfig.url).toBe('https://constela.dev');
    });

    it('should have an author property as string', () => {
      /**
       * Given: siteConfig object
       * When: Accessing author property
       * Then: Should be a non-empty string
       *
       * RED PHASE: This test will FAIL - author property does not exist
       */
      expect(siteConfig).toHaveProperty('author');
      expect(typeof (siteConfig as { author?: string }).author).toBe('string');
      expect((siteConfig as { author?: string }).author!.length).toBeGreaterThan(0);
    });

    it('should have keywords property as non-empty string array', () => {
      /**
       * Given: siteConfig object
       * When: Accessing keywords property
       * Then: Should be a non-empty array of strings
       *
       * RED PHASE: This test will FAIL - keywords property does not exist
       */
      expect(siteConfig).toHaveProperty('keywords');
      const keywords = (siteConfig as { keywords?: string[] }).keywords;
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords!.length).toBeGreaterThan(0);
      keywords!.forEach((keyword) => {
        expect(typeof keyword).toBe('string');
        expect(keyword.length).toBeGreaterThan(0);
      });
    });
  });

  // ==================== Links Validation ====================

  describe('links property', () => {
    it('should have links.github as valid URL', () => {
      /**
       * Given: siteConfig object
       * When: Accessing links.github property
       * Then: Should be a valid GitHub URL
       */
      expect(siteConfig).toHaveProperty('links');
      expect(siteConfig.links).toHaveProperty('github');
      expect(typeof siteConfig.links.github).toBe('string');
      expect(() => new URL(siteConfig.links.github)).not.toThrow();
      expect(siteConfig.links.github).toContain('github.com');
    });

    it('should have links.docs as valid URL', () => {
      /**
       * Given: siteConfig object
       * When: Accessing links.docs property
       * Then: Should be a valid URL
       */
      expect(siteConfig).toHaveProperty('links');
      expect(siteConfig.links).toHaveProperty('docs');
      expect(typeof siteConfig.links.docs).toBe('string');
      expect(() => new URL(siteConfig.links.docs)).not.toThrow();
    });
  });
});
