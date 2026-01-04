import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { getAllDocSlugs } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/playground',
    '/examples',
    '/examples/counter',
    '/examples/todo-list',
    '/examples/fetch-list',
    '/examples/router',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Get dynamic docs pages
  const docSlugs = await getAllDocSlugs('docs');
  const docEntries: MetadataRoute.Sitemap = docSlugs.map((slug) => ({
    url: `${siteConfig.url}/docs${slug.length > 0 ? '/' + slug.join('/') : ''}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Get dynamic reference pages
  const refSlugs = await getAllDocSlugs('reference');
  const refEntries: MetadataRoute.Sitemap = refSlugs.map((slug) => ({
    url: `${siteConfig.url}/reference${slug.length > 0 ? '/' + slug.join('/') : ''}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticEntries, ...docEntries, ...refEntries];
}
