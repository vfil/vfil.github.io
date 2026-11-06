# 0010 · Part 6 of the agent Series: "Services and layers"

Status: planned

Product spec plus implementation steps. Once implemented, delete the tech details, steps and mockups and keep only the product intent, as in [spec 0009](0009-why-effect-post.md). The Post will be `src/content/posts/2026-11-06-services-and-layers.mdx` (renamed to the real date when published) in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md), [spec 0007](0007-tools-as-data-post.md), [spec 0008](0008-providers-behind-one-interface-post.md) and [spec 0009](0009-why-effect-post.md) for how Parts 1–5 were ported.

## Problem statement

Part 5 ends with an agent in which every failure shows in a type, but the loop can only run against the real world: the model, the terminal and the tools are reached by imports, and each import does its work when the file loads. Importing `provider.ts` with an unknown `PROVIDER` throws before a test could run, importing `terminal.ts` attaches readline to standard input, and `index.ts` starts the agent. Part 2's roadmap and Part 5 promise that _Services and layers_ (Part 6) turns these into things the loop asks for, so that a test can run the whole loop against a scripted model. Vlad has finished that Part as a lesson in his OpenCode fork (`/Users/vladex/PLAYGROUND/opencode/lessons/0006-services-and-layers.html`), with the code tagged in the Companion repo as `Part6_services_and_layers`. It needs to become Part 6, reading and looking like Parts 1–5.

