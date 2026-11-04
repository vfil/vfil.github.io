## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project conventions

- Read `GLOSSARY.md` first and use its terms (Post, Draft, Category, Tag, Series, Part, Planned Part, Mode, Palette) in code, UI copy and specs.
- Work is spec-first: features are planned as step-by-step specs in `specs/` and implemented in a separate session. Implement one spec step per commit. After implementation, delete the spec's tech details, steps and mockups, keeping only product intent: the code is the single source of truth.
- Respect the decisions in `docs/adr/`.
- "Minimal JavaScript" means no unnecessary complexity, not no JavaScript: use scripts, TypeScript modules and libraries when they simplify the work or improve the experience. Don't avoid them just to ship less JS.
- All content rules live in `src/lib/model.ts` (pure, tested in `src/lib/model.test.ts`); pages get data through `getSite()` in `src/lib/content.ts`.
- Run `bun run format && bun run check && bun run test && bun run build` before committing.
