import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX as compileMDXRemote } from 'next-mdx-remote/rsc';
import rehypeShiki from '@shikijs/rehype';
import remarkGfm from 'remark-gfm';
import { CodeBlock, Callout, PropsTable, CompareGrid } from '@/components/mdx';

const contentDirectory = path.join(process.cwd(), 'src/content');

export interface DocFrontmatter {
  title: string;
  description: string;
  order?: number;
}

export interface DocContent {
  frontmatter: DocFrontmatter;
  content: string;
  slug: string[];
}

export async function getDocBySlug(
  section: 'docs' | 'reference',
  slug: string[]
): Promise<DocContent | null> {
  const slugPath = slug.length === 0 ? 'index' : slug.join('/');
  const filePath = path.join(contentDirectory, section, `${slugPath}.mdx`);

  try {
    const source = await readFile(filePath, 'utf-8');
    const { content, data } = matter(source);

    return {
      frontmatter: data as DocFrontmatter,
      content,
      slug,
    };
  } catch {
    return null;
  }
}

export async function getAllDocSlugs(
  section: 'docs' | 'reference'
): Promise<string[][]> {
  const sectionPath = path.join(contentDirectory, section);

  try {
    const files = await readdir(sectionPath, { recursive: true });
    return files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const slug = file.replace(/\.mdx$/, '').replace(/\\/g, '/');
        if (slug === 'index') return [];
        return slug.split('/');
      });
  } catch {
    return [];
  }
}

const mdxComponents = {
  pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => {
    return (
      <div className="overflow-x-auto">
        <table {...props}>{children}</table>
      </div>
    );
  },
  Callout,
  PropsTable,
  CompareGrid,
};

export async function compileMDX(source: string) {
  const { content, frontmatter } = await compileMDXRemote<DocFrontmatter>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: {
                light: 'github-light',
                dark: 'github-dark',
              },
              defaultColor: 'light',
            },
          ],
        ],
      },
    },
  });

  return { content, frontmatter };
}
