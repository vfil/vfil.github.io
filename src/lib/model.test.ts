import { describe, expect, test } from 'vitest';
import {
  buildSite,
  checkQuiz,
  companionRepo,
  formatDate,
  inlineCodeHtml,
  readingTime,
  slugFromFilename,
  splitInlineCode,
  type QuizSpec,
  type PostRecord,
  type SeriesRecord,
} from './model';

const words = (n: number) => Array.from({ length: n }, () => 'word').join(' ');

function post(fields: Partial<PostRecord> & { slug: string }): PostRecord {
  return {
    title: fields.slug,
    description: `About ${fields.slug}`,
    pubDate: new Date('2026-11-01'),
    category: 'agentic-ai',
    tags: [],
    draft: false,
    body: '',
    ...fields,
  };
}

function series(fields: Partial<SeriesRecord> & { slug: string }): SeriesRecord {
  return {
    title: fields.slug,
    description: `About ${fields.slug}`,
    status: 'ongoing',
    planned: [],
    ...fields,
  };
}

const slugs = (posts: Array<{ slug: string }>) => posts.map((p) => p.slug);

describe('slugFromFilename', () => {
  test('strips a YYYY-MM-DD- date prefix and the extension', () => {
    expect(slugFromFilename('2026-11-03-hello-world.md')).toBe('hello-world');
  });

  test('strips a YYYY-MM- month prefix', () => {
    expect(slugFromFilename('2026-11-the-loop.mdx')).toBe('the-loop');
  });

  test('keeps a filename without a date prefix', () => {
    expect(slugFromFilename('one-on-ones.md')).toBe('one-on-ones');
  });

  test('ignores folders in the path', () => {
    expect(slugFromFilename('agents/2026-11-10-the-loop.md')).toBe('the-loop');
  });

  test('does not strip a number that is part of the title', () => {
    expect(slugFromFilename('2026-predictions.md')).toBe('2026-predictions');
  });
});

describe('readingTime', () => {
  test('is 1 minute for 220 words', () => {
    expect(readingTime(words(220))).toBe(1);
  });

  test('rounds up a partial minute', () => {
    expect(readingTime(words(221))).toBe(2);
  });

  test('is at least 1 minute for an empty body', () => {
    expect(readingTime('')).toBe(1);
  });

  test('does not count words inside code fences', () => {
    const body = `${words(220)}\n\n\`\`\`ts\n${words(500)}\n\`\`\`\n`;
    expect(readingTime(body)).toBe(1);
  });
});

describe('formatDate', () => {
  test('formats a frontmatter date as YYYY-MM-DD', () => {
    expect(formatDate(new Date('2026-11-03'))).toBe('2026-11-03');
  });

  test('uses the UTC calendar day, whatever the local time zone', () => {
    expect(formatDate(new Date('2026-11-03T23:30:00-05:00'))).toBe('2026-11-04');
  });
});

describe('buildSite: Drafts', () => {
  const posts = [post({ slug: 'published' }), post({ slug: 'wip', draft: true })];

  test('production shows only published Posts', () => {
    expect(slugs(buildSite(posts, [], 'prod').posts)).toEqual(['published']);
  });

  test('dev also shows Drafts', () => {
    expect(slugs(buildSite(posts, [], 'dev').posts).sort()).toEqual(['published', 'wip']);
  });
});

describe('buildSite: ordering and identity', () => {
  test('lists Posts newest first', () => {
    const site = buildSite(
      [
        post({ slug: 'old', pubDate: new Date('2026-01-01') }),
        post({ slug: 'new', pubDate: new Date('2026-11-01') }),
        post({ slug: 'mid', pubDate: new Date('2026-06-01') }),
      ],
      [],
      'prod',
    );
    expect(slugs(site.posts)).toEqual(['new', 'mid', 'old']);
  });

  test('breaks a same-day tie by title', () => {
    const day = new Date('2026-11-01');
    const site = buildSite(
      [
        post({ slug: 'b', title: 'Beta', pubDate: day }),
        post({ slug: 'a', title: 'Alpha', pubDate: day }),
      ],
      [],
      'prod',
    );
    expect(slugs(site.posts)).toEqual(['a', 'b']);
  });

  test('rejects two Posts with the same slug', () => {
    expect(() => buildSite([post({ slug: 'dup' }), post({ slug: 'dup' })], [], 'prod')).toThrow(
      /dup/,
    );
  });
});

