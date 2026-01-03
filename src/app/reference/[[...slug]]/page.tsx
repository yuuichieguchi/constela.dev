import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDocBySlug, getAllDocSlugs, compileMDX } from '@/lib/mdx';
import { referenceNavigation, getPagination } from '@/lib/navigation';
import { DocsPagination } from '@/components/layout';

interface ReferencePageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs('reference');
  return slugs.map((slug) => ({ slug: slug.length === 0 ? undefined : slug }));
}

export async function generateMetadata({
  params,
}: ReferencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug('reference', slug ?? []);

  if (!doc) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default async function ReferencePage({ params }: ReferencePageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug('reference', slug ?? []);

  if (!doc) {
    notFound();
  }

  const { content } = await compileMDX(doc.content);
  const currentPath = slug ? '/reference/' + slug.join('/') : '/reference';
  const { prev, next } = getPagination(currentPath, referenceNavigation);

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
