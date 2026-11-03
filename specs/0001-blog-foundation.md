# 0001 · Blog foundation

Status: ready for implementation
Date: 2026-11-03

**Read first:** [GLOSSARY.md](../GLOSSARY.md) (use its terms exactly: Post, Draft, Category, Tag, Series, Part, Planned Part, Ongoing/Complete), [ADR 0001](../docs/adr/0001-astro-over-react-frameworks.md), and the visual target [mockups/home.html](./mockups/home.html) (open it in a browser).

---

## Problem statement

Vlad wants a personal blog on GitHub Pages (`vfil.github.io`) where he can publish, now and then, what he is learning about agentic AI and leadership, and occasionally about music. It should look minimal and a bit geeky, be cheap to maintain for years, and let him write Posts as Markdown files in his editor. His first piece of writing is a multi-part Series, so Series must work from day one.

## Solution

A static Astro site deployed by GitHub Actions on every push to `main`. Posts and Series are Markdown/MDX files in the repo, validated at build time. The design is an "engineer's notebook": IBM Plex Mono for chrome (header, menu, dates, Tags, code), IBM Plex Sans for reading text, amber accent, dark by default with a light toggle. Pages ship no JavaScript except two tiny inline scripts (theme toggle, code-copy button).

## User stories

Reader:

1. As a reader, I want a home page that lists the latest Posts one per line (date, Category, title), so I can scan what's new at a glance.
2. As a reader, I want a menu with the three Categories plus Series and About, so I can jump to the subject I care about.
3. As a reader, I want each Category page to start with a one-line description, so I know what the Category covers.
4. As a reader, I want to see the date, Category, Tags and reading time on every Post, so I can judge it before reading.
5. As a reader, I want readable long-form text and highlighted code with a copy button, so technical Posts are comfortable to read and reuse.
6. As a reader, I want to click a Tag and see every Post with that Tag, across Categories.
7. As a reader of a Series, I want to see "part 2 of 4" and the full list of Parts on each Part, so I know where I am.
8. As a reader of a Series, I want previous/next links that follow the Series order, so I can read it straight through.
9. As a reader, I want Planned Parts shown by title (not clickable), so I know what's coming and have a reason to come back.
10. As a reader, I want a `/series/` page and a page per Series with its introduction and Parts.
11. As a reader, I want the home page to tell me which Series are Ongoing.
12. As a reader, I want dark and light themes that follow my OS setting, with a toggle that remembers my choice and never flashes the wrong theme on load.
13. As a reader on a phone, I want the menu to wrap rather than hide behind a hamburger, and no horizontal scrolling.
14. As a reader, I want an About page with links to Vlad's GitHub and LinkedIn.
15. As a reader who follows a broken link, I want a 404 page in the same style with a way back home.

Author (Vlad): 16. As the author, I want to write a Post as one Markdown/MDX file with a small frontmatter block, so publishing is "write, commit, push". 17. As the author, I want the build to fail on a missing or misspelled Category, malformed Tag, unknown Series or bad Part numbering, so mistakes never reach readers. 18. As the author, I want `draft: true` Posts to render locally (`bun run dev`) but never in the production build. 19. As the author, I want Post URLs (`/posts/<slug>/`) that don't contain the Category, so recategorising never breaks shared links. 20. As the author, I want to name files with a date prefix (`2026-11-10-the-loop.md`) for sorting in my editor, without the date showing in the URL. 21. As the author, I want a Series file where I set title, introduction, status and Planned Part titles in one place. 22. As the author, I want a README that explains how to write a Post, a Series and a Draft, so future-me doesn't have to rediscover it. 23. As the author, I want CI to typecheck, test and build every push, and deploy only from `main`.

## Implementation decisions

### Stack (settled, see ADR 0001)

