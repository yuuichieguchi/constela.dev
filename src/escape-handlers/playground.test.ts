/**
 * Test module for Playground EscapeHandler.
 *
 * Coverage:
 * - Handler structure (name property, mount function)
 * - mount returns a cleanup function
 * - Sets up click handlers for Validate and Run buttons
 * - Reads initial code from URL ?example=xxx parameter
 * - Initializes ctx state with code from example-codes
 * - Cleanup removes event listeners
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

// ==================== Mock Setup ====================

const createMockContext = (
  initialState: Record<string, unknown> = {}
): EscapeContext => {
  const state: Record<string, unknown> = { ...initialState };
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
  };
};

/**
 * Creates a mock playground container element with all required child elements
 */
const createMockPlaygroundElement = (): HTMLElement => {
  const container = document.createElement('div');
  container.setAttribute('data-constela-escape', 'playground');

  // Add validate button
  const validateBtn = document.createElement('button');
  validateBtn.id = 'validate-btn';
  container.appendChild(validateBtn);

  // Add run button
  const runBtn = document.createElement('button');
  runBtn.id = 'run-btn';
  container.appendChild(runBtn);

  // Add editor container
  const editorContainer = document.createElement('div');
  editorContainer.id = 'editor-container';
  container.appendChild(editorContainer);

  // Add preview container
  const previewContainer = document.createElement('div');
  previewContainer.id = 'preview-container';
  container.appendChild(previewContainer);

  // Add message container
  const messageContainer = document.createElement('div');
  messageContainer.id = 'message-container';
  container.appendChild(messageContainer);

  return container;
};

// ==================== Hoisted Mock ====================

// Mock @constela/core
vi.mock('@constela/core', () => ({
  validateAst: vi.fn(() => ({ ok: true, value: {} })),
}));

// Mock @constela/compiler
vi.mock('@constela/compiler', () => ({
  compile: vi.fn(() => ({ ok: true, program: {} })),
}));

// Mock @constela/runtime
vi.mock('@constela/runtime', () => ({
  createApp: vi.fn(() => ({ destroy: vi.fn() })),
}));

// Mock example-codes
vi.mock('@/components/playground/example-codes', () => ({
  EXAMPLE_CODES: {
    counter: '{"version":"1.0","view":{"kind":"text","value":{"expr":"lit","value":"Counter"}}}',
    'todo-list': '{"version":"1.0","view":{"kind":"text","value":{"expr":"lit","value":"Todo"}}}',
  },
  DEFAULT_CODE: '{"version":"1.0","view":{"kind":"text","value":{"expr":"lit","value":"Default"}}}',
}));

// ==================== Tests ====================

describe('Playground EscapeHandler', () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    // Save original location
    originalLocation = window.location;
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '',
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  // ==================== Handler Structure ====================

  describe('handler structure', () => {
    it('should export a handler with name "playground"', async () => {
      /**
       * Given: Playground handler module
       * When: Importing the handler
       * Then: Should have name property set to "playground"
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
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();

      const cleanup = playgroundHandler.mount(element, ctx);

      expect(typeof cleanup).toBe('function');
    });
  });

  // ==================== Initial Code Setup ====================

  describe('initial code setup', () => {
    it('should set default code in ctx state when no URL parameter', async () => {
      /**
       * Given: No ?example parameter in URL
       * When: Handler mounts
       * Then: Should set default code in ctx state
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();

      playgroundHandler.mount(element, ctx);

      expect(ctx.setState).toHaveBeenCalledWith(
        'code',
        expect.any(String)
      );
    });

    it('should set example code when ?example=counter in URL', async () => {
      /**
       * Given: ?example=counter parameter in URL
       * When: Handler mounts
       * Then: Should set counter example code in ctx state
       */
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, search: '?example=counter' },
        writable: true,
      });

      vi.resetModules();
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();

      playgroundHandler.mount(element, ctx);

      expect(ctx.setState).toHaveBeenCalledWith(
        'code',
        expect.stringContaining('Counter')
      );
    });

    it('should set default code when ?example has unknown value', async () => {
      /**
       * Given: ?example=unknown parameter in URL
       * When: Handler mounts
       * Then: Should fall back to default code
       */
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, search: '?example=unknown' },
        writable: true,
      });

      vi.resetModules();
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();

      playgroundHandler.mount(element, ctx);

      expect(ctx.setState).toHaveBeenCalledWith(
        'code',
        expect.any(String)
      );
    });
  });

  // ==================== Button Click Handlers ====================

  describe('button click handlers', () => {
    it('should add click listener to validate button', async () => {
      /**
       * Given: Playground handler mounts
       * When: Handler initializes
       * Then: Validate button should have click listener
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();
      const validateBtn = element.querySelector('#validate-btn') as HTMLButtonElement;
      const addEventListenerSpy = vi.spyOn(validateBtn, 'addEventListener');

      playgroundHandler.mount(element, ctx);

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should add click listener to run button', async () => {
      /**
       * Given: Playground handler mounts
       * When: Handler initializes
       * Then: Run button should have click listener
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();
      const runBtn = element.querySelector('#run-btn') as HTMLButtonElement;
      const addEventListenerSpy = vi.spyOn(runBtn, 'addEventListener');

      playgroundHandler.mount(element, ctx);

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  // ==================== Cleanup ====================

  describe('cleanup', () => {
    it('should remove click listeners when cleanup is called', async () => {
      /**
       * Given: Handler is mounted
       * When: Cleanup function is called
       * Then: Event listeners should be removed
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();
      const validateBtn = element.querySelector('#validate-btn') as HTMLButtonElement;
      const removeEventListenerSpy = vi.spyOn(validateBtn, 'removeEventListener');

      const cleanup = playgroundHandler.mount(element, ctx);
      cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should be safe to call cleanup immediately', async () => {
      /**
       * Given: Handler is mounted
       * When: Cleanup is called immediately
       * Then: Should not throw an error
       */
      const { playgroundHandler } = await import('./playground');
      const element = createMockPlaygroundElement();
      const ctx = createMockContext();

      const cleanup = playgroundHandler.mount(element, ctx);

      expect(() => cleanup()).not.toThrow();
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle missing validate button gracefully', async () => {
      /**
       * Given: Element without validate button
       * When: Handler mounts
       * Then: Should not throw
       */
      const { playgroundHandler } = await import('./playground');
      const element = document.createElement('div');
      const ctx = createMockContext();

      expect(() => playgroundHandler.mount(element, ctx)).not.toThrow();
    });

    it('should handle missing run button gracefully', async () => {
      /**
       * Given: Element without run button
       * When: Handler mounts
       * Then: Should not throw
       */
      const { playgroundHandler } = await import('./playground');
      const element = document.createElement('div');
      element.innerHTML = '<button id="validate-btn"></button>';
      const ctx = createMockContext();

      expect(() => playgroundHandler.mount(element, ctx)).not.toThrow();
    });
  });
});
