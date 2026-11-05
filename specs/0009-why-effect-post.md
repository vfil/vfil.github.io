# 0009 · Part 5 of the agent Series: "Why Effect: errors as values"

Status: planned

Product spec plus implementation steps. Once implemented, delete the tech details, steps and mockups and keep only the product intent, as in [spec 0008](0008-providers-behind-one-interface-post.md). The Post will be `src/content/posts/2026-11-05-why-effect.mdx` (renamed to the real date when published) in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md), [spec 0007](0007-tools-as-data-post.md) and [spec 0008](0008-providers-behind-one-interface-post.md) for how Parts 1–4 were ported.

## Problem statement

Part 4 ends with an agent in which four kinds of failure are handled four different ways and none of them shows in a type: a tool that throws is caught and sent to the model, a bug inside that same `try` is sent to the model as if it were the model's mistake, a failed model request exits the program, and closed input throws out of `readline`. Part 2's roadmap and Part 3 promise that _Why Effect: errors as values_ (Part 5) fixes this. Vlad has finished that Part as a lesson in his OpenCode fork (`/Users/vladex/PLAYGROUND/opencode/lessons/0005-why-effect.html`), with the code tagged in the Companion repo as `Part5_use_effects`. It needs to become Part 5, reading and looking like Parts 1–4.

The Series' `planned` list still contains "Why Effect: errors as values", so after publishing the Series page would show it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same edits as specs 0006, 0007 and 0008. It stays a Draft until Vlad has read it.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `ollama`, Series _Building an agent from scratch_, Part 5, title exactly "Why Effect: errors as values" (the name used by the Series, Part 2 and Part 3, not the lesson's shorter "Why Effect"), Snapshot `Part5_use_effects`, `pubDate` 2026-11-05, and a description in the style of Part 4's, for example "After Part 4 four kinds of failure are handled four ways and none shows in a type. I move the agent to Effect, so tools fail with typed errors and the model and the user each read only their own."
- **Foreword**: the third Part of Stage A (Harness) in [the roadmap](/posts/the-roadmap/), and a plain sentence linking to the Snapshot, like Parts 1, 3 and 4 ([spec 0005](0005-companion-repo.md)). The footer link is generated. There is no "your prediction" section: Part 2's predictions are answered or belong to the Session stage.
- **Content**, in the lesson's order: the four failures of Part 4 (a table) and the `listFiles` crash from Part 1 with its unchanged type; what Effect adds, in four ideas (an Effect has three type parameters, `Effect.gen` and `yield*` play the role of `async` and `await`, an Effect describes work and does nothing until run, a failure is handled by its type and defects are separate); the five decisions in the rewrite (a tool failure is a typed class, one place turns a failure into a result, expected failures and defects are separate, provider errors reach the user and the turn is dropped, one Schema describes a tool's input); the agent's `Tool` compared with OpenCode's `ai/src/tool.ts`; seven quizzes; the hands-on build (the split into eight files under `src`, then the failure classes and `ask`, `tool.ts`, the tools declared with Schemas, `chat` and the loop as Effects, and a closing step that causes each kind of failure on purpose) with the finished files collapsed; the "Watch for this" and Result callouts; the Primary source; Sources.
- **Vocabulary**: "Part", not "post", "module" or "lesson", including the lesson's "this post". Other Parts are italic titles with their number, unlinked; Parts 1–4 are linked. The lesson's "The glossary has a term for this" is replaced by an inline definition of a tool failure. Agent and Effect vocabulary (tool failure, defect, provider error, Schema, Effect) is defined inline; `GLOSSARY.md` does not change. Because the blog's **Tag** is a keyword on a Post, the prose says "tagged error" and writes `_tag` and `catchTag` only as code identifiers, and says once, at first use, that this is Effect vocabulary unrelated to a Post's Tags, as spec 0008 did for the code's `Part` type.
- **Quizzes**: the lesson's seven "Check yourself" questions (three sorting an event by who reads its error; four multiple choice) become `<Quiz>` ([spec 0004](0004-quiz-component.md)), with right/wrong feedback in the style of Parts 3 and 4. No recall quizzes from earlier Parts are added.
- **Shapes**: the side-by-side Agent (Part 5) / OpenCode comparison becomes two consecutive code blocks. The tables become Markdown tables. Callouts become blockquotes. `<details class="reveal">` becomes `<details>`. Code in Posts is never reformatted by Prettier. Terminal transcripts keep the lesson's `$ ` and `You:` lines.
- **Stance**: the Post describes what Effect adds to this agent and who reads each kind of error. It does not argue that Effect suits other projects or that plain TypeScript falls short in general. The reasons are the agent's four failures, Effect's own documentation and OpenCode's code, each cited.
- **Tone**: applies to Part 5 only; Parts 1–4 are left as published. A checklist for the implementing session:
  - "I" appears only for measured facts ("in my runs…") and the Foreword's sentence about the Companion repo; no claims about how well the design turned out.
  - Claims are attributed or hedged. Sentences that read as verdicts become descriptions: "The point of the rewrite is what happens when something goes wrong, so this step causes each failure on purpose" becomes "This step causes each failure on purpose".
  - Imperatives only where the reader acts: the build steps ("Create…", "Replace…", "Run…"), the stand-in server instructions and callouts. Elsewhere they become descriptive: the closing "Find where its tool decodes… then list what OpenCode has…" becomes "A useful exercise: …".
