import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock @constela/start mdxToConstela function
vi.mock('@constela/start', async (importOriginal) => {
  const original = await importOriginal<typeof import('@constela/start')>();
  return {
    ...original,
    mdxToConstela: vi.fn().mockResolvedValue({
      kind: 'element',
      tag: 'div',
      children: [],
    }),
  };
});