The Series' `planned` list still contains "Services and layers", so after publishing the Series page would show it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same kinds of edits as specs 0006 to 0009. It stays a Draft until Vlad has read it.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `testing`, `ollama`, Series _Building an agent from scratch_, Part 6, title exactly "Services and layers" (the name used by the Series, Part 2 and Part 5), Snapshot `Part6_services_and_layers`, `pubDate` 2026-11-06, and a description in the style of Part 5's, for example "After Part 5 the loop can only run against a live model, a keyboard and real files. Making the model client, the terminal and the tools services lets a test run the whole loop against a scripted model."
- **Foreword**: the fourth Part of Stage A (Harness) in [the roadmap](/posts/the-roadmap/), counting from Part 3 as Parts 3 to 5 do, and a plain sentence linking to the Snapshot, like Parts 1, 3, 4 and 5 ([spec 0005](0005-companion-repo.md)). The footer link is generated. There is no "your prediction" section.
- **Content**, in the lesson's order:
  - "Start from what you cannot test": the table of the four pieces the loop reaches by import (model, user, tools, loop) and what a test of each would need, and the `PROVIDER=nope` import experiment with its transcript.
  - "What services and layers add", in four ideas with a runnable snippet each: a service is a key for something the program needs (`Dice`, and the compiler refusing to run an Effect that still needs one); a layer builds a service and providing it removes the requirement (`RealDice`, `FixedDice`); a layer can run code, fail and need other services (`Layer.effect`, with OpenCode's tool layer as the example); a layer can open a resource and close it again (`Effect.acquireRelease`).
  - "Five decisions in the rewrite": three services named for what the loop needs (`ModelClient`, `Terminal`, `Tools`; permission is not a service in this Part); a service's methods have no requirements of their own (and the types of `turn` and `repl`); the live layers hold what used to happen at import; the loop can be imported; a fake is a layer, and what it can and cannot tell you.
  - The agent's `scriptedModel` compared with OpenCode's `Layer.mock` in `session-compact.test.ts`, as two consecutive code blocks.
  - Six quizzes.
  - The hands-on build in six steps, each ending with something that type-checks and runs: move the loop into `agent.ts`; the `Terminal` service; the `ModelClient` service; the `Tools` service; the fakes and three tests; read `R`, break things and run it live. The finished files are collapsed after the steps.
  - The "Watch for this" and Result callouts, the Primary source and Sources.
- **Vocabulary**: "Part", not "post", "module" or "lesson", including the lesson's "this post". Other Parts are italic titles with their number, unlinked; Parts 1–5 are linked. The lesson's "The glossary has terms for these" refers to the lesson pack's glossary and is cut; the Post defines inline what a service, a layer and a requirement (`R`) are, and what a REPL is. `ModelClient`, `Terminal`, `Tools`, `turn` and `repl` appear as code identifiers. `GLOSSARY.md` does not change. "Tag" appears only inside code identifiers such as `catchTag`, because Part 5 already told readers that Effect's `_tag` is unrelated to a Post's Tags.
- **Quizzes**: the lesson's six "Check yourself" questions (all multiple choice) become `<Quiz>` ([spec 0004](0004-quiz-component.md)), with right/wrong feedback in the style of Parts 3 to 5. No recall quizzes from earlier Parts are added.
- **Shapes**: tables become Markdown tables, callouts become blockquotes, `<details class="reveal">` becomes `<details>`. Code in Posts is never reformatted by Prettier. Terminal transcripts keep the lesson's `$ ` and `You:` lines.
- **Corrections to the lesson**: Parts 1 to 5 never gave readers `typecheck`, `reset` or `test` scripts, so the commands that use them change. `bun run typecheck` becomes `bunx --package typescript tsc --noEmit` (the transcripts' `$ tsc --noEmit` and `error: script "typecheck" exited with code 1` lines go with it), `bun run test` becomes `bun test`, the "add a test script to package.json" step is dropped, and the finished `package.json` is left out of the finished files, since nothing is installed in this Part. If the transcripts of those commands differ when rerun, they follow what the commands print.
- **Stance**: the Post describes what services and layers do in this agent and what a scripted model can and cannot show. It does not argue that they suit other programs or that importing real implementations falls short in general. The reasons are the four pieces in the table, Effect's migration guide and OpenCode's code, each cited. The lesson's statement that a scripted model checks the harness and not the model stays.
- **Tone**: applies to Part 6 only; Parts 1–5 are left as published. A checklist for the implementing session:
  - "I" appears only for measured facts and the Foreword's sentence about the Companion repo; no claims about how well the design turned out. "The three tests ran in under 100 ms in my runs" becomes the measured figure stated as a fact of the Test environment, and the Result callout's "well under a second" becomes a number from the rerun.
  - Claims are attributed or hedged. Sentences that read as verdicts become descriptions.
  - Imperatives only where the reader acts: the build steps ("Create…", "Replace…", "Run…"), Step 6's break-it-on-purpose actions and callouts. Elsewhere they become descriptive: the Primary source's "Find the three services…, write down…" becomes "A useful exercise: …", as in Part 5.
  - The lesson's "Part 7 changes what the model client returns" becomes a hedged pointer to _Streaming_ (Part 7), unlinked.
- **Sources**: the lesson's "Primary source" (OpenCode's `core/src/tool.ts` and `core/test/session-compact.test.ts`) joins the Sources list, marked as the one to read first, together with `ai/src/route/client.ts` (the `LLMClient` service) and the Effect v3 to v4 migration guide's Services section. All OpenCode links are pinned to `97be25f046`, as in Part 5. The `core/src/tool.ts` quotation, a layer asking for three services in its first lines, only matches that commit (at `863ea41364` the `Permission.Service` line is not there). The Checked paragraph says so, as Part 5's does. The "Measured" statement stays as in the lesson, minus its last sentence ("Claude was not run against the live API"); the Post makes no statement about the Claude route beyond "`PROVIDER=claude` selects the Anthropic route, and without `ANTHROPIC_API_KEY` the program prints `Set ANTHROPIC_API_KEY first`", and shows no Claude transcript.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Services and layers" leaves `planned`, so the Series page shows Parts 1–6 written and Part 7 planned: _Streaming_.
- **Earlier Parts**: unchanged. Part 5's italic, unlinked "(Part 6)" mention and Part 2's roadmap entry stay; their text is still accurate (Part 2 lists `Permission.Service` under OpenCode, which this Part says is not a service in the agent yet).

### Claims

The Post states only what was checked on the implementation day:

- The `Part6_services_and_layers` tag exists on vfil/sigma-agent (seen on the remote at `93fc2e7`), and its `src` and `test` files equal the lesson's finished files (checked line by line when this spec was written; recheck on the day, apart from blank lines and trailing commas).
- Steps 1 to 6 applied in order to Part 5's finished files (the Part 5 Snapshot), with the intermediate states type-checking as the steps say; the finished files type-check with `bunx --package typescript tsc --noEmit` on Effect 4.1.0, and the three tests pass with `bun test`. The compiler errors shown (running `play` while it still needs `Dice`, the `probe.ts` types of `turn` and `repl`, the missing `TerminalLive`) are the ones the compiler prints. The test failure with `y` in place of `n` prints what the Post shows.
- The snippets in "What services and layers add" run on their own, with the outputs shown (`11` and `8`, the `open` / `rows for select 1` / `close` / `done` order).
- The `PROVIDER=nope` import experiment prints the error shown, and the same program through `index.ts` now prints the message and exits with code 1.
- The claim that `Layer.mock` fails when a method that was left out is called, against Effect 4.1.0's documentation or source, and the migration guide's Services section.
- The Step 6 transcripts rerun on Ollama and llama.cpp (a confirmed write, a declined command, the missing key, `ECONNREFUSED` on a dead port); any that cannot be rerun are marked as recorded by the lesson's author on 2026-11-05.
- The "Start from what you cannot test" table against the Part 5 Snapshot: which file reads the environment or opens readline at import.
- OpenCode links and quotations at `97be25f046`, using the local `opencode` checkout: the three `yield*` lines at the start of the tool layer and the service and layer in one file in `core/src/tool.ts`, the `Layer.mock(LLMClient.Service)` block in `session-compact.test.ts`, and the `LLMClient` service in `ai/src/route/client.ts`.
- The Part numbers and titles against the Series file after the edit, and the Stage A count against the Forewords of Parts 3 to 5.

## User stories

1. As a reader who finished Part 5, I want to see which pieces of the loop can only run against the real world and why, so I understand what services and layers are for.
2. As a reader, I want the four Effect ideas the rewrite uses explained one at a time with a runnable snippet each, so I can follow the code without prior knowledge of services.
3. As a reader, I want the model client, the terminal and the tools to be things the loop asks for, so that what the loop needs is visible in its type.
4. As a reader following along, I want each build step to end with code that type-checks and runs, so I can stop after any of them.
5. As a reader, I want a test that runs the whole loop against a scripted model, with no server, no key and no keyboard, and to see it fail for the right reason when I break the code.
6. As a reader, I want to know what a scripted model can show and what it cannot, so I don't mistake a passing test for a working model.
7. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
8. As a reader of the Series page, I want the list of Parts to show each Part once, in order.
9. As a reader, I want the prose to describe and attribute rather than boast, argue for a pattern in general, or instruct where I'm not acting, so the Part reads like the others.

## Steps

One step per commit. Before each commit run `bun run format && bun run check && bun run test && bun run build`.

1. **The Post as a Draft, and the Series.** Create `src/content/posts/2026-11-06-services-and-layers.mdx` (`draft: true`) from the lesson with the edits above, including the tone checklist and the command corrections. Remove "Services and layers" from `planned` in the Series file. Check the Series page in dev mode shows Parts 1–6 and planned Part 7, and that every `<Quiz>` renders.
2. **Verify the claims.** Run the checks under Claims; fix the Post for anything that does not hold, and add the "Measured" and "Checked:" lines at the end with the date, in the style of Part 5.
3. **Publish.** Vlad has read the Draft: remove `draft: true`, rename the file to the real date if it differs, and set this spec's status to implemented and published. Then reduce this spec to product intent.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from earlier Parts, linking the earlier Parts' "(Part 6)" mentions, any change to Parts 1–5, Stage B and Stage C Parts in the Series' Planned Parts, a permission service (a later Part), streaming (Part 7), `Layer.provide` wiring between layers beyond the OpenCode example, advice on adopting services and layers in other projects.