- **Sources**: the lesson's "Primary source" (OpenCode's `ai/src/tool.ts` and the `ToolFailure` comment in `schema/errors.ts`) joins the Sources list, marked as the one to read first; its sentence that Part 6 takes the next step on the list of what OpenCode has that the agent does not stays, naming _Services and layers_ as Part 6, unlinked. The Effect docs ("Why Effect?", v3) and the v3 to v4 migration guide are listed, with the Post saying once that OpenCode uses v4 and the snippets were run on Effect 4.1.0. The "Measured" statement stays as in the lesson, minus its last sentence ("Claude was not run against the live API"); the Post makes no statement about the Claude route beyond "`PROVIDER=claude` still selects the Anthropic route", and shows no Claude transcript.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Why Effect: errors as values" leaves `planned`, so the Series page shows Parts 1–5 written and Parts 6–7 planned: _Services and layers_, _Streaming_.
- **Earlier Parts**: unchanged. Part 3's italic, unlinked "(Part 5)" mention and Part 2's roadmap entry stay; their text is still accurate.

### Claims

The Post states only what was checked:

- The `Part5_use_effects` tag exists on vfil/sigma-agent (confirmed on the remote at `3cb6e23`, the same commit as `main`), and its eight files under `src` equal the lesson's finished files apart from blank lines.
- Every code block compared with the Snapshot; Steps 1–5 applied in order to Part 4's finished `index.ts` and compared with the lesson's finished files; the finished files type-check with `bunx --package typescript tsc --noEmit` on Effect 4.1.0 and 4.1.2; the compiler errors shown (`TS2322` on `Effect<string, NotListable, never>` and the `ProviderError` outside `ToolFailure`) are the ones the compiler prints.
- The snippets in "What Effect adds" run on their own, with the outputs shown (the `ENOENT` crash, the `built the Effect` / `listing` order, the `Could not list missing…` message), and Schema's default messages for `{}` and `{ path: 42 }`.
- The claims about Effect's documentation: the quotations from "Why Effect?" ("Based on the types, we have no idea that this function can throw an exception"; "we can use the type system to track errors and context, not only success values"), the page being part of the v3 documentation, and the v3 to v4 migration guide listing renamed APIs.
- OpenCode links and quotations at the pinned commit `863ea41364`, using the local `opencode` checkout: the `ToolFailure` comment in `schema/errors.ts` (including "so the model can self-correct" and "treated as a defect and fails the stream"), `ai/src/tool.ts` (the `Tool` and `ToolExecute` shapes, the use of `decodeUnknownEffect` and `toJsonSchemaDocument`), and `core/src/tool/AGENTS.md` (defects and interruption must survive; the registry erases types).
- The transcripts in Step 6 rerun on Ollama and llama.cpp (missing key, declined action, `ECONNREFUSED`, unknown model, the stand-in server's `request 1/2/3` role lists, the `[bug]` run, `PROVIDER=llamacpp`); any that cannot be rerun are marked as recorded by the lesson's author on 2026-11-05. The Step 1–5 `runTool` outputs on direct calls.
- The failures table in "Start from the failures" against Part 4's finished file (what happens when `chat` fails, and when input ends during `rl.question`).
- The Part numbers and titles against the Series file after the edit.

## User stories

1. As a reader who finished Part 4, I want to see that agent's four kinds of failure in one table, so I understand why `try`/`catch` was not enough.
2. As a reader, I want the Effect ideas the rewrite uses explained one at a time with a runnable snippet each, so I can follow the code without prior Effect knowledge.
3. As a reader, I want to know why the model reads some errors and the user reads others, so I can judge the design instead of copying it.
4. As a reader, I want a tool's input described once, so the JSON Schema the model sees and the check the agent runs cannot drift apart.
5. As a reader following along, I want the split into eight files done first and changing no behaviour, so the Effect steps are small and each ends with something to run.
6. As a reader, I want to cause each kind of failure on purpose and see who is told, so I can confirm the separation myself.
7. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
8. As a reader of the Series page, I want the list of Parts to show each Part once, in order.
9. As a reader, I want the prose to describe and attribute rather than boast, argue for Effect in general, or instruct where I'm not acting, so the Part reads like the others.

## Steps

One step per commit. Before each commit run `bun run format && bun run check && bun run test && bun run build`.

1. **The Post as a Draft, and the Series.** Create `src/content/posts/2026-11-05-why-effect.mdx` (`draft: true`) from the lesson with the edits above, including the tone checklist and the Tag clash note. Remove "Why Effect: errors as values" from `planned` in the Series file. Check the Series page in dev mode shows Parts 1–5 and planned Parts 6–7, and that every `<Quiz>` renders.
2. **Verify the claims.** Run the checks under Claims; fix the Post for anything that does not hold, and add the "Measured" and "Checked:" lines at the end with the date, in the style of Part 4.
3. **Publish.** Vlad has read the Draft: remove `draft: true`, rename the file to the real date if it differs, and set this spec's status to implemented and published. Then reduce this spec to product intent.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from earlier Parts, linking the earlier Parts' "(Part 5)" mentions, any change to Parts 1–4, Stage B and Stage C Parts in the Series' Planned Parts, `Context`, services and layers (Part 6), streaming (Part 7), advice on adopting Effect in other projects.