describe('buildSite: Categories and Tags', () => {
  const posts = [
    post({ slug: 'agents', category: 'agentic-ai', tags: ['mcp', 'evals'] }),
    post({ slug: 'one-on-ones', category: 'leadership', tags: ['management'] }),
    post({ slug: 'team-agents', category: 'leadership', tags: ['mcp'] }),
    post({ slug: 'secret', category: 'music', tags: ['synths'], draft: true }),
  ];
  const site = buildSite(posts, [], 'prod');

  test('lists the Posts in a Category', () => {
    expect(slugs(site.postsInCategory('leadership')).sort()).toEqual([
      'one-on-ones',
      'team-agents',
    ]);
  });

  test('a Category with only Drafts is empty in production', () => {
    expect(site.postsInCategory('music')).toEqual([]);
  });

  test('lists every Tag on a visible Post, alphabetically', () => {
    expect(site.tags).toEqual(['evals', 'management', 'mcp']);
  });

  test('lists the Posts with a Tag across Categories', () => {
    expect(slugs(site.postsWithTag('mcp')).sort()).toEqual(['agents', 'team-agents']);
  });
});

describe('buildSite: Series', () => {
  const agent = series({ slug: 'agent', planned: ['Memory', 'Evals'] });

  test('lists written Parts in order, then Planned Parts', () => {
    const site = buildSite(
      [
        post({ slug: 'tools', title: 'Tools', series: 'agent', part: 2 }),
        post({ slug: 'loop', title: 'The loop', series: 'agent', part: 1 }),
      ],
      [agent],
      'prod',
    );
    const parts = site.seriesBySlug('agent')?.parts ?? [];
    expect(parts.map((p) => [p.number, p.title, p.post?.slug])).toEqual([
      [1, 'The loop', 'loop'],
      [2, 'Tools', 'tools'],
      [3, 'Memory', undefined],
      [4, 'Evals', undefined],
    ]);
  });

  test('counts written and Planned Parts in the total', () => {
    const site = buildSite([post({ slug: 'loop', series: 'agent', part: 1 })], [agent], 'prod');
    expect(site.seriesBySlug('agent')).toMatchObject({ total: 3, readable: 1 });
  });
});

describe('buildSite: Series rules fail the build', () => {
  const agent = series({ slug: 'agent' });
  const build = (posts: PostRecord[]) => () => buildSite(posts, [agent], 'prod');

  test('a gap in Part numbers', () => {
    expect(
      build([
        post({ slug: 'one', series: 'agent', part: 1 }),
        post({ slug: 'three', series: 'agent', part: 3 }),
      ]),
    ).toThrow(/agent.*part 2/i);
  });

  test('two Posts with the same Part number', () => {
    expect(
      build([
        post({ slug: 'one', series: 'agent', part: 1 }),
        post({ slug: 'also-one', series: 'agent', part: 1 }),
      ]),
    ).toThrow(/agent.*part 1/i);
  });

  test('a published Part after a Draft Part', () => {
    expect(
      build([
        post({ slug: 'one', series: 'agent', part: 1, draft: true }),
        post({ slug: 'two', series: 'agent', part: 2 }),
      ]),
    ).toThrow(/two.*draft/i);
  });

  test('a Part number without a Series', () => {
    expect(build([post({ slug: 'lost', part: 1 })])).toThrow(/lost/);
  });

  test('a Series without a Part number', () => {
    expect(build([post({ slug: 'unnumbered', series: 'agent' })])).toThrow(/unnumbered/);
  });

  test('a Series that does not exist', () => {
    expect(build([post({ slug: 'orphan', series: 'nope', part: 1 })])).toThrow(/nope/);
  });
});

describe('buildSite: Series visibility', () => {
  const agent = series({ slug: 'agent', planned: ['Evals'] });

  test('in production a Draft Part shows as a Planned Part', () => {
    const site = buildSite(
      [
        post({ slug: 'loop', title: 'The loop', series: 'agent', part: 1 }),
        post({ slug: 'tools', title: 'Tools', series: 'agent', part: 2, draft: true }),
      ],
      [agent],
      'prod',
    );
    const view = site.seriesBySlug('agent');
    expect(view?.parts.map((p) => [p.number, p.title, p.post?.slug])).toEqual([
      [1, 'The loop', 'loop'],
      [2, 'Tools', undefined],
      [3, 'Evals', undefined],
    ]);
    expect(view).toMatchObject({ total: 3, readable: 1 });
  });

  test('in production a Series with no published Part is hidden', () => {
    const site = buildSite(
      [post({ slug: 'loop', series: 'agent', part: 1, draft: true })],
      [agent],
      'prod',
    );
    expect(site.series).toEqual([]);
    expect(site.seriesBySlug('agent')).toBeUndefined();
  });

  test('in dev the same Series is shown with its Draft Part readable', () => {
    const site = buildSite(
      [post({ slug: 'loop', series: 'agent', part: 1, draft: true })],
      [agent],
      'dev',
    );
    expect(slugs(site.series)).toEqual(['agent']);
    expect(site.seriesBySlug('agent')?.parts[0]?.post?.slug).toBe('loop');
  });
});

