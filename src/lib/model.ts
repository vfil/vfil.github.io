/**
 * The content model: pure functions over plain Post and Series records.
 * No `astro:*` imports, so it can be unit-tested; `content.ts` adapts Astro collections to it.
 */
import type { CategorySlug } from './categories';

export type BuildMode = 'dev' | 'prod';

/** A Post as authored: frontmatter plus raw Markdown body. */
export interface PostRecord {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date | undefined;
  category: CategorySlug;
  tags: string[];
  draft: boolean;
  series?: string | undefined;
  part?: number | undefined;
  body: string;
}

/** A Series as authored. */
export interface SeriesRecord {
  slug: string;
  title: string;
  description: string;
  status: 'ongoing' | 'complete';
  /** Titles of Planned Parts that have no Post yet, in order. */
  planned: string[];
}

/** A Post as shown on the site. */
export interface Post extends PostRecord {
  readingMinutes: number;
}

/** One Part of a Series. `post` is absent for a Planned Part, which readers cannot open. */
export interface Part {
  number: number;
  title: string;
  post?: Post | undefined;
}

/** A Series as shown on the site. */
export interface SeriesView extends SeriesRecord {
  /** Every Part in order: written Parts first, then Planned Parts. */
  parts: Part[];
  /** Number of Parts, including Planned Parts. */
  total: number;
  /** Number of Parts readers can open. */
  readable: number;
}

/** Where a Post sits in its Series. */
export interface PlaceInSeries {
  series: SeriesView;
  /** This Post's Part number. */
  number: number;
  total: number;
  /** The previous Part, if readers can open it. */
  previous?: Post | undefined;
  /** The next Part, if readers can open it (never a Planned Part). */
  next?: Post | undefined;
}

export interface Site {
  /** Visible Posts, newest first. */
  posts: Post[];
  /** Visible Posts in a Category, newest first. */
  postsInCategory(category: CategorySlug): Post[];
  /** Every Tag used by a visible Post, alphabetically. */
  tags: string[];
  /** Visible Posts with a Tag, newest first. */
  postsWithTag(tag: string): Post[];
  /** Series with at least one readable Part, most recently updated first. */
  series: SeriesView[];
  /** A visible Series by slug. */
  seriesBySlug(slug: string): SeriesView | undefined;
  /** Where a visible Post sits in its Series, if it is in one. */
  placeInSeries(post: Post): PlaceInSeries | undefined;
}

/**
 * Validates all content and builds the queryable site.
 * Production hides Drafts; dev shows them.
 */
export function buildSite(
  postRecords: PostRecord[],
  seriesRecords: SeriesRecord[],
  mode: BuildMode,
): Site {
  assertUniqueSlugs(postRecords);
  assertValidSeries(postRecords, seriesRecords);
  const posts = postRecords
    .filter((p) => mode === 'dev' || !p.draft)
    .map((p) => ({ ...p, readingMinutes: readingTime(p.body) }))
    .sort(newestFirst);
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const seriesViews = seriesRecords
    .map((s) => viewSeries(s, postRecords, posts))
    .filter((s) => s.readable > 0)
    .sort((a, b) => latestPart(b) - latestPart(a));
  return {
    posts,
    postsInCategory: (category) => posts.filter((p) => p.category === category),
    tags,
    postsWithTag: (tag) => posts.filter((p) => p.tags.includes(tag)),
    series: seriesViews,
    seriesBySlug: (slug) => seriesViews.find((s) => s.slug === slug),
    placeInSeries: (post) => {
      const view = seriesViews.find((s) => s.slug === post.series);
      if (!view || post.part === undefined) return undefined;
      const at = (n: number) => view.parts.find((p) => p.number === n)?.post;
      return {
        series: view,
        number: post.part,
        total: view.total,
        previous: at(post.part - 1),
        next: at(post.part + 1),
      };
    },
  };
}

/**
 * Written Parts come from every Post in the Series (Drafts included); a Part whose Post is not
 * visible in this mode is shown like a Planned Part (title only, no link).
 */
function viewSeries(record: SeriesRecord, all: PostRecord[], visible: Post[]): SeriesView {
  const written: Part[] = all
    .filter((p) => p.series === record.slug)
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
    .map((p) => ({
      number: p.part ?? 0,
      title: p.title,
      post: visible.find((v) => v.slug === p.slug),
    }));
  const planned: Part[] = record.planned.map((title, i) => ({
    number: written.length + i + 1,
    title,
  }));
  const parts = [...written, ...planned];
  return {
    ...record,
    parts,
    total: parts.length,
    readable: parts.filter((p) => p.post).length,
  };
}

function newestFirst(a: PostRecord, b: PostRecord): number {
  return b.pubDate.getTime() - a.pubDate.getTime() || a.title.localeCompare(b.title);
}

function latestPart(series: SeriesView): number {
  return Math.max(...series.parts.map((p) => p.post?.pubDate.getTime() ?? 0));
}

/** Checked over all Posts, Drafts included, in every mode. */
function assertValidSeries(posts: PostRecord[], seriesRecords: SeriesRecord[]): void {
  const known = new Set(seriesRecords.map((s) => s.slug));
  for (const p of posts) {
    if (p.part !== undefined && p.series === undefined) {
      throw new Error(`Post "${p.slug}" has a part number but no series.`);
    }
    if (p.series !== undefined && p.part === undefined) {
      throw new Error(`Post "${p.slug}" is in series "${p.series}" but has no part number.`);
    }
    if (p.series !== undefined && !known.has(p.series)) {
      throw new Error(`Post "${p.slug}" names series "${p.series}", which does not exist.`);
    }
  }
  for (const s of seriesRecords) {
    const parts = posts
      .filter((p) => p.series === s.slug)
      .sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
    parts.forEach((p, i) => {
      const expected = i + 1;
      if (p.part === expected - 1) {
        throw new Error(`Series "${s.slug}" has two posts for part ${p.part}.`);
      }
      if (p.part !== expected) {
        throw new Error(`Series "${s.slug}" is missing part ${expected} (found part ${p.part}).`);
      }
    });
    const firstDraft = parts.findIndex((p) => p.draft);
    const publishedAfterDraft =
      firstDraft === -1 ? undefined : parts.slice(firstDraft).find((p) => !p.draft);
    if (publishedAfterDraft) {
      throw new Error(
        `Post "${publishedAfterDraft.slug}" is published but an earlier part of series "${s.slug}" is still a draft.`,
      );
    }
  }
}

function assertUniqueSlugs(posts: PostRecord[]): void {
  const seen = new Set<string>();
  for (const p of posts) {
    if (seen.has(p.slug)) {
      throw new Error(`Two Posts have the slug "${p.slug}". Rename one of the files.`);
    }
    seen.add(p.slug);
  }
}

/** `posts/2026-11-03-hello-world.md` → `hello-world`; also strips `YYYY-MM-` prefixes. */
export function slugFromFilename(path: string): string {
  const base = path.split('/').pop() ?? path;
  return base.replace(/^\d{4}-\d{2}-(\d{2}-)?/, '').replace(/\.mdx?$/, '');
}

const WORDS_PER_MINUTE = 220;

/** Minutes to read a Markdown body, rounded up; fenced code blocks are not counted. */
export function readingTime(body: string): number {
  const prose = body.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** `YYYY-MM-DD` in UTC, so a Post's date never shifts with the reader's time zone. */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
