# ~/vfil

Vlad Filimon's blog: learning agentic AI in public, plus notes on leadership and the occasional detour into music. Live at **https://vfil.github.io**.

Built with Astro, TypeScript and plain CSS. Pages ship as static HTML; JavaScript is used where it earns its place (copy buttons, the Palette picker, quizzes) and only on the pages that need it.

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
snapshot: Part2_tools # optional: Git tag in the Series' Companion repo, see below
---
```

Then write the body in Markdown. Code blocks are highlighted and get a copy button. Prettier leaves fenced code in Posts (`.md` and `.mdx`) exactly as written, so code a reader types is never reformatted. `<details><summary>…</summary>…</details>` works for collapsible blocks (leave a blank line after `</summary>` to write Markdown inside). For a multiple-choice quiz, make the Post an `.mdx` file and use the Quiz component: `import Quiz from '../../components/Quiz.astro'`, then `<Quiz question="…" options={['…', '…']} correct={1} right="…" wrong="…" />` (`correct` is the index of the right option; text may contain `inline code`). The build fails if a quiz is malformed. Images go in `src/assets/` and are referenced relatively, e.g. `![Alt text](../../assets/diagram.svg)`.

To publish, set `draft: false` (or remove the line), commit and push to `main`.

The build fails, with a message saying what's wrong, if a Post has an unknown Category, a malformed Tag, or breaks a Series rule. That's deliberate: mistakes never reach readers.

## Write a Series

A Series is an ordered sequence of Posts. Create it once in `src/content/series/<slug>.md`:

```yaml
---
title: 'Building an agent from scratch'
description: 'One line shown in lists.'
status: ongoing # or: complete
repo: https://github.com/vfil/sigma-agent # optional: the Companion repo built alongside
planned: ['Memory', 'Evals'] # titles of Parts not written yet, in order
---
Introduction shown on the Series page.
```

Each Post in the Series sets `series: <slug>` and `part: <n>`.

Rules (the build enforces them):

- Parts are numbered 1, 2, 3… with no gaps and no duplicates.
- A Part can't be published while an earlier Part is still a Draft.
- Planned Parts come after the written ones. Readers see their titles, greyed out, but can't open them.

**Companion repo.** If you build the code in a public repo alongside the Series, set `repo` on the Series. Every Part then ends with a link to it. Give each Part a `snapshot`, the name of a Git tag in that repo (e.g. `Part2_tools`), and that link points to the code as it stood for that Part; a Part without one links to the repo's front page. The mentions at the top are written by hand, in your own words: the Series introduction says the repo exists, and each Part's Foreword links to its Snapshot (the tag name appears there as well as in the frontmatter). Push the tag before you publish the Part: the build does not check that it exists, so a typo is a 404 for readers.

**Starting a planned Part:** remove its title from `planned` and create the Post with the next `part` number and `draft: true`. Until you publish it, readers still see it as a Planned Part, so "part 2 of 4" stays stable while you write.

A Series appears on the site once it has at least one published Part. While it's `ongoing`, the home page shows it under "currently writing".

## Categories

The Categories and their descriptions live in `src/lib/categories.ts`. They form the site menu.

## Colours

**For readers.** The colours button (three dots, top right, next to the dark/light Mode toggle) opens a colour wheel with three dots 120° apart. Dragging any dot turns all three together, and dragging towards the centre makes the colours calmer. The slider tints the background. The choice works in both Modes, is saved in that browser, and "Reset to default" brings back the Default Palette. Text colours are adjusted automatically so they always keep at least 4.5:1 contrast. The picker's code downloads only when someone first opens it.

**Changing the Default Palette.** Every site colour is generated from three numbers in `src/lib/palette.ts`:

```ts
export const DEFAULT_PALETTE: Palette = { hue: 359, chroma: 0.211, tint: 10 };
```

1. Find the numbers you like with the picker; its readout shows `hue° · chroma · tint%`.
2. Put them in `DEFAULT_PALETTE`. The tests will now fail on purpose. They pin the exact colours so the palette never changes by accident.
3. Update the expected values in `src/lib/palette.test.ts` to the new output (`bun -e "import {paletteTokens, DEFAULT_PALETTE} from './src/lib/palette.ts'; console.log(paletteTokens(DEFAULT_PALETTE))"` prints it).

If you change the recipe itself (how the tokens are computed from the three numbers), also bump `RECIPE_VERSION`.

**Why readers' palettes are stored computed.** A reader's choice is saved as the three numbers plus all the token colours it produced, tagged with `RECIPE_VERSION`. That lets the tiny script in `<head>` apply it before the first paint without loading any colour maths. The downside is that stored colours go stale if the recipe changes. Bumping `RECIPE_VERSION` makes every browser discard its saved palette and fall back to the default, instead of showing colours from an old recipe.

## Deploy

Every push runs CI (format, typecheck, tests, build). Pushes to `main` also deploy to GitHub Pages via `.github/workflows/deploy.yml`.

One-time setup: GitHub repo → Settings → Pages → Source: **GitHub Actions**.

## How this repo is planned

- `specs/`: every feature starts as a step-by-step spec, implemented afterwards in a separate session. Once implemented, the spec is trimmed to product intent only (problem, solution, user stories, out of scope); the code is the source of truth for how it works.
- `GLOSSARY.md`: the words used for things on this blog (Post, Draft, Category, Tag, Series, Part…). Code and specs use the same words.
- `docs/adr/`: decisions that were hard to make and would be expensive to reverse.
