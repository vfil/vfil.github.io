# 0001 · Blog foundation

Status: implemented (2026-11-03)

Product spec only. How it works lives in the code (`src/lib/model.ts` for content rules, `src/lib/content.ts` for data access) and the README; see [GLOSSARY.md](../GLOSSARY.md) for terms and [ADR 0001](../docs/adr/0001-astro-over-react-frameworks.md) for the stack decision.

## Problem statement

Vlad wants a personal blog on GitHub Pages (`vfil.github.io`) where he can publish, now and then, what he is learning about agentic AI and leadership, and occasionally about music. It should look minimal and a bit geeky, be cheap to maintain for years, and let him write Posts as Markdown files in his editor. His first piece of writing is a multi-part Series, so Series must work from day one.

## Solution

A static site deployed automatically on every push to `main`. Posts and Series are Markdown/MDX files in the repo, validated at build time. The design is an "engineer's notebook": monospace chrome, readable sans-serif text, amber accent, dark by default with a light toggle. Pages ship JavaScript only where it earns its place, and only on the pages that need it.

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
12. As a reader, I want dark and light Modes that follow my OS setting, with a toggle that remembers my choice and never flashes the wrong Mode on load.
13. As a reader on a phone, I want the menu to wrap rather than hide behind a hamburger, and no horizontal scrolling.
14. As a reader, I want an About page with links to Vlad's GitHub and LinkedIn.
15. As a reader who follows a broken link, I want a 404 page in the same style with a way back home.

Author (Vlad):

16. As the author, I want to write a Post as one Markdown/MDX file with a small frontmatter block, so publishing is "write, commit, push".
17. As the author, I want the build to fail on a missing or misspelled Category, malformed Tag, unknown Series or bad Part numbering, so mistakes never reach readers.
18. As the author, I want Drafts to render locally but never in the production build.
19. As the author, I want Post URLs that don't contain the Category, so recategorising never breaks shared links.
20. As the author, I want to name files with a date prefix for sorting in my editor, without the date showing in the URL.
21. As the author, I want a Series file where I set title, introduction, status and Planned Part titles in one place.
22. As the author, I want a README that explains how to write a Post, a Series and a Draft, so future-me doesn't have to rediscover it.
23. As the author, I want CI to typecheck, test and build every push, and deploy only from `main`.

## Out of scope

RSS/Atom feed (decided against for now), search, comments, analytics, newsletter, generated OG images, cover images, music embeds, custom domain, i18n, a separate "note" content type.
