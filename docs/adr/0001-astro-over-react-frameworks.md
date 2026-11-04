# Astro, not a React framework, for the blog

The author is most fluent in React + TypeScript, yet the blog is built with Astro (TypeScript, MDX, `.astro` components) rather than Next.js static export or React Router prerendering. The site is static, content-first and hosted on GitHub Pages; Astro ships zero JavaScript by default, validates Post frontmatter with typed content collections, and has first-party GitHub Pages deployment, whereas the React frameworks would ship the React runtime on every page and require hand-rolled Markdown loading and route generation. React is still available via `@astrojs/react` for the few interactive islands that need it.

## Considered Options

- **Next.js 16 `output: 'export'`**: familiar, but ~200KB+ JS for a text page, image optimisation unavailable on static hosting, and MDX/content plumbing left to us.
- **React Router 8 framework mode (`prerender` + `ssr: false`)**: works, but dynamic routes need a custom `prerender()` that scans the content folder: more code we own.
- **Eleventy / Hugo**: leanest output, but non-React templating (Nunjucks/Liquid, Go templates) throws away the author's main skill.

## Consequences

- Layouts and pages are `.astro` files (JSX-like, not React); React components are the exception, used only with an explicit `client:*` directive.
- Bun is used as package manager and script runner only; the Astro CLI runs on Node, because Astro documents rough edges when running on the Bun runtime.
- The first interactive component (the reader Palette picker, spec 0002) is plain TypeScript loaded on first click, not a React or Preact island: it is mostly canvas drawing and pointer maths, and a framework would add page weight for no benefit. React is introduced only when a component genuinely benefits from it.
- "Minimal JavaScript" means no unnecessary complexity, not no JavaScript. Interactive components, TypeScript modules and libraries are welcome whenever they make the work simpler or the experience better (a reader quiz, for example); what the choice avoids is shipping a framework runtime on every page. Scripts load only on pages that use them.
