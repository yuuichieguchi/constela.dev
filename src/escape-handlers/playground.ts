/**
 * Playground EscapeHandler
 *
 * Manages Playground component integration.
 * - Dynamically imports React and Playground component
 * - Reads example parameter from URL for initial code
 * - Properly unmounts React root on cleanup
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

// React DOM types (minimal for our use case)
interface ReactRoot {
  render: (children: unknown) => void;
  unmount: () => void;
}

export const playgroundHandler: EscapeHandler = {
  name: 'playground',
  mount: (element: HTMLElement, _ctx: EscapeContext): (() => void) => {
    let root: ReactRoot | null = null;
    let isDisposed = false;

    // Dynamically import React, React DOM and Playground component
    Promise.all([
      import('react'),
      import('react-dom/client'),
      import('@/components/playground'),
      import('@/components/playground/example-codes'),
    ])
      .then(([React, ReactDOM, { Playground }, { EXAMPLE_CODES }]) => {
        // Guard against cleanup being called before import resolves
        if (isDisposed) {
          return;
        }

        // Get initial code from URL if ?example=xxx parameter exists
        const searchParams = new URLSearchParams(window.location.search);
        const example = searchParams.get('example');

        const initialCode =
          example && EXAMPLE_CODES[example] ? EXAMPLE_CODES[example] : undefined;

        // Create React root and render Playground
        root = ReactDOM.createRoot(element);
        root.render(React.createElement(Playground, { initialCode }));
      })
      .catch(() => {
        // Handle import failure gracefully - do nothing
        // Cleanup will still be safe to call
      });

    // Return cleanup function
    return () => {
      isDisposed = true;

      // Unmount React root
      if (root) {
        root.unmount();
        root = null;
      }
    };
  },
};
