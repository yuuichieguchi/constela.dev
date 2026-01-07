/**
 * Test module for Playground EscapeHandler.
 *
 * Coverage:
 * - Handler structure (name property, mount function)
 * - mount returns a cleanup function
 * - Dynamic import for React components
 * - Cleanup function behavior
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - playground.ts does not exist yet
 */

import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';

// ==================== Types ====================

interface AppInstance {
  // Minimal interface for testing
}

interface EscapeContext {
  appInstance: AppInstance;
  getState: (name: string) => unknown;
  setState: (name: string, value: unknown) => void;
  subscribe: (name: string, fn: (value: unknown) => void) => () => void;
}

interface EscapeHandler {
  name: string;
  mount: (element: HTMLElement, ctx: EscapeContext) => () => void;
}

// ==================== Mock Setup ====================

const createMockContext = (overrides: Partial<EscapeContext> = {}): EscapeContext => {
  const state: Record<string, unknown> = {};
  const subscribers: Record<string, Array<(value: unknown) => void>> = {};

  return {
    appInstance: {},
    getState: vi.fn((name: string) => state[name]),
    setState: vi.fn((name: string, value: unknown) => {
      state[name] = value;
      subscribers[name]?.forEach((fn) => fn(value));
    }),
    subscribe: vi.fn((name: string, fn: (value: unknown) => void) => {
      if (!subscribers[name]) {
        subscribers[name] = [];
      }
      subscribers[name].push(fn);
      return vi.fn(() => {
        const index = subscribers[name].indexOf(fn);
        if (index > -1) {
          subscribers[name].splice(index, 1);
        }
      });
    }),
    ...overrides,
  };
};

const createMockElement = (): HTMLElement => {
  const element = document.createElement('div');
  element.id = 'playground-container';
  return element;
};

// ==================== Hoisted Mock ====================

// Mock React and ReactDOM for dynamic import testing
const { mockReactDOM, mockPlaygroundComponent } = vi.hoisted(() => {
  const mockRoot = {
    render: vi.fn(),
    unmount: vi.fn(),
  };

  return {
    mockReactDOM: {
      createRoot: vi.fn(() => mockRoot),
    },
    mockPlaygroundComponent: vi.fn(() => null),
  };
});

vi.mock('react', () => ({
  createElement: vi.fn(() => null),
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockReactDOM.createRoot,
}));

vi.mock('@/components/playground', () => ({
  Playground: mockPlaygroundComponent,
}));

vi.mock('@/components/playground/example-codes', () => ({
  EXAMPLE_CODES: {
    counter: '{}',
    'todo-list': '{}',
  },
}));

// ==================== Tests ====================

describe('Playground EscapeHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReactDOM.createRoot.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Handler Structure ====================

  describe('handler structure', () => {
    it('should export a handler with name "playground"', async () => {
      /**
       * Given: Playground handler module
       * When: Importing the handler
       * Then: Should have name property set to "playground"
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const { playgroundHandler } = await import('./playground');

      expect(playgroundHandler).toBeDefined();
      expect(playgroundHandler.name).toBe('playground');
    });

    it('should have a mount function', async () => {
      /**
       * Given: Playground handler
       * When: Inspecting handler properties
       * Then: Should have mount as a function
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const { playgroundHandler } = await import('./playground');

      expect(playgroundHandler).toHaveProperty('mount');
      expect(typeof playgroundHandler.mount).toBe('function');
    });

    it('should have mount function that returns a cleanup function', async () => {
      /**
       * Given: Playground handler
       * When: Calling mount with element and context
       * Then: Should return a cleanup function
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockElement();
      const ctx = createMockContext();

      const cleanup = playgroundHandler.mount(element, ctx);

      expect(typeof cleanup).toBe('function');
    });
  });

  // ==================== Dynamic Import ====================

  describe('dynamic import', () => {
    it('should dynamically import React components when mounted', async () => {
      /**
       * Given: Playground handler is mounted
       * When: Handler initializes
       * Then: Should dynamically import React components
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockElement();
      const ctx = createMockContext();

      playgroundHandler.mount(element, ctx);

      // Give time for async import
      await vi.waitFor(() => {
        expect(mockReactDOM.createRoot).toHaveBeenCalled();
      });
    });

    it('should call createRoot with the provided element', async () => {
      /**
       * Given: Playground handler is mounted
       * When: React components are loaded
       * Then: Should create React root with the provided element
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockElement();
      const ctx = createMockContext();

      playgroundHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockReactDOM.createRoot).toHaveBeenCalledWith(element);
      });
    });
  });

  // ==================== Cleanup ====================

  describe('cleanup', () => {
    it('should unmount React root when cleanup is called', async () => {
      /**
       * Given: Handler is mounted
       * When: Cleanup function is called
       * Then: React root should be unmounted
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const mockRoot = {
        render: vi.fn(),
        unmount: vi.fn(),
      };
      mockReactDOM.createRoot.mockReturnValue(mockRoot);

      const { playgroundHandler } = await import('./playground');
      const element = createMockElement();
      const ctx = createMockContext();

      const cleanup = playgroundHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockReactDOM.createRoot).toHaveBeenCalled();
      });

      cleanup();

      expect(mockRoot.unmount).toHaveBeenCalled();
    });

    it('should be safe to call cleanup before import completes', async () => {
      /**
       * Given: Handler is mounted but import not yet resolved
       * When: Cleanup is called immediately
       * Then: Should not throw an error
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockElement();
      const ctx = createMockContext();

      const cleanup = playgroundHandler.mount(element, ctx);

      // Call cleanup immediately without waiting
      expect(() => cleanup()).not.toThrow();
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle import failure gracefully', async () => {
      /**
       * Given: React component import fails
       * When: Handler mounts
       * Then: Should not throw and cleanup should be safe to call
       *
       * RED PHASE: This test will FAIL - playground.ts does not exist
       */
      vi.doMock('react-dom/client', () => {
        throw new Error('Failed to load React');
      });

      const { playgroundHandler } = await import('./playground');
      const element = createMockElement();
      const ctx = createMockContext();

      // Should not throw
      const cleanup = playgroundHandler.mount(element, ctx);
      expect(() => cleanup()).not.toThrow();
    });
  });
});
