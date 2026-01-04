/**
 * Test module for Callout MDX component.
 *
 * Coverage:
 * - Prose isolation (not-prose class)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - not-prose class is not yet applied to the component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Callout } from '../Callout';

describe('Callout component', () => {
  // ==================== Prose Isolation ====================

  describe('prose isolation', () => {
    it('should have not-prose class on the outermost div to prevent Tailwind Typography inheritance', () => {
      /**
       * Given: Callout component inside prose context
       * When: Rendering the component
       * Then: Outermost div should have not-prose class to prevent
       *       Tailwind Typography styles from affecting internal elements
       *
       * RED PHASE: This test will FAIL - not-prose class is not yet applied
       */
      const { container } = render(
        <Callout type="note">
          Test content
        </Callout>
      );

      const outermostDiv = container.firstChild as HTMLElement;
      expect(outermostDiv.className).toContain('not-prose');
    });

    it('should have not-prose class for all callout types', () => {
      /**
       * Given: Callout component with different types
       * When: Rendering with each type (note, warning, tip, important)
       * Then: All types should have not-prose class on outermost div
       *
       * RED PHASE: This test will FAIL - not-prose class is not yet applied
       */
      const types = ['note', 'warning', 'tip', 'important'] as const;

      types.forEach((type) => {
        const { container } = render(
          <Callout type={type}>
            Content for {type}
          </Callout>
        );

        const outermostDiv = container.firstChild as HTMLElement;
        expect(outermostDiv.className).toContain('not-prose');
      });
    });
  });
});
