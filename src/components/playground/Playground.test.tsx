/**
 * Test module for Playground component - Validate button success feedback.
 *
 * Coverage:
 * - Success message appears after successful validation
 * - Success message does NOT appear when validation fails
 * - Success message disappears when code is changed
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - PlaygroundSuccess component does not exist yet
 * - validationSuccess state is not implemented yet
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ==================== Mocks ====================

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

// Mock Monaco Editor - returns a textarea for testing
let mockOnChange: ((value: string) => void) | undefined;
vi.mock('@monaco-editor/react', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) => {
    mockOnChange = onChange;
    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  },
}));

// Mock @constela/core
const mockValidateAst = vi.fn();
vi.mock('@constela/core', () => ({
  validateAst: (parsed: unknown) => mockValidateAst(parsed),
}));

// Mock @constela/compiler
const mockCompile = vi.fn();
vi.mock('@constela/compiler', () => ({
  compile: (parsed: unknown) => mockCompile(parsed),
}));

// ==================== Test Suite ====================

describe('Playground component - Validate button success feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnChange = undefined;
  });

  // ==================== Success Message Display ====================

  describe('when validation succeeds', () => {
    beforeEach(() => {
      // Setup: validateAst returns success
      mockValidateAst.mockReturnValue({ ok: true, value: {} });
    });

    it('should display success message after clicking Validate button with valid JSON', async () => {
      /**
       * Given: Playground component with valid JSON in editor
       * When: User clicks the Validate button
       * Then: A success message containing "Valid" should be displayed
       *
       * RED PHASE: This test will FAIL - PlaygroundSuccess component does not exist
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      // Find and click the Validate button
      const validateButton = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateButton);

      // Assert: Success message should be visible (using exact text to avoid matching "Validate" button)
      await waitFor(() => {
        expect(screen.getByText('Valid JSON')).toBeInTheDocument();
      });
    });

    it('should display success message with correct styling', async () => {
      /**
       * Given: Playground component with valid JSON
       * When: User clicks Validate and validation succeeds
       * Then: Success message should have success styling (green color indicator)
       *
       * RED PHASE: This test will FAIL - PlaygroundSuccess component does not exist
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      const validateButton = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateButton);

      // Look for success indicator element (PlaygroundSuccess component)
      await waitFor(() => {
        const successElement = screen.getByText('Valid JSON');
        expect(successElement).toHaveClass('text-green-500');
      });
    });
  });

  // ==================== Error Case - No Success Message ====================

  describe('when validation fails', () => {
    beforeEach(() => {
      // Setup: validateAst returns error
      mockValidateAst.mockReturnValue({
        ok: false,
        error: {
          code: 'SCHEMA_INVALID',
          message: 'Invalid schema structure',
          name: 'ConstelaError',
          path: 'root',
        },
      });
    });

    it('should NOT display success message when validation fails', async () => {
      /**
       * Given: Playground component with invalid JSON in editor
       * When: User clicks the Validate button
       * Then: Error panel should be shown, but success message should NOT appear
       *
       * RED PHASE: This test will FAIL - validationSuccess state logic not implemented
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      // Modify the editor to have invalid content (JSON parse error scenario)
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: 'invalid json {' } });

      const validateButton = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateButton);

      // Assert: Error panel should be visible (look for error indicator)
      await waitFor(() => {
        expect(screen.getByText(/\d+\s+Error/)).toBeInTheDocument();
      });

      // Assert: Success message should NOT be present
      expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
    });

    it('should show error panel and hide any previous success message', async () => {
      /**
       * Given: Playground with success message from previous validation
       * When: User modifies code to be invalid and clicks Validate
       * Then: Error panel should appear and success message should disappear
       *
       * RED PHASE: This test will FAIL - validationSuccess state logic not implemented
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      // First: Successful validation
      mockValidateAst.mockReturnValue({ ok: true, value: {} });
      const validateButton = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Valid JSON')).toBeInTheDocument();
      });

      // Then: Change to invalid and validate again
      mockValidateAst.mockReturnValue({
        ok: false,
        error: {
          code: 'SCHEMA_INVALID',
          message: 'Invalid',
          name: 'ConstelaError',
        },
      });

      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: '{ invalid' } });
      fireEvent.click(validateButton);

      // Assert: Error shown, success gone
      await waitFor(() => {
        expect(screen.getByText(/\d+\s+Error/)).toBeInTheDocument();
        expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
      });
    });
  });

  // ==================== Success Message Disappears on Code Change ====================

  describe('when code is modified after successful validation', () => {
    beforeEach(() => {
      mockValidateAst.mockReturnValue({ ok: true, value: {} });
    });

    it('should hide success message when user modifies the editor content', async () => {
      /**
       * Given: Playground with success message visible after validation
       * When: User types in the editor (modifies code)
       * Then: Success message should disappear
       *
       * RED PHASE: This test will FAIL - validationSuccess reset on code change not implemented
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      // Validate successfully
      const validateButton = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateButton);

      // Verify success message is shown
      await waitFor(() => {
        expect(screen.getByText('Valid JSON')).toBeInTheDocument();
      });

      // User modifies the code
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: '{ "modified": true }' } });

      // Assert: Success message should disappear
      await waitFor(() => {
        expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
      });
    });

    it('should allow re-validation after code change', async () => {
      /**
       * Given: Success message disappeared after code change
       * When: User clicks Validate again with valid code
       * Then: Success message should reappear
       *
       * RED PHASE: This test will FAIL - full validation cycle not working
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      const validateButton = screen.getByRole('button', { name: /validate/i });

      // First validation
      fireEvent.click(validateButton);
      await waitFor(() => {
        expect(screen.getByText('Valid JSON')).toBeInTheDocument();
      });

      // Modify code - success disappears
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: '{ "new": "code" }' } });

      await waitFor(() => {
        expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
      });

      // Re-validate
      fireEvent.click(validateButton);

      // Success should reappear
      await waitFor(() => {
        expect(screen.getByText('Valid JSON')).toBeInTheDocument();
      });
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should not show success message on initial render', async () => {
      /**
       * Given: Fresh Playground component
       * When: Component first renders
       * Then: No success message should be visible
       *
       * RED PHASE: This test may pass if state initializes correctly
       */
      mockValidateAst.mockReturnValue({ ok: true, value: {} });
      const { Playground } = await import('./Playground');
      render(<Playground />);

      // Assert: No success message on initial render
      expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
    });

    it('should handle JSON parse error gracefully without success message', async () => {
      /**
       * Given: Playground with syntactically invalid JSON
       * When: User clicks Validate
       * Then: JSON parse error should be shown, no success message
       *
       * RED PHASE: This should work with existing error handling
       */
      const { Playground } = await import('./Playground');
      render(<Playground />);

      // Set invalid JSON that will fail parsing
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: '{ not valid json' } });

      const validateButton = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateButton);

      // Assert: Error shown for JSON parse failure
      await waitFor(() => {
        expect(screen.getByText(/\d+\s+Error/)).toBeInTheDocument();
      });

      // Assert: No success message
      expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
    });
  });
});
