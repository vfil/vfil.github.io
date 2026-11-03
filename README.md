# ~/vfil

Vlad Filimon's blog: learning agentic AI in public, plus notes on leadership and the occasional detour into music. Live at **https://vfil.github.io**.

Built with Astro, TypeScript and plain CSS. Pages ship as static HTML with almost no JavaScript.

## Run it locally

Needs [Bun](https://bun.sh) and Node 24 (`.nvmrc`).

```sh
bun install
bun run dev        # http://localhost:4321 (Drafts are visible here, marked [draft])
bun run build      # production build into dist/ (Drafts are left out)
bun run preview    # serve the production build
bun run check      # TypeScript + content schema
bun run test       # content model tests (Vitest)
bun run format     # Prettier
```

## Write a Post

Create a Markdown (`.md`) or MDX (`.mdx`) file in `src/content/posts/`. Start the filename with the date so your editor sorts it; the date is not part of the URL:

```
src/content/posts/2026-11-24-tools.md   →   /posts/tools/
```

Frontmatter:

```yaml
---
title: 'Tools: giving the model hands'
description: 'One sentence. Used for search results and link previews.'
pubDate: 2026-11-24
updatedDate: 2026-12-01 # optional, shown as "updated …"
category: agentic-ai # exactly one of: agentic-ai, leadership, music
tags: [agents, tool-use] # optional; lowercase words joined by hyphens
draft: true # optional; Drafts show in `bun run dev` only
series: building-an-agent-from-scratch # optional, see below
part: 2 # required together with `series`
---
```

Then write the body in Markdown. Code blocks are highlighted and get a copy button. Images go in `src/assets/` and are referenced relatively, e.g. `![Alt text](../../assets/diagram.svg)`.

To publish, set `draft: false` (or remove the line), commit and push to `main`.

The build fails, with a message saying what's wrong, if a Post has an unknown Category, a malformed Tag, or breaks a Series rule. That's deliberate: mistakes never reach readers.

## Write a Series

A Series is an ordered sequence of Posts. Create it once in `src/content/series/<slug>.md`:

```yaml
---
title: 'Building an agent from scratch'
description: 'One line shown in lists.'
status: ongoing # or: complete
planned: ['Memory', 'Evals'] # titles of Parts not written yet, in order
---
Introduction shown on the Series page.
```

Each Post in the Series sets `series: <slug>` and `part: <n>`.

Rules (the build enforces them):

- Parts are numbered 1, 2, 3… with no gaps and no duplicates.
- A Part can't be published while an earlier Part is still a Draft.
- Planned Parts come after the written ones. Readers see their titles, greyed out, but can't open them.

**Starting a planned Part:** remove its title from `planned` and create the Post with the next `part` number and `draft: true`. Until you publish it, readers still see it as a Planned Part, so "part 2 of 4" stays stable while you write.

A Series appears on the site once it has at least one published Part. While it's `ongoing`, the home page shows it under "currently writing".

## Categories

The Categories and their descriptions live in `src/lib/categories.ts`. They form the site menu.

## Deploy

Every push runs CI (format, typecheck, tests, build). Pushes to `main` also deploy to GitHub Pages via `.github/workflows/deploy.yml`.

One-time setup: GitHub repo → Settings → Pages → Source: **GitHub Actions**.

## How this repo is planned

- `specs/`: every feature starts as a step-by-step product and tech spec, implemented afterwards in a separate session.
- `GLOSSARY.md`: the words used for things on this blog (Post, Draft, Category, Tag, Series, Part…). Code and specs use the same words.
- `docs/adr/`: decisions that were hard to make and would be expensive to reverse.
