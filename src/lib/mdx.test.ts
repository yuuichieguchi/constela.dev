/**
 * Test module for compileMDX - Shiki dual theme support.
 *
 * Coverage:
 * - Dual theme CSS variable generation (--shiki-dark)
 * - Light theme as default
 *
 * TDD Red Phase: These tests are expected to FAIL with current implementation
 * because the current config uses single theme: 'github-dark'
 */

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { compileMDX } from './mdx';

describe('compileMDX - Shiki dual theme', () => {
  // ==================== Test Data ====================

  const mdxWithCodeBlock = `---
title: Test Document
description: Test description for dual theme
---

# Code Example

\`\`\`typescript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`
`;

  // ==================== Dual Theme Support ====================

  it('should generate --shiki-dark CSS variable for dark theme support', async () => {
    /**
     * Given: MDX source with a code block
     * When: compileMDX is called
     * Then: Output HTML should contain --shiki-dark CSS variable
     *
     * This test verifies that Shiki is configured with dual themes,
     * which generates CSS variables for theme switching.
     */

    // Arrange
    const source = mdxWithCodeBlock;

    // Act
    const { content } = await compileMDX(source);
    const html = renderToString(content);

    // Assert
    expect(html).toContain('--shiki-dark');
  });

  it('should apply light theme colors as default inline styles', async () => {
    /**
     * Given: MDX source with a code block
     * When: compileMDX is called
     * Then: Output should have light theme colors in the default style attribute
     *
     * When using dual themes with Shiki, the light theme is applied
     * as the default (in the color property), while dark theme values
     * are stored in --shiki-dark CSS variables.
     */

    // Arrange
    const source = mdxWithCodeBlock;

    // Act
    const { content } = await compileMDX(source);
    const html = renderToString(content);

    // Assert - Check for presence of both themes configuration
    // The output should have style attributes with both color and --shiki-dark
    expect(html).toMatch(/style="[^"]*color:[^"]*--shiki-dark/);
  });

  // ==================== Edge Cases ====================

  it('should handle code blocks without language specification', async () => {
    /**
     * Given: MDX with a code block without language
     * When: compileMDX is called
     * Then: Should render as code block but without syntax highlighting CSS variables
     *
     * Note: Shiki does not apply syntax highlighting to code blocks without
     * a language specification, so --shiki-dark CSS variables are not generated.
     * This is expected Shiki behavior.
     */

    // Arrange
    const sourceWithoutLang = `---
title: Test
description: Test
---

\`\`\`
plain text code
\`\`\`
`;

    // Act
    const { content } = await compileMDX(sourceWithoutLang);
    const html = renderToString(content);

    // Assert - Code block is rendered but without syntax highlighting variables
    expect(html).toContain('plain text code');
    expect(html).not.toContain('--shiki-dark');
  });

  it('should apply dual theme to multiple code blocks', async () => {
    /**
     * Given: MDX with multiple code blocks
     * When: compileMDX is called
     * Then: All code blocks should have dual theme styling
     */

    // Arrange
    const sourceWithMultipleBlocks = `---
title: Multiple Blocks
description: Test multiple code blocks
---

\`\`\`javascript
const a = 1;
\`\`\`

\`\`\`python
x = 42
\`\`\`
`;

    // Act
    const { content } = await compileMDX(sourceWithMultipleBlocks);
    const html = renderToString(content);

    // Assert - Should have multiple occurrences of --shiki-dark
    const matches = html.match(/--shiki-dark/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThan(1);
  });
});
