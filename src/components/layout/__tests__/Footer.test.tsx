/**
 * Test module for Footer component layout.
 *
 * Coverage:
 * - "Built with Constela" positioned at the ABSOLUTE CENTER of the footer row
 *   using CSS Grid with 3 columns
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer component', () => {
  describe('layout structure', () => {
    it('should use CSS Grid with 3 columns for absolute center positioning', () => {
      /**
       * Expected layout using CSS Grid:
       * [© 2026 Constela...]  [Built with Constela]  [GitHub] [Documentation]
       *   ↑ col 1 (left)         ↑ col 2 (center)         ↑ col 3 (right)
       *
       * The grid ensures "Built with Constela" is at the absolute center
       * regardless of the width of left/right elements.
       */
      render(<Footer />);

      const copyrightText = screen.getByText(/© \d{4} Constela/);
      const mainRow = copyrightText.parentElement;

      // Should use CSS Grid
      expect(mainRow?.classList.contains('grid')).toBe(true);
      expect(mainRow?.classList.contains('sm:grid-cols-3')).toBe(true);
    });

    it('should have "Built with Constela" in the center column with center alignment', () => {
      render(<Footer />);

      const builtWithText = screen.getByText('Built with Constela');

      // Should have justify-self-center for absolute centering
      expect(builtWithText.classList.contains('sm:justify-self-center')).toBe(true);
    });

    it('should have links container aligned to the right', () => {
      render(<Footer />);

      const githubLink = screen.getByRole('link', { name: 'GitHub' });
      const linksContainer = githubLink.parentElement;

      // Should have justify-self-end for right alignment
      expect(linksContainer?.classList.contains('sm:justify-self-end')).toBe(true);
    });
  });
});
