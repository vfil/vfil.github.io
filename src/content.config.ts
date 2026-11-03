import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_SLUGS } from './lib/categories';
import { slugFromFilename } from './lib/model';

const TAG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => slugFromFilename(entry),
  }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_SLUGS),
      tags: z
        .array(
          z.string().regex(TAG, 'Tags are lowercase words joined by hyphens, e.g. "agent-loops"'),
        )
        .default([]),
      draft: z.boolean().default(false),
      series: reference('series').optional(),
      part: z.number().int().positive().optional(),
    })
    .refine((post) => (post.series === undefined) === (post.part === undefined), {
      message:
        'A Post in a Series needs both `series` and `part`; a Post outside one needs neither',
    }),
});

const series = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['ongoing', 'complete']),
    planned: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { posts, series };
