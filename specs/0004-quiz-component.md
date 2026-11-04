# 0004 · Interactive quiz in Posts

Status: implemented (2026-11-04)

Product spec only. How it works lives in the code (`Quiz.astro`, and `checkQuiz` / `inlineCodeHtml` in `src/lib/model.ts`) and the README's "Write a Post" section; see [GLOSSARY.md](../GLOSSARY.md) for Post and Palette, [ADR 0001](../docs/adr/0001-astro-over-react-frameworks.md) for the JavaScript stance ("minimal" means no needless complexity, not no JavaScript) and [spec 0003](0003-agent-loop-post.md) for the Post that uses it.

## Problem statement

The original lesson had a "Check yourself" quiz that Vlad liked: pick an answer, see at once whether you were right, and read why. Spec 0003 first ported it as collapsible `<details>` answers because "minimal JavaScript" was over-read as "no JavaScript". That lost the interaction. The quiz should work like the original, in the blog's own look.

## Solution

A quiz block that any `.mdx` Post can use. A reader sees a question and its options. Clicking an option is one attempt: every option locks, the right one is marked, a wrong pick is marked too, and a message explains the answer. There is no "try again". The marks are the Palette's `--accent-2` (right) and `--accent` (wrong) plus a ✓ or ✗, so they stay readable in any Custom Palette and never rely on colour alone. For readers without JavaScript the options are plain text and the answer is shown directly, so no control is dead. The quiz's script loads only on Posts that contain a quiz.

## User stories

1. As a reader, I want to click an answer and immediately see whether I was right, so I can check my understanding before moving on.
2. As a reader, I want a wrong pick marked and the right option shown, so I learn from it.
3. As a reader, I want a short explanation after answering, written for the case I got right or wrong.
4. As a reader, I want the result visible without relying on colour, so it works for me whatever my Palette or vision.
5. As a keyboard user, I want to reach and choose options with Tab and Enter or Space, and have the result announced to a screen reader.
6. As a reader without JavaScript, I want to see the answer in the text instead of dead buttons.
7. As the author, I want to write a quiz as a single component with the question, options, which one is right and the two messages, so adding one is cheap.
8. As the author, I want the build to fail if a quiz has no right option or an out-of-range one, so a broken quiz never reaches readers.

## Out of scope

Retry or score tracking, remembering answers, other question types (Part 2's drag-style "sort into harness, session or sandbox" quiz), a quiz library.
