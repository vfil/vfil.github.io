# 0004 · Interactive quiz in Posts

Status: planned

Product spec first; delete the tech details, steps and testing decisions once implemented (the code is the source of truth). See [GLOSSARY.md](../GLOSSARY.md) for Post and Palette, [ADR 0001](../docs/adr/0001-astro-over-react-frameworks.md) for the JavaScript stance ("minimal" means no needless complexity, not no JavaScript) and [spec 0003](0003-agent-loop-post.md) for the Post that uses it.

## Problem statement

The original lesson had a "Check yourself" quiz that Vlad liked: pick an answer, see at once whether you were right, and read why. Spec 0003 ported it as collapsible `<details>` answers because "minimal JavaScript" was over-read as "no JavaScript". That lost the interaction. The quiz should work like the original, in the blog's own look.

## Solution

A quiz block that any Post can use. A reader sees a question and its options. Clicking an option is one attempt: every option locks, the right one is marked, a wrong pick is marked too, and a message explains the answer. There is no "try again". The marks are the Palette's `--accent-2` (right) and `--accent` (wrong) plus a ✓ or ✗, so they stay readable in any Custom Palette and never rely on colour alone. For readers without JavaScript the options are a plain list and the answer text is shown directly, so no control is dead. The quiz's script loads only on Posts that contain a quiz.

## User stories

1. As a reader, I want to click an answer and immediately see whether I was right, so I can check my understanding before moving on.
2. As a reader, I want a wrong pick marked and the right option shown, so I learn from it.
3. As a reader, I want a short explanation after answering, written for the case I got right or wrong.
4. As a reader, I want the result visible without relying on colour, so it works for me whatever my Palette or vision.
5. As a keyboard user, I want to reach and choose options with Tab and Enter or Space, and have the result announced to a screen reader.
6. As a reader without JavaScript, I want to see the answer in the text instead of dead buttons.
7. As the author, I want to write a quiz as a single component with the question, options, which one is right and the two messages, so adding one is cheap.
8. As the author, I want the build to fail if a quiz has no right option or an out-of-range one, so a broken quiz never reaches readers.

## Steps (one per commit; delete this section when implemented)

1. **Quiz component.** `src/components/Quiz.astro`, used from `.mdx` Posts as `<Quiz question="…" options={[…]} correct={1} right="…" wrong="…" />`. Validate `correct` at build time (throw). Markup: question, list of buttons; the right/wrong message and the no-JS answer text are rendered into the HTML. Use `html.js` (set in `BaseHead`) to show buttons only when JS is on, and the plain answer text only when it is off.
2. **Behaviour.** Plain TypeScript in a `<script>` inside the component (no library: it is about 20 lines; Astro bundles it and sends it only to pages that use a Quiz). One attempt: on click, disable every option, mark the right one (`--accent-2`, ✓) and a wrong pick (`--accent`, ✗), reveal the message in an `aria-live="polite"` region. Styles use tokens only, in the same section style as the existing `.prose details`.
3. **Convert the Post.** Rename `2026-11-10-the-loop.md` to `.mdx` (slug unchanged), replace the three "Check yourself" `<details>` blocks with `<Quiz>`, using the original lesson's right and wrong messages (`data-correct-text`, `data-wrong-text` in `/Users/vladex/PLAYGROUND/opencode/lessons/0001-the-agent-loop.html`). Extend the Prettier override that leaves fenced code alone to `src/content/posts/*.mdx`, and update the README sentence about it. MDX is stricter about `{` and `<` in prose: fix whatever the build flags; the 34 code blocks must stay byte-identical to the lesson (re-run the comparison used for spec 0003).
4. **Verify.** In `bun run dev` at 390px and desktop, in both Modes and with a Custom Palette: click right and wrong answers, check keyboard use and the no-JS view (disable JavaScript). Run `bun run format && bun run check && bun run test && bun run build`.

## Out of scope

Retry or score tracking, remembering answers, other question types (Part 2's drag-style "sort into harness, session or sandbox" quiz), a quiz library. The component should leave room for other question types later, but none is built now.
