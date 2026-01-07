import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { mdxToConstela } from '@constela/start';
import { mdxComponents } from '@/components/mdx-components';
import type { CompiledNode } from '@constela/compiler';

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

export async function compileDocToConstela(source: string): Promise<CompiledNode> {
  return mdxToConstela(source, { components: mdxComponents });
}
