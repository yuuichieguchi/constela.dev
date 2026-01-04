import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDocBySlug, getAllDocSlugs, compileMDX } from '@/lib/mdx';
import { docsNavigation, getPagination } from '@/lib/navigation';
import { DocsPagination } from '@/components/layout';

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs('docs');
  return slugs.map((slug) => ({ slug: slug.length === 0 ? undefined : slug }));
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug('docs', slug ?? []);

  if (!doc) {
    return {
      title: 'Not Found',
    };
  }

  const path = slug ? `/docs/${slug.join('/')}` : '/docs';

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    openGraph: {
      type: 'article',
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      url: path,
    },
    alternates: {
      canonical: path,
    },
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug('docs', slug ?? []);

  if (!doc) {
    notFound();
  }

  const { content } = await compileMDX(doc.content);
  const currentPath = slug ? `/docs/${slug.join('/')}` : '/docs';
  const { prev, next } = getPagination(currentPath, docsNavigation);

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {doc.frontmatter.title}
        </h1>
        {doc.frontmatter.description && (
          <p className="mt-2 text-lg text-muted-foreground">
            {doc.frontmatter.description}
          </p>
        )}
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {content}
      </div>
      <DocsPagination prev={prev} next={next} />
    </article>
  );
}
