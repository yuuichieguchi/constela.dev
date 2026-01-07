/**
 * Playground EscapeHandler
 *
 * Manages Playground interactivity using pure JavaScript.
 * - Reads example parameter from URL for initial code
 * - Sets up click handlers for Validate and Run buttons
 * - Uses @constela/core (validateAst), @constela/compiler (compile),
 *   and @constela/runtime (createApp) for preview rendering
 * - Shows error/success messages in the message container
 */

import { validateAst } from '@constela/core';
import { compile, type CompiledProgram } from '@constela/compiler';
import { createApp, type AppInstance as ConstelaAppInstance } from '@constela/runtime';
import { EXAMPLE_CODES, DEFAULT_CODE } from '@/components/playground/example-codes';

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

interface ConstelaError {
  code: string;
  message: string;
  path?: string;
}

/**
 * Gets the initial code from URL parameter or returns default
 */
function getInitialCode(): string {
  const searchParams = new URLSearchParams(window.location.search);
  const example = searchParams.get('example');

  if (example && EXAMPLE_CODES[example]) {
    return EXAMPLE_CODES[example];
  }
  return DEFAULT_CODE;
}

/**
 * Creates error message HTML
 */
function createErrorHtml(errors: ConstelaError[], runtimeError?: Error): string {
  const errorCount = errors.length + (runtimeError ? 1 : 0);
  const errorItems = errors
    .map(
      (error) => `
      <li class="px-4 py-3">
        <div class="flex items-start gap-3">
          <span class="shrink-0 rounded bg-red-500/20 px-2 py-0.5 text-xs font-mono text-red-500">
            ${error.code}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-foreground">${error.message}</p>
            ${error.path ? `<p class="mt-1 text-xs font-mono text-muted-foreground">Path: ${error.path}</p>` : ''}
          </div>
        </div>
      </li>
    `
    )
    .join('');

  const runtimeErrorItem = runtimeError
    ? `
      <li class="px-4 py-3">
        <div class="flex items-start gap-3">
          <span class="shrink-0 rounded bg-red-500/20 px-2 py-0.5 text-xs font-mono text-red-500">
            RUNTIME
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-foreground">${runtimeError.message}</p>
          </div>
        </div>
      </li>
    `
    : '';

  return `
    <div class="rounded-lg border border-red-500/30 bg-red-500/10">
      <div class="flex items-center border-b border-red-500/30 px-4 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-red-500">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span class="text-sm font-medium text-red-500">
          ${errorCount} Error${errorCount > 1 ? 's' : ''}
        </span>
      </div>
      <ul class="divide-y divide-red-500/20">
        ${errorItems}
        ${runtimeErrorItem}
      </ul>
    </div>
  `;
}

/**
 * Creates success message HTML
 */
function createSuccessHtml(): string {
  return `
    <div role="status" aria-live="polite" class="rounded-lg border border-green-500/30 bg-green-500/10">
      <div class="flex items-center px-4 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-green-500" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span class="text-sm font-medium text-green-500">Valid JSON</span>
      </div>
    </div>
  `;
}

export const playgroundHandler: EscapeHandler = {
  name: 'playground',
  mount: (element: HTMLElement, ctx: EscapeContext): (() => void) => {
    // Get DOM elements
    const validateBtn = element.querySelector('#validate-btn') as HTMLButtonElement | null;
    const runBtn = element.querySelector('#run-btn') as HTMLButtonElement | null;
    const previewContainer = element.querySelector('#preview-container') as HTMLElement | null;
    const messageContainer = element.querySelector('#message-container') as HTMLElement | null;

    // Store current app instance for cleanup
    let currentApp: ConstelaAppInstance | null = null;

    // Set initial code in context state
    const initialCode = getInitialCode();
    ctx.setState('code', initialCode);

    /**
     * Gets current code from context state
     */
    const getCode = (): string => {
      const code = ctx.getState('code');
      return typeof code === 'string' ? code : '';
    };

    /**
     * Shows error message
     */
    const showError = (errors: ConstelaError[], runtimeError?: Error): void => {
      if (messageContainer) {
        messageContainer.innerHTML = createErrorHtml(errors, runtimeError);
      }
    };

    /**
     * Shows success message
     */
    const showSuccess = (): void => {
      if (messageContainer) {
        messageContainer.innerHTML = createSuccessHtml();
      }
    };

    /**
     * Clears message
     */
    const clearMessage = (): void => {
      if (messageContainer) {
        messageContainer.innerHTML = '';
      }
    };

    /**
     * Creates JSON parse error
     */
    const createJsonParseError = (message: string): ConstelaError => ({
      code: 'SCHEMA_INVALID',
      message: `JSON Parse Error: ${message}`,
    });

    /**
     * Handles Validate button click
     */
    const handleValidate = (): void => {
      clearMessage();

      const code = getCode();

      // Parse JSON
      let parsed: unknown;
      try {
        parsed = JSON.parse(code);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid JSON';
        showError([createJsonParseError(message)]);
        return;
      }

      // Validate AST
      const result = validateAst(parsed);
      if (!result.ok) {
        const errorResult = result as { ok: false; error: ConstelaError };
        showError([errorResult.error]);
        return;
      }

      showSuccess();
    };

    /**
     * Handles Run button click
     */
    const handleRun = (): void => {
      clearMessage();

      // Destroy previous app if exists
      if (currentApp) {
        try {
          currentApp.destroy();
        } catch {
          // Ignore cleanup errors
        }
        currentApp = null;
      }

      // Clear preview container
      if (previewContainer) {
        previewContainer.innerHTML = '';
      }

      const code = getCode();

      // Parse JSON
      let parsed: unknown;
      try {
        parsed = JSON.parse(code);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid JSON';
        showError([createJsonParseError(message)]);
        return;
      }

      // Compile
      const result = compile(parsed);
      if (!result.ok) {
        const errorResult = result as { ok: false; errors: ConstelaError[] };
        showError(errorResult.errors);
        return;
      }

      // Mount app
      if (previewContainer) {
        try {
          currentApp = createApp(result.program as CompiledProgram, previewContainer);
        } catch (err) {
          showError([], err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    // Attach event listeners
    if (validateBtn) {
      validateBtn.addEventListener('click', handleValidate);
    }
    if (runBtn) {
      runBtn.addEventListener('click', handleRun);
    }

    // Return cleanup function
    return () => {
      // Remove event listeners
      if (validateBtn) {
        validateBtn.removeEventListener('click', handleValidate);
      }
      if (runBtn) {
        runBtn.removeEventListener('click', handleRun);
      }

      // Destroy app instance
      if (currentApp) {
        try {
          currentApp.destroy();
        } catch {
          // Ignore cleanup errors
        }
        currentApp = null;
      }
    };
  },
};
