/**
 * Monaco EscapeHandler
 *
 * Manages Monaco Editor integration.
 * - Dynamically imports Monaco Editor
 * - Initializes editor with code from ctx.getState('code')
 * - Updates ctx state when editor content changes
 * - Subscribes to theme changes for editor theme sync
 * - Properly disposes editor and subscriptions on cleanup
 */

interface AppInstance {
  // Minimal interface
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

// Monaco Editor types (minimal for our use case)
interface MonacoEditor {
  getValue: () => string;
  setValue: (value: string) => void;
  dispose: () => void;
  onDidChangeModelContent: (callback: () => void) => { dispose: () => void };
  updateOptions: (options: Record<string, unknown>) => void;
}

interface MonacoModule {
  editor: {
    create: (element: HTMLElement, options: Record<string, unknown>) => MonacoEditor;
    setTheme: (theme: string) => void;
  };
}

/**
 * Maps application theme to Monaco Editor theme.
 */
function getMonacoTheme(theme: unknown): string {
  return theme === 'light' ? 'vs' : 'vs-dark';
}

/**
 * Safely converts a value to string for editor initialization.
 */
function getInitialCode(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value !== undefined && value !== null) {
    return String(value);
  }
  return '';
}

export const monacoHandler: EscapeHandler = {
  name: 'monaco',
  mount: (element: HTMLElement, ctx: EscapeContext): (() => void) => {
    let editor: MonacoEditor | null = null;
    let themeUnsubscribe: (() => void) | null = null;
    let contentChangeDisposable: { dispose: () => void } | null = null;
    let isDisposed = false;

    // Dynamically import Monaco Editor
    import('monaco-editor')
      .then((monaco: MonacoModule) => {
        // Guard against cleanup being called before import resolves
        if (isDisposed) {
          return;
        }

        // Get initial code from context state
        const initialCode = getInitialCode(ctx.getState('code'));

        // Create editor with options
        editor = monaco.editor.create(element, {
          value: initialCode,
          language: 'json',
          theme: getMonacoTheme(ctx.getState('theme')),
        });

        // Subscribe to editor content changes
        contentChangeDisposable = editor.onDidChangeModelContent(() => {
          if (editor) {
            const newValue = editor.getValue();
            ctx.setState('code', newValue);
          }
        });

        // Subscribe to theme state changes
        themeUnsubscribe = ctx.subscribe('theme', (theme: unknown) => {
          monaco.editor.setTheme(getMonacoTheme(theme));
        });
      })
      .catch(() => {
        // Handle import failure gracefully - do nothing
        // Cleanup will still be safe to call
      });

    // Return cleanup function
    return () => {
      isDisposed = true;

      // Dispose content change listener
      if (contentChangeDisposable) {
        contentChangeDisposable.dispose();
        contentChangeDisposable = null;
      }

      // Unsubscribe from theme changes
      if (themeUnsubscribe) {
        themeUnsubscribe();
        themeUnsubscribe = null;
      }

      // Dispose editor
      if (editor) {
        editor.dispose();
        editor = null;
      }
    };
  },
};
