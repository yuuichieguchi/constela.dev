/**
 * Theme EscapeHandler
 *
 * Manages theme toggle functionality (dark/light mode).
 * - Reads initial theme from localStorage
 * - Defaults to 'dark' if no valid value stored
 * - Toggles theme on element click
 * - Persists theme to localStorage
 * - Applies theme class to document.documentElement
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

type Theme = 'dark' | 'light';

const VALID_THEMES: readonly Theme[] = ['dark', 'light'] as const;
const DEFAULT_THEME: Theme = 'dark';
const STORAGE_KEY = 'theme';

/**
 * Validates and returns a valid theme value.
 * Returns default theme if value is invalid.
 */
function getValidTheme(value: string | null): Theme {
  if (value !== null && VALID_THEMES.includes(value as Theme)) {
    return value as Theme;
  }
  return DEFAULT_THEME;
}

/**
 * Applies theme class to document.documentElement.
 * Removes the opposite theme class to ensure only one is active.
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

/**
 * Returns the opposite theme.
 */
function toggleThemeValue(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

export const themeHandler: EscapeHandler = {
  name: 'theme',
  mount: (element: HTMLElement, _ctx: EscapeContext): (() => void) => {
    // Read initial theme from localStorage
    const storedValue = localStorage.getItem(STORAGE_KEY);
    let currentTheme = getValidTheme(storedValue);

    // Apply initial theme
    applyTheme(currentTheme);

    // Click handler for toggling theme
    const handleClick = (): void => {
      currentTheme = toggleThemeValue(currentTheme);
      applyTheme(currentTheme);
      localStorage.setItem(STORAGE_KEY, currentTheme);
    };

    // Attach click listener
    element.addEventListener('click', handleClick);

    // Return cleanup function
    return () => {
      element.removeEventListener('click', handleClick);
    };
  },
};
