import type { MDXComponents } from 'mdx/types';
import { CodeBlock, Callout, PropsTable } from '@/components/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: ({ children, ...props }) => {
      return <CodeBlock {...props}>{children}</CodeBlock>;
    },
    Callout,
    PropsTable,
  };
}
