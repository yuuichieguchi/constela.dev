/**
 * Test module for compileDocToConstela
 *
 * Coverage:
 * - Function export verification
 * - Empty MDX source handling
 * - Basic MDX compilation to CompiledNode
 */

import { describe, it, expect } from 'vitest';
import { compileDocToConstela } from './mdx';

describe('compileDocToConstela', () => {
  it('should be exported as a function', () => {
    expect(typeof compileDocToConstela).toBe('function');
  });

  it('should not throw error for empty MDX source', async () => {
    const source = '';

    await expect(compileDocToConstela(source)).resolves.not.toThrow();
  });

  it('should return a CompiledNode for simple MDX source', async () => {
    const source = '# Hello World';

    const result = await compileDocToConstela(source);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('kind');
  });

  it('should return a CompiledNode with valid kind property', async () => {
    const source = '# Hello World\n\nThis is a paragraph.';

    const result = await compileDocToConstela(source);

    const validKinds = ['element', 'text', 'if', 'each', 'markdown', 'code'];
    expect(validKinds).toContain(result.kind);
  });
});
