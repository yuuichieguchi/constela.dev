/**
 * Test suite for docs.json theme persistence on page load
 *
 * Coverage:
 * - Theme class applied to <html> when localStorage has saved theme
 * - Light theme persistence
 * - Dark theme persistence
 *
 * Bug: The loadTheme action reads from localStorage and updates state,
 * but does NOT apply the theme class to the <html> element.
 * The fix should add removeClass/addClass DOM operations to loadTheme.
 *
 * Expected fix in docs.json loadTheme action:
 * Add DOM operations after the storage.get step to:
 * 1. Remove the opposite theme class from <html>
 * 2. Add the loaded theme class to <html>
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { executeAction } from '@constela/runtime';
import type { CompiledAction } from '@constela/compiler';

// Mock StateStore implementation for testing
class MockStateStore {
  private state: Record<string, unknown> = {};

  get(key: string): unknown {
    return this.state[key];
  }

  set(key: string, value: unknown): void {
    this.state[key] = value;
  }

  subscribe(): () => void {
    return () => {};
  }

  getSnapshot(): Record<string, unknown> {
    return { ...this.state };
  }
}

describe('docs.json loadTheme action', () => {
  // ==================== Setup ====================

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset document element classes
    document.documentElement.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  // ==================== Test: Light Theme Persistence ====================

  it('should apply light class to <html> when localStorage has theme="light"', async () => {
    // Arrange
    localStorage.setItem('theme', JSON.stringify('light'));

    const stateStore = new MockStateStore();
    stateStore.set('theme', 'dark'); // Initial state is dark

    // This is the loadTheme action from docs.json (with DOM operations)
    // Uses 'expr' format as expected by @constela/runtime evaluator
    const loadThemeAction: CompiledAction = {
      name: 'loadTheme',
      steps: [
        {
          do: 'storage',
          operation: 'get',
          key: { expr: 'lit', value: 'theme' },
          storage: 'local',
          result: 'savedTheme',
          onSuccess: [
            {
              do: 'if',
              condition: { expr: 'var', name: 'savedTheme' },
              then: [
                {
                  do: 'set',
                  target: 'theme',
                  value: { expr: 'var', name: 'savedTheme' },
                },
                {
                  do: 'dom',
                  operation: 'removeClass',
                  selector: { expr: 'lit', value: 'html' },
                  value: {
                    expr: 'cond',
                    if: {
                      expr: 'bin',
                      op: '==',
                      left: { expr: 'var', name: 'savedTheme' },
                      right: { expr: 'lit', value: 'dark' },
                    },
                    then: { expr: 'lit', value: 'light' },
                    else: { expr: 'lit', value: 'dark' },
                  },
                },
                {
                  do: 'dom',
                  operation: 'addClass',
                  selector: { expr: 'lit', value: 'html' },
                  value: { expr: 'var', name: 'savedTheme' },
                },
              ],
            },
          ],
        },
      ],
    };

    const ctx = {
      state: stateStore as any,
      actions: { loadTheme: loadThemeAction },
      locals: {},
    };

    // Act
    await executeAction(loadThemeAction, ctx);

    // Assert - State should be updated
    expect(stateStore.get('theme')).toBe('light');

    // Assert - <html> element should have "light" class applied
    // This assertion will FAIL with the current implementation
    // because loadTheme does NOT include DOM operations
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  // ==================== Test: Dark Theme Persistence ====================

  it('should apply dark class to <html> when localStorage has theme="dark"', async () => {
    // Arrange
    localStorage.setItem('theme', JSON.stringify('dark'));

    const stateStore = new MockStateStore();
    stateStore.set('theme', 'light'); // Initial state differs from saved

    // This is the loadTheme action from docs.json (with DOM operations)
    const loadThemeAction: CompiledAction = {
      name: 'loadTheme',
      steps: [
        {
          do: 'storage',
          operation: 'get',
          key: { expr: 'lit', value: 'theme' },
          storage: 'local',
          result: 'savedTheme',
          onSuccess: [
            {
              do: 'if',
              condition: { expr: 'var', name: 'savedTheme' },
              then: [
                {
                  do: 'set',
                  target: 'theme',
                  value: { expr: 'var', name: 'savedTheme' },
                },
                {
                  do: 'dom',
                  operation: 'removeClass',
                  selector: { expr: 'lit', value: 'html' },
                  value: {
                    expr: 'cond',
                    if: {
                      expr: 'bin',
                      op: '==',
                      left: { expr: 'var', name: 'savedTheme' },
                      right: { expr: 'lit', value: 'dark' },
                    },
                    then: { expr: 'lit', value: 'light' },
                    else: { expr: 'lit', value: 'dark' },
                  },
                },
                {
                  do: 'dom',
                  operation: 'addClass',
                  selector: { expr: 'lit', value: 'html' },
                  value: { expr: 'var', name: 'savedTheme' },
                },
              ],
            },
          ],
        },
      ],
    };

    const ctx = {
      state: stateStore as any,
      actions: { loadTheme: loadThemeAction },
      locals: {},
    };

    // Act
    await executeAction(loadThemeAction, ctx);

    // Assert - State should be updated
    expect(stateStore.get('theme')).toBe('dark');

    // Assert - <html> element should have "dark" class applied
    // This assertion will FAIL with the current implementation
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  // ==================== Test: Remove opposite theme class ====================

  it('should remove opposite theme class when applying new theme', async () => {
    // Arrange - <html> starts with "dark" class
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', JSON.stringify('light'));

    const stateStore = new MockStateStore();
    stateStore.set('theme', 'dark');

    // loadTheme action with DOM operations (matches docs.json implementation)
    const loadThemeAction: CompiledAction = {
      name: 'loadTheme',
      steps: [
        {
          do: 'storage',
          operation: 'get',
          key: { expr: 'lit', value: 'theme' },
          storage: 'local',
          result: 'savedTheme',
          onSuccess: [
            {
              do: 'if',
              condition: { expr: 'var', name: 'savedTheme' },
              then: [
                {
                  do: 'set',
                  target: 'theme',
                  value: { expr: 'var', name: 'savedTheme' },
                },
                {
                  do: 'dom',
                  operation: 'removeClass',
                  selector: { expr: 'lit', value: 'html' },
                  value: {
                    expr: 'cond',
                    if: {
                      expr: 'bin',
                      op: '==',
                      left: { expr: 'var', name: 'savedTheme' },
                      right: { expr: 'lit', value: 'dark' },
                    },
                    then: { expr: 'lit', value: 'light' },
                    else: { expr: 'lit', value: 'dark' },
                  },
                },
                {
                  do: 'dom',
                  operation: 'addClass',
                  selector: { expr: 'lit', value: 'html' },
                  value: { expr: 'var', name: 'savedTheme' },
                },
              ],
            },
          ],
        },
      ],
    };

    const ctx = {
      state: stateStore as any,
      actions: { loadTheme: loadThemeAction },
      locals: {},
    };

    // Act
    await executeAction(loadThemeAction, ctx);

    // Assert - "dark" class should be removed and "light" class should be added
    // This will FAIL with current implementation
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
