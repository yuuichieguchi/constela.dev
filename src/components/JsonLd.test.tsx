/**
 * Test module for JsonLd component - SEO structured data.
 *
 * Coverage:
 * - Script tag rendering with type="application/ld+json"
 * - Valid JSON structure
 * - Required JSON-LD properties (@context, @type)
 * - SoftwareApplication type properties
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/JsonLd.tsx does not exist yet
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('JsonLd component', () => {
  // ==================== Module Import ====================

  it('should export JsonLd component', async () => {
    /**
     * Given: JsonLd.tsx module
     * When: Importing the module
     * Then: Should export JsonLd component
     *
     * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
     */
    const jsonLdModule = await import('./JsonLd');
    expect(jsonLdModule).toHaveProperty('JsonLd');
    expect(typeof jsonLdModule.JsonLd).toBe('function');
  });

  // ==================== Script Tag Rendering ====================

  describe('script tag rendering', () => {
    it('should render a script tag with type="application/ld+json"', async () => {
      /**
       * Given: JsonLd component
       * When: Rendering the component
       * Then: Should render script tag with correct type attribute
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(scriptTag).not.toBeNull();
    });

    it('should contain valid JSON in the script tag', async () => {
      /**
       * Given: JsonLd component
       * When: Rendering the component
       * Then: Script tag content should be valid JSON
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(scriptTag).not.toBeNull();

      const content = scriptTag!.textContent;
      expect(content).not.toBeNull();
      expect(() => JSON.parse(content!)).not.toThrow();
    });
  });

  // ==================== JSON-LD Structure ====================

  describe('JSON-LD structure', () => {
    it('should have @context property set to schema.org', async () => {
      /**
       * Given: JsonLd component
       * When: Rendering and parsing JSON content
       * Then: Should have @context pointing to schema.org
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd).toHaveProperty('@context');
      expect(jsonLd['@context']).toBe('https://schema.org');
    });

    it('should have @type property', async () => {
      /**
       * Given: JsonLd component
       * When: Rendering and parsing JSON content
       * Then: Should have @type property
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd).toHaveProperty('@type');
      expect(typeof jsonLd['@type']).toBe('string');
    });
  });

  // ==================== SoftwareApplication Type ====================

  describe('SoftwareApplication type', () => {
    it('should have @type set to SoftwareApplication', async () => {
      /**
       * Given: JsonLd component
       * When: Rendering and parsing JSON content
       * Then: Should have @type set to SoftwareApplication
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd['@type']).toBe('SoftwareApplication');
    });

    it('should have name property', async () => {
      /**
       * Given: JsonLd component for SoftwareApplication
       * When: Rendering and parsing JSON content
       * Then: Should have name property
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd).toHaveProperty('name');
      expect(typeof jsonLd.name).toBe('string');
      expect(jsonLd.name.length).toBeGreaterThan(0);
    });

    it('should have description property', async () => {
      /**
       * Given: JsonLd component for SoftwareApplication
       * When: Rendering and parsing JSON content
       * Then: Should have description property
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd).toHaveProperty('description');
      expect(typeof jsonLd.description).toBe('string');
      expect(jsonLd.description.length).toBeGreaterThan(0);
    });

    it('should have url property', async () => {
      /**
       * Given: JsonLd component for SoftwareApplication
       * When: Rendering and parsing JSON content
       * Then: Should have url property as valid URL
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd).toHaveProperty('url');
      expect(typeof jsonLd.url).toBe('string');
      expect(() => new URL(jsonLd.url)).not.toThrow();
    });

    it('should have applicationCategory property', async () => {
      /**
       * Given: JsonLd component for SoftwareApplication
       * When: Rendering and parsing JSON content
       * Then: Should have applicationCategory property
       *
       * RED PHASE: This test will FAIL - JsonLd.tsx does not exist
       */
      const { JsonLd } = await import('./JsonLd');
      const { container } = render(<JsonLd />);

      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const jsonLd = JSON.parse(scriptTag!.textContent!);

      expect(jsonLd).toHaveProperty('applicationCategory');
      expect(typeof jsonLd.applicationCategory).toBe('string');
      expect(jsonLd.applicationCategory.length).toBeGreaterThan(0);
    });
  });
});
