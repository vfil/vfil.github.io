/** The fixed set of Categories. Every Post belongs to exactly one; they form the site menu. */
export const CATEGORIES = [
  {
    slug: 'agentic-ai',
    label: 'Agentic AI',
    description: 'Learning to build with LLM agents: tools, evals, patterns, and what breaks.',
  },
  {
    slug: 'leadership',
    label: 'Leadership',
    description: 'Notes on leading engineers and teams.',
  },
  {
    slug: 'music',
    label: 'Music',
    description: 'Occasional notes on music.',
  },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategorySlug = Category['slug'];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];

export function getCategory(slug: CategorySlug): Category {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown Category "${slug}"`);
  return category;
}
