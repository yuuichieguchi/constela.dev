/**
 * Test module for CodeDemo component - Constela runtime integration.
 *
 * Coverage:
 * - Constela runtime is used (not React state)
 * - Counter increment/decrement works via Constela actions
 * - Component cleanup on unmount (destroy() called)
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - Current implementation uses React useState, not @constela/runtime
 * - createApp() is not called
 * - compile() is not called
 * - destroy() cleanup is not implemented
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { CodeDemo } from '../CodeDemo';

// ==================== Mocks ====================

// Mock @constela/runtime
const mockDestroy = vi.fn();
const mockSetState = vi.fn();
const mockGetState = vi.fn();
const mockCreateApp = vi.fn(
  (_program: unknown, _mount: HTMLElement) =>
    ({
      destroy: mockDestroy,
      setState: mockSetState,
      getState: mockGetState,
    }) as const
);

vi.mock('@constela/runtime', () => ({
  createApp: (program: unknown, mount: HTMLElement) =>
    mockCreateApp(program, mount),
}));

// Mock @constela/compiler
const mockCompile = vi.fn();
vi.mock('@constela/compiler', () => ({
  compile: (input: unknown) => mockCompile(input),
}));

// ==================== Test Suite ====================

describe('CodeDemo component - Constela runtime integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default successful compile result
    mockCompile.mockReturnValue({
      ok: true,
      program: {
        version: '1.0',
        state: { count: { type: 'number', initial: 0 } },
        actions: {
          increment: { name: 'increment', steps: [] },
          decrement: { name: 'decrement', steps: [] },
        },
        view: { kind: 'element', tag: 'div', children: [] },
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  // ==================== Runtime Integration ====================

  describe('Constela runtime integration', () => {
    it('should call compile() with counter JSON on mount', async () => {
      /**
       * Given: CodeDemo component
       * When: Component mounts
       * Then: compile() should be called with the counter JSON definition
       *
       * RED PHASE: Current implementation uses useState, not compile()
       */
      render(<CodeDemo />);

      await waitFor(() => {
        expect(mockCompile).toHaveBeenCalledTimes(1);
      });
      // Verify compile is called with an object containing counter state
      const calledWith = mockCompile.mock.calls[0][0];
      expect(calledWith).toHaveProperty('state');
      expect(calledWith.state).toHaveProperty('count');
    });

    it('should call createApp() with compiled program on mount', async () => {
      /**
       * Given: CodeDemo component with successful compilation
       * When: Component mounts
       * Then: createApp() should be called with the compiled program
       *
       * RED PHASE: Current implementation does not use createApp()
       */
      render(<CodeDemo />);

      await waitFor(() => {
        expect(mockCreateApp).toHaveBeenCalledTimes(1);
      });
      // First argument should be the compiled program
      const [program, mountElement] = mockCreateApp.mock.calls[0];
      expect(program).toHaveProperty('version', '1.0');
      expect(program).toHaveProperty('state');
      expect(program).toHaveProperty('actions');
      expect(program).toHaveProperty('view');
      // Second argument should be an HTML element (the mount point)
      expect(mountElement).toBeInstanceOf(HTMLElement);
    });

    it('should mount Constela app to the preview container', async () => {
      /**
       * Given: CodeDemo component
       * When: Component mounts
       * Then: createApp() should receive a container element for mounting
       *
       * RED PHASE: Current implementation renders React buttons directly
       */
      render(<CodeDemo />);

      await waitFor(() => {
        expect(mockCreateApp).toHaveBeenCalled();
      });
      const [, mountElement] = mockCreateApp.mock.calls[0];
      // The mount element should be a DOM element
      expect(mountElement).toBeDefined();
      expect(mountElement.nodeType).toBe(Node.ELEMENT_NODE);
    });

    it('should NOT use React useState for counter state', async () => {
      /**
       * Given: CodeDemo component
       * When: Rendered
       * Then: Counter value should be rendered by Constela, not React state
       *
       * RED PHASE: Current implementation has React onClick handlers
       */
      render(<CodeDemo />);

      // The preview panel should exist but NOT contain React-controlled buttons
      // with onClick={() => setCount(...)} pattern
      // Instead, Constela runtime should handle the rendering
      await waitFor(() => {
        expect(mockCreateApp).toHaveBeenCalled();
      });

      // The preview section should have a container for Constela to mount to
      const previewSection = screen.getByText('Live Preview').closest('div');
      expect(previewSection).toBeInTheDocument();
    });
  });

  // ==================== Component Cleanup ====================

  describe('component cleanup on unmount', () => {
    it('should call destroy() when component unmounts', async () => {
      /**
       * Given: CodeDemo component mounted with Constela app
       * When: Component unmounts
       * Then: destroy() should be called on the app instance
       *
       * RED PHASE: Current implementation has no cleanup logic
       */
      const { unmount } = render(<CodeDemo />);

      // Verify createApp was called
      await waitFor(() => {
        expect(mockCreateApp).toHaveBeenCalled();
      });

      // Unmount the component
      unmount();

      // destroy() should be called
      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });

    it('should not call destroy() if createApp was not called', async () => {
      /**
       * Given: CodeDemo component where compile fails
       * When: Component unmounts
       * Then: destroy() should NOT be called (no app instance exists)
       *
       * RED PHASE: Current implementation has no conditional cleanup
       */
      // Make compile fail
      mockCompile.mockReturnValue({
        ok: false,
        errors: [{ code: 'COMPILE_ERROR', message: 'Test error' }],
      });

      const { unmount } = render(<CodeDemo />);

      // Wait for compile to be called
      await waitFor(() => {
        expect(mockCompile).toHaveBeenCalled();
      });

      // createApp should not be called when compile fails
      expect(mockCreateApp).not.toHaveBeenCalled();

      // Unmount
      unmount();

      // destroy should not be called since no app was created
      expect(mockDestroy).not.toHaveBeenCalled();
    });

    it('should handle multiple mount/unmount cycles correctly', async () => {
      /**
       * Given: CodeDemo component
       * When: Component is mounted and unmounted multiple times
       * Then: Each cycle should properly create and destroy the app
       *
       * RED PHASE: Current implementation has no lifecycle management
       */
      // First mount/unmount cycle
      const { unmount: unmount1 } = render(<CodeDemo />);
      await waitFor(() => {
        expect(mockCreateApp).toHaveBeenCalledTimes(1);
      });
      unmount1();
      expect(mockDestroy).toHaveBeenCalledTimes(1);

      // Second mount/unmount cycle
      const { unmount: unmount2 } = render(<CodeDemo />);
      await waitFor(() => {
        expect(mockCreateApp).toHaveBeenCalledTimes(2);
      });
      unmount2();
      expect(mockDestroy).toHaveBeenCalledTimes(2);
    });
  });

  // ==================== Counter JSON Definition ====================

  describe('counter JSON definition', () => {
    it('should compile valid counter JSON with state and actions', async () => {
      /**
       * Given: CodeDemo component
       * When: compile() is called
       * Then: The JSON should have count state and increment/decrement actions
       *
       * RED PHASE: Current implementation may not call compile with correct structure
       */
      render(<CodeDemo />);

      await waitFor(() => {
        expect(mockCompile).toHaveBeenCalled();
      });
      const input = mockCompile.mock.calls[0][0];

      // Verify state definition
      expect(input.state).toBeDefined();
      expect(input.state.count).toEqual({
        type: 'number',
        initial: 0,
      });

      // Verify actions
      expect(input.actions).toBeDefined();
      expect(input.actions).toContainEqual(
        expect.objectContaining({ name: 'increment' })
      );
      expect(input.actions).toContainEqual(
        expect.objectContaining({ name: 'decrement' })
      );
    });

    it('should include view definition with counter display and buttons', async () => {
      /**
       * Given: CodeDemo component
       * When: compile() is called
       * Then: The view should reference count state and have button elements
       *
       * RED PHASE: Current implementation may not pass view to compile
       */
      render(<CodeDemo />);

      await waitFor(() => {
        expect(mockCompile).toHaveBeenCalled();
      });
      const input = mockCompile.mock.calls[0][0];

      // Verify view exists
      expect(input.view).toBeDefined();
      expect(input.view.kind).toBe('element');
    });
  });

  // ==================== Error Handling ====================

  describe('error handling', () => {
    it('should handle compile failure gracefully', async () => {
      /**
       * Given: CodeDemo component with compile failure
       * When: Component mounts
       * Then: Component should render without crashing, createApp not called
       *
       * RED PHASE: Current implementation does not use compile()
       */
      mockCompile.mockReturnValue({
        ok: false,
        errors: [
          {
            code: 'SCHEMA_INVALID',
            message: 'Invalid schema',
            name: 'ConstelaError',
          },
        ],
      });

      // Should not throw
      expect(() => render(<CodeDemo />)).not.toThrow();

      // Wait for compile to be called
      await waitFor(() => {
        expect(mockCompile).toHaveBeenCalled();
      });

      // createApp should not be called on compile failure
      expect(mockCreateApp).not.toHaveBeenCalled();
    });

    it('should still show the code panel when compile fails', () => {
      /**
       * Given: CodeDemo component with compile failure
       * When: Component renders
       * Then: The code panel with JSON should still be visible
       *
       * RED PHASE: Should pass as code panel is always shown
       */
      mockCompile.mockReturnValue({
        ok: false,
        errors: [{ code: 'ERROR', message: 'Compile failed' }],
      });

      render(<CodeDemo />);

      // Code panel should still be visible
      expect(screen.getByText('counter.constela.json')).toBeInTheDocument();
    });
  });

  // ==================== UI Structure ====================

  describe('UI structure', () => {
    it('should render section heading', () => {
      /**
       * Given: CodeDemo component
       * When: Rendered
       * Then: Section heading should be visible
       */
      render(<CodeDemo />);

      expect(screen.getByText('See It in Action')).toBeInTheDocument();
    });

    it('should render code panel with counter JSON', () => {
      /**
       * Given: CodeDemo component
       * When: Rendered
       * Then: Code panel should show the counter JSON definition
       */
      render(<CodeDemo />);

      expect(screen.getByText('counter.constela.json')).toBeInTheDocument();
      // The code should contain the counter definition
      expect(screen.getByRole('code')).toBeInTheDocument();
    });

    it('should render preview panel with Live Preview label', () => {
      /**
       * Given: CodeDemo component
       * When: Rendered
       * Then: Preview panel should have "Live Preview" label
       */
      render(<CodeDemo />);

      expect(screen.getByText('Live Preview')).toBeInTheDocument();
    });

    it('should have a copy button', () => {
      /**
       * Given: CodeDemo component
       * When: Rendered
       * Then: Copy button should be present
       */
      render(<CodeDemo />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toBeInTheDocument();
    });
  });
});
