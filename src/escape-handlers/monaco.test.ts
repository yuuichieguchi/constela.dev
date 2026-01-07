/**
 * Test module for Monaco EscapeHandler.
 *
 * Coverage:
 * - Dynamic Monaco Editor import
 * - Editor mount to element
 * - Initial code from ctx.getState('code')
 * - Code updates via ctx.setState('code', ...)
 * - Theme subscription for dark/light mode
 * - Cleanup function to dispose editor
 *
 * TDD Red Phase: These tests are expected to FAIL because:
 * - monaco.ts does not exist yet
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

// Mock Monaco Editor types
interface MockMonacoEditor {
  getValue: Mock;
  setValue: Mock;
  dispose: Mock;
  onDidChangeModelContent: Mock;
  updateOptions: Mock;
}

interface MockMonacoModule {
  editor: {
    create: Mock<[], MockMonacoEditor>;
    setTheme: Mock;
  };
}

// ==================== Mock Setup ====================

const createMockMonacoEditor = (): MockMonacoEditor => {
  let currentValue = '';
  const changeListeners: Array<() => void> = [];

  return {
    getValue: vi.fn(() => currentValue),
    setValue: vi.fn((value: string) => {
      currentValue = value;
    }),
    dispose: vi.fn(),
    onDidChangeModelContent: vi.fn((callback: () => void) => {
      changeListeners.push(callback);
      // Return disposable
      return { dispose: vi.fn() };
    }),
    updateOptions: vi.fn(),
  };
};

const createMockMonacoModule = (mockEditor: MockMonacoEditor): MockMonacoModule => ({
  editor: {
    create: vi.fn(() => mockEditor),
    setTheme: vi.fn(),
  },
});

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
  element.id = 'monaco-container';
  return element;
};

// ==================== Hoisted Mock ====================

// Use vi.hoisted to ensure mock variables are available at hoisting time
const { mockEditor, mockMonacoModule } = vi.hoisted(() => {
  const editor: MockMonacoEditor = {
    getValue: vi.fn(() => ''),
    setValue: vi.fn(),
    dispose: vi.fn(),
    onDidChangeModelContent: vi.fn(() => ({ dispose: vi.fn() })),
    updateOptions: vi.fn(),
  };
  const module: MockMonacoModule = {
    editor: {
      create: vi.fn(() => editor),
      setTheme: vi.fn(),
    },
  };
  return { mockEditor: editor, mockMonacoModule: module };
});

vi.mock('monaco-editor', () => mockMonacoModule);

// ==================== Tests ====================

describe('Monaco EscapeHandler', () => {
  beforeEach(() => {
    // Reset mock implementations for each test
    mockEditor.getValue.mockReturnValue('');
    mockEditor.setValue.mockClear();
    mockEditor.dispose.mockClear();
    mockEditor.onDidChangeModelContent.mockClear();
    mockEditor.onDidChangeModelContent.mockReturnValue({ dispose: vi.fn() });
    mockEditor.updateOptions.mockClear();
    mockMonacoModule.editor.create.mockClear();
    mockMonacoModule.editor.create.mockReturnValue(mockEditor);
    mockMonacoModule.editor.setTheme.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Handler Structure ====================

  describe('handler structure', () => {
    it('should export a handler with name "monaco"', async () => {
      /**
       * Given: Monaco handler module
       * When: Importing the handler
       * Then: Should have name property set to "monaco"
       */
      const { monacoHandler } = await import('./monaco');

      expect(monacoHandler).toBeDefined();
      expect(monacoHandler.name).toBe('monaco');
    });

    it('should have a mount function that returns a cleanup function', async () => {
      /**
       * Given: Monaco handler
       * When: Calling mount with element and context
       * Then: Should return a cleanup function
       */
      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();
      const ctx = createMockContext();

      const cleanup = monacoHandler.mount(element, ctx);

      expect(typeof cleanup).toBe('function');
    });
  });

  // ==================== Dynamic Import ====================

  describe('dynamic Monaco import', () => {
    it('should dynamically import Monaco Editor', async () => {
      /**
       * Given: Monaco handler is mounted
       * When: Handler initializes
       * Then: Should dynamically import monaco-editor
       */
      const importSpy = vi.fn(() => Promise.resolve(mockMonacoModule));
      vi.doMock('monaco-editor', importSpy);

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();
      const ctx = createMockContext();

      monacoHandler.mount(element, ctx);

      // Give time for async import
      await vi.waitFor(() => {
        expect(mockMonacoModule.editor.create).toHaveBeenCalled();
      });
    });
  });

  // ==================== Editor Creation ====================

  describe('editor creation', () => {
    it('should mount editor to the provided element', async () => {
      /**
       * Given: A container element
       * When: Handler mounts
       * Then: Monaco editor should be created with that element
       */
      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();
      const ctx = createMockContext();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockMonacoModule.editor.create).toHaveBeenCalledWith(
          element,
          expect.any(Object)
        );
      });
    });

    it('should initialize editor with code from ctx.getState("code")', async () => {
      /**
       * Given: Context has initial code in state
       * When: Handler mounts
       * Then: Editor should be initialized with that code
       */
      const initialCode = 'const hello = "world";';
      const ctx = createMockContext();
      (ctx.getState as Mock).mockImplementation((name: string) => {
        if (name === 'code') return initialCode;
        return undefined;
      });

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockMonacoModule.editor.create).toHaveBeenCalledWith(
          element,
          expect.objectContaining({
            value: initialCode,
          })
        );
      });
    });

    it('should use empty string when ctx.getState("code") returns undefined', async () => {
      /**
       * Given: Context has no code in state
       * When: Handler mounts
       * Then: Editor should be initialized with empty string
       */
      const ctx = createMockContext();
      (ctx.getState as Mock).mockReturnValue(undefined);

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockMonacoModule.editor.create).toHaveBeenCalledWith(
          element,
          expect.objectContaining({
            value: '',
          })
        );
      });
    });
  });

  // ==================== Code Updates ====================

  describe('code updates', () => {
    it('should call ctx.setState("code", ...) when editor content changes', async () => {
      /**
       * Given: Editor is mounted
       * When: Editor content changes
       * Then: ctx.setState should be called with new code
       */
      const ctx = createMockContext();
      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockEditor.onDidChangeModelContent).toHaveBeenCalled();
      });

      // Simulate content change
      const newCode = 'const updated = true;';
      mockEditor.getValue.mockReturnValue(newCode);

      // Get the change callback and invoke it
      const changeCallback = mockEditor.onDidChangeModelContent.mock.calls[0][0];
      changeCallback();

      expect(ctx.setState).toHaveBeenCalledWith('code', newCode);
    });
  });

  // ==================== Theme Subscription ====================

  describe('theme subscription', () => {
    it('should subscribe to theme changes via ctx.subscribe("theme", ...)', async () => {
      /**
       * Given: Handler is mounting
       * When: Handler initializes
       * Then: Should subscribe to theme state changes
       */
      const ctx = createMockContext();
      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(ctx.subscribe).toHaveBeenCalledWith('theme', expect.any(Function));
      });
    });

    it('should set Monaco theme to "vs-dark" when theme is "dark"', async () => {
      /**
       * Given: Editor is mounted
       * When: Theme state changes to "dark"
       * Then: Monaco editor theme should be set to "vs-dark"
       */
      const subscribers: Record<string, (value: unknown) => void> = {};
      const ctx = createMockContext({
        subscribe: vi.fn((name: string, fn: (value: unknown) => void) => {
          subscribers[name] = fn;
          return vi.fn();
        }),
      });

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(subscribers['theme']).toBeDefined();
      });

      // Trigger theme change
      subscribers['theme']('dark');

      expect(mockMonacoModule.editor.setTheme).toHaveBeenCalledWith('vs-dark');
    });

    it('should set Monaco theme to "vs" when theme is "light"', async () => {
      /**
       * Given: Editor is mounted
       * When: Theme state changes to "light"
       * Then: Monaco editor theme should be set to "vs"
       */
      const subscribers: Record<string, (value: unknown) => void> = {};
      const ctx = createMockContext({
        subscribe: vi.fn((name: string, fn: (value: unknown) => void) => {
          subscribers[name] = fn;
          return vi.fn();
        }),
      });

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(subscribers['theme']).toBeDefined();
      });

      // Trigger theme change
      subscribers['theme']('light');

      expect(mockMonacoModule.editor.setTheme).toHaveBeenCalledWith('vs');
    });
  });

  // ==================== Cleanup ====================

  describe('cleanup', () => {
    it('should dispose Monaco editor when cleanup is called', async () => {
      /**
       * Given: Editor is mounted
       * When: Cleanup function is called
       * Then: Editor should be disposed
       */
      const ctx = createMockContext();
      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      const cleanup = monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockMonacoModule.editor.create).toHaveBeenCalled();
      });

      cleanup();

      expect(mockEditor.dispose).toHaveBeenCalled();
    });

    it('should unsubscribe from theme changes when cleanup is called', async () => {
      /**
       * Given: Editor is mounted and subscribed to theme
       * When: Cleanup function is called
       * Then: Theme subscription should be removed
       */
      const unsubscribe = vi.fn();
      const ctx = createMockContext({
        subscribe: vi.fn(() => unsubscribe),
      });

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      const cleanup = monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(ctx.subscribe).toHaveBeenCalled();
      });

      cleanup();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle Monaco import failure gracefully', async () => {
      /**
       * Given: Monaco import fails
       * When: Handler mounts
       * Then: Should not throw and cleanup should be safe to call
       */
      vi.doMock('monaco-editor', () => {
        throw new Error('Failed to load Monaco');
      });

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();
      const ctx = createMockContext();

      // Should not throw
      const cleanup = monacoHandler.mount(element, ctx);
      expect(() => cleanup()).not.toThrow();
    });

    it('should handle ctx.getState returning non-string code', async () => {
      /**
       * Given: ctx.getState returns a number instead of string
       * When: Handler mounts
       * Then: Should convert to string or use empty string
       */
      // Reset the monaco-editor mock that was broken by the previous test
      vi.doMock('monaco-editor', () => mockMonacoModule);
      vi.resetModules();

      const ctx = createMockContext();
      // Override getState to return a number for 'code'
      ctx.getState = vi.fn((name: string) => {
        if (name === 'code') return 12345;
        return undefined;
      });

      const { monacoHandler } = await import('./monaco');
      const element = createMockElement();

      monacoHandler.mount(element, ctx);

      await vi.waitFor(() => {
        expect(mockMonacoModule.editor.create).toHaveBeenCalledWith(
          element,
          expect.objectContaining({
            value: '12345',
          })
        );
      });
    });
  });
});