describe('buildSite: moving through a Series', () => {
  const agent = series({ slug: 'agent', planned: ['Evals'] });
  const site = buildSite(
    [
      post({ slug: 'loop', series: 'agent', part: 1, pubDate: new Date('2026-11-10') }),
      post({ slug: 'tools', series: 'agent', part: 2, pubDate: new Date('2026-11-24') }),
      post({ slug: 'memory', series: 'agent', part: 3, draft: true }),
      post({ slug: 'unrelated', pubDate: new Date('2026-11-17') }),
    ],
    [agent],
    'prod',
  );
  const find = (slug: string) => site.posts.find((p) => p.slug === slug)!;

  test('the first Part links only forward, to the next Part', () => {
    const place = site.placeInSeries(find('loop'));
    expect([place?.number, place?.total, place?.previous?.slug, place?.next?.slug]).toEqual([
      1,
      4,
      undefined,
      'tools',
    ]);
  });

  test('the last readable Part links back, not forward to a Planned Part', () => {
    const place = site.placeInSeries(find('tools'));
    expect([place?.previous?.slug, place?.next]).toEqual(['loop', undefined]);
  });

  test('a Post outside any Series has no place in one', () => {
    expect(site.placeInSeries(find('unrelated'))).toBeUndefined();
  });
});

describe('checkQuiz', () => {
  const quiz = (fields: Partial<QuizSpec> = {}): QuizSpec => ({
    question: 'Which one?',
    options: ['a', 'b', 'c'],
    correct: 1,
    right: 'Right.',
    wrong: 'Not quite.',
    ...fields,
  });

  test('accepts a well-formed quiz', () => {
    expect(() => checkQuiz(quiz())).not.toThrow();
  });

  test('rejects a quiz with fewer than two options', () => {
    expect(() => checkQuiz(quiz({ options: ['a'], correct: 0 }))).toThrow(/at least two options/);
  });

  test.each([-1, 3, 1.5, Number.NaN])('rejects correct = %s', (correct) => {
    expect(() => checkQuiz(quiz({ correct }))).toThrow(/correct/);
  });

  test.each(['question', 'right', 'wrong'] as const)('rejects an empty %s', (field) => {
    expect(() => checkQuiz(quiz({ [field]: '  ' }))).toThrow(new RegExp(field));
  });

  test('rejects an empty option', () => {
    expect(() => checkQuiz(quiz({ options: ['a', '', 'c'] }))).toThrow(/option/);
  });

  test('names the question in the error, so the author can find it', () => {
    expect(() => checkQuiz(quiz({ correct: 9 }))).toThrow(/Which one\?/);
  });
});

describe('splitInlineCode', () => {
  test('plain text is one piece', () => {
    expect(splitInlineCode('no code here')).toEqual([{ text: 'no code here', code: false }]);
  });

  test('backticks mark code pieces', () => {
    expect(splitInlineCode('call `edit_file` now')).toEqual([
      { text: 'call ', code: false },
      { text: 'edit_file', code: true },
      { text: ' now', code: false },
    ]);
  });

  test('keeps a leading or trailing code piece without empty neighbours', () => {
    expect(splitInlineCode('`a` and `b`')).toEqual([
      { text: 'a', code: true },
      { text: ' and ', code: false },
      { text: 'b', code: true },
    ]);
  });

  test('rejects an unclosed backtick', () => {
    expect(() => splitInlineCode('oops `unclosed')).toThrow(/backtick/);
  });
});

describe('inlineCodeHtml', () => {
  test('wraps code pieces in <code>', () => {
    expect(inlineCodeHtml('a `b` c')).toBe('a <code>b</code> c');
  });

  test('escapes HTML in text and in code', () => {
    expect(inlineCodeHtml('x < y & `a<b>`')).toBe('x &lt; y &amp; <code>a&lt;b&gt;</code>');
  });
});

describe('companionRepo', () => {
  const repo = 'https://github.com/vfil/sigma-agent';

  test('names the repo and links to its front page', () => {
    expect(companionRepo(repo)).toEqual({ name: 'vfil/sigma-agent', url: repo });
  });

  test('links a Snapshot to its tag', () => {
    expect(companionRepo(repo, 'Part1_the_loop').snapshot).toEqual({
      name: 'Part1_the_loop',
      url: `${repo}/tree/Part1_the_loop`,
    });
  });

  test('ignores a trailing slash and .git on the repo URL', () => {
    expect(companionRepo(`${repo}.git`).url).toBe(repo);
    expect(companionRepo(`${repo}/`).name).toBe('vfil/sigma-agent');
  });

  test('encodes a Snapshot name but keeps its slashes', () => {
    expect(companionRepo(repo, 'part 1/the loop#').snapshot?.url).toBe(
      `${repo}/tree/part%201/the%20loop%23`,
    );
  });
});