- **Astro 7** (7.4.x at time of writing), TypeScript `strict`, `@astrojs/mdx`, `@astrojs/sitemap`. Verify current versions when scaffolding; do not pin to an older major.
- **No React yet.** `@astrojs/react` is added only when the first real interactive component is needed (not in this spec). Theme toggle and copy button are small `<script>` blocks.
- **Bun** is the package manager and script runner (`bun.lock` committed). The Astro CLI runs on **Node 24 LTS** (don't use `bunx --bun astro …`), because Astro documents rough edges on the Bun runtime.
- **Plain CSS** with custom properties. No Tailwind, no CSS-in-JS. One global stylesheet for tokens/base/prose plus scoped `<style>` in components. Target: under ~400 lines of CSS in total.
- **Fonts**: Astro's built-in Fonts API (top-level `fonts` config, `fontProviders.fontsource()`), self-hosted at build time. IBM Plex Mono 400/500/600; IBM Plex Sans 400/500/600 + 400 italic. CSS variables `--font-mono`, `--font-sans`, each with the fallback stacks from the mockup.
- **Prettier** + `prettier-plugin-astro`. No ESLint.
- **Vitest** for the pure content-model module only (see Testing).
- `astro.config`: `site: 'https://vfil.github.io'`, no `base`. Internal links always end in `/`.

### Design tokens

- **Default Palette**: a colour triad at hue **359°** (accent), **119°** (secondary) and **239°** (ground), chroma **0.211**, background tint **10%**. Copy the resulting token values from the first three `:root` blocks in `specs/mockups/home.html`:

  | token         | dark      | light     | used for                                     |
  | ------------- | --------- | --------- | -------------------------------------------- |
  | `--bg`        | `#101214` | `#f9fafb` | page background                              |
  | `--surface`   | `#171a1c` | `#eef0f2` | code blocks, Series box, "currently writing" |
  | `--line`      | `#2b2e31` | `#dcdee0` | rules, borders                               |
  | `--muted`     | `#95999c` | `#616466` | dates, meta, inactive menu                   |
  | `--fg`        | `#e3e5e6` | `#191b1c` | text                                         |
  | `--accent`    | `#ff9abc` | `#c91a6f` | brand `~`, hover, current page, cursor       |
  | `--accent-2`  | `#a6c000` | `#5c6c00` | `$` prompts, `[category]` labels             |
  | `--accent-fg` | `#101214` | `#f9fafb` | text on accent                               |

- The theme is dark-first: dark values on bare `:root`, light values under `@media (prefers-color-scheme: light) :root:not([data-theme="dark"])` and again under `:root[data-theme="light"]`.
- Other tokens: type steps `--step--1 … --step-2`, `--measure: 46rem`.
- Components use tokens only, never literal colours, because spec 0002 lets readers swap the whole Palette at runtime.
- The reader's dark/light choice is stored in `localStorage` under the key `mode`.
- Ignore the `data-palette="custom"` blocks, the palette button and the popover in the mockup. They belong to spec 0002. In this spec the header's right-hand tools are the Mode toggle only.

### Content model

- **Category** is a fixed list in one module: `{ slug, label, description }` for
  - `agentic-ai` / "Agentic AI" / "Learning to build with LLM agents: tools, evals, patterns, and what breaks."
  - `leadership` / "Leadership" / "Notes on leading engineers and teams."
  - `music` / "Music" / "Occasional notes on music."

  The Post schema's `category` is a Zod enum derived from this list, so the list is the single source of truth.

- **`posts` collection**: glob loader over `src/content/posts/**/*.{md,mdx}`. Frontmatter:

  | field         | type                   | rule                                                     |
  | ------------- | ---------------------- | -------------------------------------------------------- |
  | `title`       | string                 | required                                                 |
  | `description` | string                 | required; used for the meta description                  |
  | `pubDate`     | date                   | required                                                 |
  | `updatedDate` | date                   | optional                                                 |
  | `category`    | enum of Category slugs | required, exactly one                                    |
  | `tags`        | string[]               | default `[]`; each must match `^[a-z0-9]+(-[a-z0-9]+)*$` |
  | `draft`       | boolean                | default `false`                                          |
  | `series`      | reference to `series`  | optional                                                 |
  | `part`        | positive integer       | required if and only if `series` is set                  |

- **Slug**: derived from the filename by stripping an optional leading `YYYY-MM-` or `YYYY-MM-DD-` prefix and the extension (use the loader's `generateId`). Two Posts with the same slug fail the build.
- **`series` collection**: glob loader over `src/content/series/*.md`. Frontmatter `title` (req), `description` (req, one line), `status: 'ongoing' | 'complete'` (req), `planned: string[]` (default `[]`). The Markdown body is the Series introduction.
- **Visibility**: in production, Drafts are excluded everywhere (lists, Tag pages, sitemap, counts). In dev (`import.meta.env.DEV`) Drafts are included and marked `[draft]`.
- **Series rules** (checked over all Posts, Drafts included, in both modes; any violation throws and fails the build):
  1. Part numbers within a Series are unique and contiguous from 1 (1..N).
  2. Published Parts are a prefix: a Draft Part may not come before a published Part.
  3. Parts: written Parts are 1..N; `planned` titles become Parts N+1… in order. **Total = N + planned.length.**
  4. In production, a Draft Part is shown as a Planned Part (title only, greyed, no link).
  5. A Series appears on public pages (series index, home "currently writing") only if it has ≥1 published Part. Its own page is not generated otherwise.
- **Reading time**: `ceil(words / 220)`, minimum 1, shown as `N min read`. Count words from the raw body, ignoring code fences.
- **Dates**: displayed as `YYYY-MM-DD` in UTC. Sort Posts by `pubDate` descending, ties broken by title.

### Architecture & seam

- **`src/lib/model.ts`** is a pure module with no `astro:*` imports. It takes plain arrays of post/series records and the mode (`dev`/`prod`) and does all the logic. **This is the only test seam.** _Implemented as:_ one entry point `buildSite(posts, series, mode)` that runs every validation rule and returns a `Site` (`posts`, `postsInCategory`, `tags`, `postsWithTag`, `series`, `seriesBySlug`, `placeInSeries`), plus the utilities `readingTime`, `slugFromFilename` and `formatDate`. A single entry point means pages cannot skip validation. This replaced the originally listed loose helpers (`visiblePosts`, `sortPosts`, `resolveSeries`, `seriesNav`, …).
- **`src/lib/content.ts`** is a thin adapter: calls `getCollection`, maps entries to the plain records `model.ts` expects, and memoises one validated "site" object. Pages only talk to this module.
- Components (in `src/components/`): `BaseHead` (title, description, canonical, OG text tags, Mode no-flash script), `Header` (brand + menu + Mode toggle), `Footer`, `PostList` (the dense one-line rows), `SeriesBox`, `SeriesNav`, `TagList`. Layouts: `BaseLayout`, `PostLayout`.

### Pages & routes

| route                                     | content                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                                       | `$ whoami` intro; one `currently writing:` line per visible Ongoing Series ("· k of T parts out"); latest 20 Posts (`PostList`, with Part suffix `· 2/4` for Series Posts) + `all posts →`; `$ ls categories/` block with each Category's description and published-Post count |
| `/posts/`                                 | all visible Posts (`PostList`)                                                                                                                                                                                                                                                 |
| `/posts/<slug>/`                          | Post page (below)                                                                                                                                                                                                                                                              |
| `/agentic-ai/`, `/leadership/`, `/music/` | Category label, description, its Posts; empty state "Nothing here yet."                                                                                                                                                                                                        |
| `/tags/<tag>/`                            | Posts with that Tag; only generated for Tags on visible Posts                                                                                                                                                                                                                  |
| `/series/`                                | visible Series: title, status, description, part counts; empty state "No series yet."                                                                                                                                                                                          |
| `/series/<slug>/`                         | title, status, introduction (body), full Parts list                                                                                                                                                                                                                            |
| `/about/`                                 | short placeholder bio (Vlad rewrites it) + GitHub `https://github.com/vfil`, LinkedIn `https://www.linkedin.com/in/vlad-filimon-60a14a39/`                                                                                                                                     |
| `/404`                                    | styled 404, link home (Astro emits `404.html`, which GitHub Pages serves)                                                                                                                                                                                                      |
| sitemap                                   | `@astrojs/sitemap`                                                                                                                                                                                                                                                             |

Header menu, in order: `~/vfil` (home) · `/agentic-ai /leadership /music /series /about` · Mode toggle. The current section gets `aria-current="page"` (a Post page marks its Category). Links wrap on narrow screens; no hamburger.

**Post page**:

- meta line in mono: `date · [category] · N min read` (+ `updated YYYY-MM-DD` if set)
- title, then `SeriesBox` if the Post is in a Series
- body in `.prose`
- Tags
- `SeriesNav` (← previous Part / next Part →), only linking to visible Parts

`SeriesBox` is a native `<details>` element. Its summary reads `series: <Title> · part 2 of 4`; expanded, it lists every Part (current one highlighted, Planned Parts greyed and unlinked) plus a link to the Series page.

**Code**: Shiki via Astro's markdown config with dual themes (`themes: { light: 'github-light', dark: 'github-dark-dimmed' }`, `defaultColor: false`), switched with CSS so that it follows both `prefers-color-scheme` and `data-theme`. Code blocks sit on `--surface`. A copy button appears on each block's top-right corner: an inline script, `navigator.clipboard.writeText`, showing "copied" for 1.5s.

**Mode (dark/light)**: an inline script in `<head>` reads `localStorage.mode` (inside try/catch) and sets `data-theme` before first paint. The toggle flips between dark and light and saves the choice. With no saved choice, the OS setting applies.

### Deployment

`.github/workflows/deploy.yml`:

- **`check` job** on every push and PR: setup Bun + Node 24, `bun install --frozen-lockfile`, `bun run check` (`astro check`), `bun run test`, `bun run build`.
- **`build` job** on `main` only, needs `check`: `withastro/action@v6` with `package-manager: bun` and `node-version: 24`. Check the action's README for the current input syntax.
- **`deploy` job**: `actions/deploy-pages@v5`.
- Permissions `contents: read, pages: write, id-token: write`, plus `actions/checkout@v7`. Check current majors at implementation time.
- **Manual step for Vlad** (the agent cannot do it): GitHub repo → Settings → Pages → Source = **GitHub Actions**.

## Testing decisions

- **One seam: `src/lib/model.ts`.** Tests in `src/lib/model.test.ts` call its exported functions with plain fixture records and assert outputs or thrown errors. Test behaviour through the public functions only, never internals. Build it test-first (the `tdd` skill).
- Cases that must be covered:
  - Drafts hidden in prod, shown in dev.
  - Sort order and ties.
  - Tag and Category grouping.
  - Slug stripping for `YYYY-MM-` and `YYYY-MM-DD-` prefixes and for no prefix; duplicate slug throws.
  - Series:
    - parts ordered;
    - gap throws;
    - duplicate part throws;
    - published-after-Draft throws;
    - `part` without `series` (and vice versa) rejected;
    - total = written + planned;
    - Draft Part rendered as Planned in prod;
    - Series with no published Parts hidden in prod;
    - prev/next skips nothing and never links a Planned Part.
  - Reading time ignores code fences and has a minimum of 1.
  - Date formatting in UTC.
- **The build is the integration test.** `astro check` (types + content schema) and `astro build` run in CI. No E2E/browser tests in this spec.
- There is no prior art in the repo; this spec establishes it.

## Out of scope (later specs)

RSS/Atom feed (decided against for now), search (Pagefind), comments (giscus), analytics, newsletter, generated OG images, cover images, music embeds (YouTube/Bandcamp/Spotify), custom domain, React islands, i18n, a separate "note" content type.

---

## Step-by-step plan

Each step is **one commit** on its own branch or the integration branch. `Depends on` gives the order: steps whose dependencies are done can run in parallel. Every step ends with `bun run check && bun run test && bun run build` green, unless the step says otherwise.

### Step 1: Scaffold

Depends on: none

- `bun create astro@latest` with the **minimal** template into the repo root. Keep `.claude/`, `specs/`, `docs/`, `GLOSSARY.md`.
- TS `strict`.
- `astro.config.mjs`: `site`, mdx, sitemap integrations.
- Scripts in `package.json`: `dev`, `build`, `preview`, `check` (`astro check`), `test` (`vitest run`), `format` (`prettier --write .`).
- Add Prettier + `prettier-plugin-astro`, Vitest, `@astrojs/check`, `typescript`. Add `.nvmrc` with `24`.
- `.gitignore` covers `dist/`, `.astro/`, `node_modules/`.

Done when: `bun run build` produces `dist/index.html`; `bun run check` passes; `bun run test` passes (with a trivial placeholder test that step 4 removes).

### Step 2: CI and deploy

Depends on: 1

- Add `.github/workflows/deploy.yml` as described under Deployment.

Done when: the workflow passes on a branch push (check job only), and after Vlad sets Pages source = GitHub Actions and merges to `main`, `https://vfil.github.io` serves the placeholder page.

### Step 3: Design system and shell

Depends on: 1

- Fonts API config.
- `src/styles/global.css`: tokens copied from the mockup, reset, base, links, focus ring, `.prose` styles for headings, lists, blockquote, table, inline code, `pre`, hr and images. Use a 46rem measure; reading text in Plex Sans at 1rem/1.65.
- `BaseHead`, `Header`, `Footer`, `BaseLayout`, plus the theme no-flash script and toggle.
- Make `/` a placeholder using the layout.

Done when:

- At 1280px and 390px, the header, menu and footer match `specs/mockups/home.html`.
- The toggle switches theme and is remembered after reload, with no flash of the wrong theme on hard reload.
- Keyboard focus is visible on every link and button.
- No horizontal scroll at 390px.

### Step 4: Content model (TDD)

Depends on: 1

- `src/lib/categories.ts`.
- `src/content.config.ts` with the `posts` and `series` collections and schemas as specified, including `generateId` for slugs.
- `src/lib/model.ts`, built test-first against `src/lib/model.test.ts` covering every case listed under Testing.
- `src/lib/content.ts` adapter.

Done when: all model tests pass. Temporarily adding a Post with `category: agentc-ai`, a bad Tag, or a Series gap makes `bun run build` fail with a readable message. Remove those test files afterwards.

### Step 5: Seed content

Depends on: 4

- `src/content/posts/2026-11-03-hello-world.md`: **published**, Category `leadership`, Tags `meta`, `learning-in-public`. A short, honest "why this blog exists". Write it as a draft text for Vlad to edit, in plain first person.
- `src/content/series/building-an-agent-from-scratch.md`: status `ongoing`, `planned: ["Tools", "Memory", "Evals"]`, two-sentence introduction.
- `src/content/posts/2026-11-10-the-loop.md`: **Draft**, Category `agentic-ai`, `series: building-an-agent-from-scratch`, `part: 1`, title "The loop: an agent is a while statement". Include a TypeScript code block (≥15 lines), an inline code span, and a subheading.
- `src/content/posts/2026-11-17-one-on-ones.mdx`: **Draft**, Category `leadership`, "What I stopped doing in 1:1s". Include a blockquote, a table, and an ordered list.
- `src/content/posts/2026-11-06-scales-like-tests.md`: **Draft**, Category `music`, "Practising scales like writing tests". Include a shell code block, an image placeholder (a small local SVG in `src/assets/`), and three Tags.

Done when: build passes. In dev all 4 Posts are listed (3 marked `[draft]`); in the production build only "Hello, world" is.

### Step 6: Post page

Depends on: 3, 4, 5

- `src/pages/posts/[slug].astro` + `PostLayout`, `TagList`, `SeriesBox`, `SeriesNav`.
- Shiki dual-theme config and CSS; copy button script.

Done when:

- In dev, `/posts/the-loop/` shows the meta line, `series: Building an agent from scratch · part 1 of 4`, a Parts list with "Tools / Memory / Evals" greyed, highlighted code correct in both themes, and a working copy button.
- In the production build, `/posts/hello-world/` exists and `/posts/the-loop/` does not.

### Step 7: Listings

Depends on: 3, 4, 5

- `PostList` component.
- `/` (whoami intro, latest 20, `ls categories/` block with counts), `/posts/`, the three Category pages, `/tags/[tag]/`.
- Category pages are generated from `categories.ts` (one dynamic route `src/pages/[category]/index.astro` with `getStaticPaths`), with empty states.

Done when:

- Home matches the mockup's layout and density at 1280px and 390px.
- On mobile, rows stack as date + Category above the title.
- The menu marks the active Category.
- `/music/` in the production build shows "Nothing here yet."

### Step 8: Series pages

Depends on: 6, 7

- `/series/` and `/series/[slug]/`.
- The `currently writing:` line on home.
- The `· k/T` suffix in `PostList` for Series Posts.

Done when:

- In dev: `/series/building-an-agent-from-scratch/` shows the introduction and 4 Parts (1 linked, marked `[draft]`; 3 planned), and home shows `currently writing: Building an agent from scratch · 1 of 4 parts out`.
- In the production build: `/series/` shows "No series yet.", there's no `currently writing` line, and no Series page is generated.

### Step 9: About, 404, sitemap

Depends on: 3, 4

- `/about/` (placeholder bio + links), `404.astro`, sitemap check.

Done when:

- `dist/404.html` exists.
- `dist/sitemap-index.xml` lists no Draft URLs.

### Step 10: Authoring guide and final pass

Depends on: 2, 6, 7, 8, 9

- `README.md`: how to run locally, how to write a Post (frontmatter table, filename convention), Drafts, Tags rules, how to start a Series, add Planned Parts, and turn a Planned Part into a Draft (move its title out of `planned` into a new Post with the next `part`). Also how to deploy and where specs/ADRs live.
- Run Lighthouse on the production preview (`bun run preview`) for `/` and `/posts/hello-world/`.

Done when:

- Lighthouse accessibility ≥ 95 and performance ≥ 95.
- Each page ships zero JS beyond the two inline scripts (check the `dist/_astro` contents and the page source).
- All prior "done when" checks still hold, and CI is green on `main`.

## Further notes

- Keep the glossary terms in code too: `Post`, `Series`, `Part`, `Category`, `Tag` (e.g. `type Post`, not `Article`).
- If a decision here turns out wrong during implementation, stop and note it in the spec (or a new ADR) rather than silently diverging.
