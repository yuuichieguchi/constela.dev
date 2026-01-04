/**
 * Test module for CompareGrid MDX component.
 *
 * Coverage:
 * - Component export and basic rendering
 * - Grid container with responsive classes
 * - CompareGrid.Column compound component
 * - Title rendering in columns
 * - Children content rendering
 * - Proper styling classes (border, background, padding)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - src/components/mdx/CompareGrid.tsx does not exist yet
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('CompareGrid component', () => {
  // ==================== Module Export ====================

  describe('module exports', () => {
    it('should export CompareGrid component', async () => {
      /**
       * Given: CompareGrid.tsx module
       * When: Importing the module
       * Then: Should export CompareGrid component
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const compareGridModule = await import('../CompareGrid');
      expect(compareGridModule).toHaveProperty('CompareGrid');
      expect(typeof compareGridModule.CompareGrid).toBe('function');
    });

    it('should have CompareGrid.Column as a compound component', async () => {
      /**
       * Given: CompareGrid component
       * When: Accessing the Column property
       * Then: Should have Column as a function component
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      expect(CompareGrid).toHaveProperty('Column');
      expect(typeof CompareGrid.Column).toBe('function');
    });
  });

  // ==================== Grid Container Rendering ====================

  describe('grid container rendering', () => {
    it('should render a grid container element', async () => {
      /**
       * Given: CompareGrid component with columns
       * When: Rendering the component
       * Then: Should render a container with grid display
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Column 1">Content 1</CompareGrid.Column>
          <CompareGrid.Column title="Column 2">Content 2</CompareGrid.Column>
        </CompareGrid>
      );

      const gridContainer = container.firstChild as HTMLElement;
      expect(gridContainer).not.toBeNull();
      expect(gridContainer.className).toContain('grid');
    });

    it('should have responsive grid columns classes', async () => {
      /**
       * Given: CompareGrid component
       * When: Rendering the component
       * Then: Should have grid-cols-1 and md:grid-cols-2 classes
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Column 1">Content 1</CompareGrid.Column>
          <CompareGrid.Column title="Column 2">Content 2</CompareGrid.Column>
        </CompareGrid>
      );

      const gridContainer = container.firstChild as HTMLElement;
      expect(gridContainer.className).toContain('grid-cols-1');
      expect(gridContainer.className).toContain('md:grid-cols-2');
    });

    it('should have gap class for spacing between columns', async () => {
      /**
       * Given: CompareGrid component
       * When: Rendering the component
       * Then: Should have gap class for proper spacing
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Column 1">Content 1</CompareGrid.Column>
          <CompareGrid.Column title="Column 2">Content 2</CompareGrid.Column>
        </CompareGrid>
      );

      const gridContainer = container.firstChild as HTMLElement;
      expect(gridContainer.className).toMatch(/gap-\d+/);
    });
  });

  // ==================== Column Component ====================

  describe('CompareGrid.Column component', () => {
    it('should render column title', async () => {
      /**
       * Given: CompareGrid.Column with title prop
       * When: Rendering the component
       * Then: Should display the title text
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      render(
        <CompareGrid>
          <CompareGrid.Column title="Test Title">Content</CompareGrid.Column>
        </CompareGrid>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render children content', async () => {
      /**
       * Given: CompareGrid.Column with children
       * When: Rendering the component
       * Then: Should display the children content
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      render(
        <CompareGrid>
          <CompareGrid.Column title="Title">
            <p>Test content paragraph</p>
          </CompareGrid.Column>
        </CompareGrid>
      );

      expect(screen.getByText('Test content paragraph')).toBeInTheDocument();
    });

    it('should render multiple columns', async () => {
      /**
       * Given: CompareGrid with multiple columns
       * When: Rendering the component
       * Then: Should display all columns with their content
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      render(
        <CompareGrid>
          <CompareGrid.Column title="First Column">First content</CompareGrid.Column>
          <CompareGrid.Column title="Second Column">Second content</CompareGrid.Column>
        </CompareGrid>
      );

      expect(screen.getByText('First Column')).toBeInTheDocument();
      expect(screen.getByText('Second Column')).toBeInTheDocument();
      expect(screen.getByText('First content')).toBeInTheDocument();
      expect(screen.getByText('Second content')).toBeInTheDocument();
    });
  });

  // ==================== Styling Classes ====================

  describe('styling classes', () => {
    it('should have border class on column', async () => {
      /**
       * Given: CompareGrid.Column
       * When: Rendering the component
       * Then: Should have border styling class
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Title">Content</CompareGrid.Column>
        </CompareGrid>
      );

      const column = container.querySelector('[class*="border"]');
      expect(column).not.toBeNull();
    });

    it('should have background class on column', async () => {
      /**
       * Given: CompareGrid.Column
       * When: Rendering the component
       * Then: Should have background styling class
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Title">Content</CompareGrid.Column>
        </CompareGrid>
      );

      const column = container.querySelector('[class*="bg-"]');
      expect(column).not.toBeNull();
    });

    it('should have padding class on column', async () => {
      /**
       * Given: CompareGrid.Column
       * When: Rendering the component
       * Then: Should have padding styling class
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Title">Content</CompareGrid.Column>
        </CompareGrid>
      );

      const column = container.querySelector('[class*="p-"]');
      expect(column).not.toBeNull();
    });

    it('should have rounded corners class on column', async () => {
      /**
       * Given: CompareGrid.Column
       * When: Rendering the component
       * Then: Should have rounded corners styling class
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Title">Content</CompareGrid.Column>
        </CompareGrid>
      );

      const column = container.querySelector('[class*="rounded"]');
      expect(column).not.toBeNull();
    });

    it('should have font styling on title', async () => {
      /**
       * Given: CompareGrid.Column with title
       * When: Rendering the component
       * Then: Title should have font-weight styling (semibold or bold)
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      render(
        <CompareGrid>
          <CompareGrid.Column title="Styled Title">Content</CompareGrid.Column>
        </CompareGrid>
      );

      const title = screen.getByText('Styled Title');
      expect(
        title.className.includes('font-semibold') ||
        title.className.includes('font-bold')
      ).toBe(true);
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle empty children', async () => {
      /**
       * Given: CompareGrid.Column with no children
       * When: Rendering the component
       * Then: Should render without error
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      expect(() =>
        render(
          <CompareGrid>
            <CompareGrid.Column title="Empty Column">{null}</CompareGrid.Column>
          </CompareGrid>
        )
      ).not.toThrow();
    });

    it('should handle single column', async () => {
      /**
       * Given: CompareGrid with only one column
       * When: Rendering the component
       * Then: Should render correctly with single column
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      const { container } = render(
        <CompareGrid>
          <CompareGrid.Column title="Only Column">Single content</CompareGrid.Column>
        </CompareGrid>
      );

      expect(screen.getByText('Only Column')).toBeInTheDocument();
      expect(screen.getByText('Single content')).toBeInTheDocument();
      expect(container.firstChild).not.toBeNull();
    });

    it('should handle complex children content', async () => {
      /**
       * Given: CompareGrid.Column with complex nested content
       * When: Rendering the component
       * Then: Should render all nested elements correctly
       *
       * RED PHASE: This test will FAIL - CompareGrid.tsx does not exist
       */
      const { CompareGrid } = await import('../CompareGrid');
      render(
        <CompareGrid>
          <CompareGrid.Column title="Complex Column">
            <div data-testid="nested-div">
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CompareGrid.Column>
        </CompareGrid>
      );

      expect(screen.getByTestId('nested-div')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});
