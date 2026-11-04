/**
 * Adapter between Astro content collections and the pure content model.
 * Pages ask this module for the Site; it validates everything once per build.
 */
import { getCollection, getEntry, render } from 'astro:content';
import { buildSite, type PostRecord, type SeriesRecord, type Site } from './model';

let site: Promise<Site> | undefined;

export function getSite(): Promise<Site> {
  site ??= load();
  return site;
}

async function load(): Promise<Site> {
  const [postEntries, seriesEntries] = await Promise.all([
    getCollection('posts'),
    getCollection('series'),
  ]);

  const posts: PostRecord[] = postEntries.map(({ id, data, body }) => ({
    slug: id,
    title: data.title,
    description: data.description,
    pubDate: data.pubDate,
    updatedDate: data.updatedDate,
    category: data.category,
    tags: data.tags,
    draft: data.draft,
    series: data.series?.id,
    part: data.part,
    snapshot: data.snapshot,
    body: body ?? '',
  }));

  const series: SeriesRecord[] = seriesEntries.map(({ id, data }) => ({
    slug: id,
    title: data.title,
    description: data.description,
    status: data.status,
    planned: data.planned,
    repo: data.repo,
  }));

  return buildSite(posts, series, import.meta.env.DEV ? 'dev' : 'prod');
}

/** Rendered body of a Post. */
export async function renderPost(slug: string) {
  const entry = await getEntry('posts', slug);
  if (!entry) throw new Error(`No Post "${slug}"`);
  return render(entry);
}

/** Rendered introduction of a Series. */
export async function renderSeries(slug: string) {
  const entry = await getEntry('series', slug);
  if (!entry) throw new Error(`No Series "${slug}"`);
  return render(entry);
}
