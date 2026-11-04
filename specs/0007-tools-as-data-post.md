# 0007 · Part 3 of the agent Series: "Tools as data"

Status: planned

Product spec plus implementation steps. Once implemented, delete the tech details, steps and mockups and keep only the product intent, as in [spec 0006](0006-roadmap-post.md). The Post will be `src/content/posts/2026-11-04-tools-as-data.mdx` (renamed to the real date when published) in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md) and [spec 0006](0006-roadmap-post.md) for how Parts 1 and 2 were ported.

## Problem statement

Part 1 ends with an agent that crashes when a tool throws, and Part 2 promises that _Tools as data_ (Part 3) fixes it. Vlad has finished that Part as a lesson in his OpenCode fork (`/Users/vladex/PLAYGROUND/opencode/lessons/0003-tools-as-data.html`, 1059 lines), with the code tagged in the Companion repo as `Part3_tools_as_data`. It needs to become Part 3, reading and looking like Parts 1 and 2.

Two things on the blog are out of step with it:

- The Series' `planned` list still contains "The roadmap", which is already published as Part 2. Parts are numbered by position, so the Series page shows it a second time as a Planned Part 3. Publishing Part 3 would also leave "Tools as data" in the list as a Planned Part 4.
- Part 2's Stage C "Permissions" bullet says that stage ends with "a y/n prompt before `write_file` and `bash`". Part 3 builds that prompt, so the bullet promises something already delivered.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same edits as spec 0006. It stays a Draft until Vlad has read it.

- **Front matter**: category Agentic AI, tags `agents`, `tools`, `typescript`, `ollama`, Series _Building an agent from scratch_, Part 3, title exactly "Tools as data", Snapshot `Part3_tools_as_data`, and a one-sentence description.
- **Foreword**: a plain sentence linking to the Snapshot, like Part 1's ([spec 0005](0005-companion-repo.md)). The footer link is generated.
- **Content**: the prediction from Part 2 and its answer (an error result on each protocol; the text is the only signal on the OpenAI protocol); a tool as one object (name, description, input schema, executor) compared with Thorsten Ball's Go agent and OpenCode's `read` tool; the three rules for tools a model can use well; tools on each provider; the quizzes; the hands-on build of the registry in six steps on Ollama, then the optional Claude changes; the "Watch for this", memory and Result callouts; the Primary source; Sources.
- **Vocabulary**: "Part", not "post", "module" or "lesson". Other Parts are "Part N" with the Planned Part title in italics, unlinked. Part 2 is linked, since it is published. Agent vocabulary (registry, executor, tool result) is defined inline in the Post; `GLOSSARY.md` does not change.
- **Quizzes**: the lesson's seven "Check yourself" questions (five on this Part, two "From Part 2" sorting a tool object's pieces into Harness, Session or Sandbox) become `<Quiz>` ([spec 0004](0004-quiz-component.md)), with right/wrong feedback in the style of Parts 1 and 2.
- **Shapes**: the side-by-side Go / OpenCode comparison becomes two consecutive code blocks. The per-protocol shape tables become Markdown tables. Callouts become blockquotes, like Part 1's "Not a sandbox". `<details class="reveal">` becomes `<details>`, as in Part 1. Code in Posts is never reformatted by Prettier.
- **Sources**: the lesson's "Primary source" (Anthropic's _Writing effective tools for agents_) joins the Sources list, marked as the one to read first. The "Measured" and "Not measured against the live API" statements stay as written.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker) and the "ask Claude" paragraph.
- **Series**: "The roadmap" and "Tools as data" leave `planned`, so the Series page shows Parts 1–3 written and Parts 4–7 planned: _Providers behind one interface_, _Why Effect: errors as values_, _Services and layers_, _Streaming_.
- **Part 2**: one sentence in the Stage C "Permissions" bullet changes so it no longer promises the y/n prompt Part 3 builds. Permissions in Stage C is about rules for what may run, replacing Part 3's blanket prompt. Nothing else in Part 2 changes, and Part 1 is untouched.

### Claims

The Post states only what was checked:

- OpenCode links and quotations at the same pinned commit as Parts 1 and 2 (`863ea41364`), using the local `opencode` checkout: `tool/plugin/read.ts`, `tool/AGENTS.md`, `ai/src/protocols/shared.ts`, `tool/plugin/shell.ts`. Already confirmed: the four files exist at that commit and the "one object" quotation is verbatim in `tool/AGENTS.md`.
- The Claude, Ollama and llama.cpp doc quotations re-fetched and compared with the lesson: "by far the most important factor in tool performance", "retry 2–3 times with corrections before apologizing", the include-what-to-try-next advice, llama.cpp's "may consume more tokens and be less efficient", no `tool_choice` on Ollama's OpenAI endpoint, `strict: true` on a tool definition.
- Every code block compared with the `Part3_tools_as_data` Snapshot. The "replace this / with this" snippets match the final code in Part 1's Post. Already confirmed: the loop's find / throw / execute / push lines, the position of `const rl`, and the `claude.ts` region the lesson says to swap. The finished `index.ts` type-checks with `bunx --package typescript tsc --noEmit`, and the Step 1 errors the lesson describes (three, one per tool) appear.
- The `Part3_tools_as_data` tag exists on vfil/sigma-agent (confirmed on the remote).
- The Part numbers and titles against the Series file after the edit.

## User stories

1. As a reader who finished Part 2, I want the crash from Part 1 fixed, so I can see a failing tool become something the model reads and acts on.
2. As a reader, I want to recall my prediction before seeing the answer, so I remember it better.
3. As a reader, I want a tool to be one object that both protocols derive their format from, so adding a tool never touches the loop or the protocol code.
4. As a reader, I want to know what makes a tool description or error message good enough for a small local model, not just for Claude.
5. As a reader following along, I want each build step to end with something to run, and a finished file to compare with when I'm stuck.
6. As a reader who ran Part 1, I want the Claude changes kept optional and separate, so I can skip them.
7. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
8. As a reader of the Series page, I want the list of Parts to show each Part once, in order.
9. As a reader of Part 2, I want its Stage C description not to promise what Part 3 already did.

## Steps

One step per commit. Before each commit run `bun run format && bun run check && bun run test && bun run build`.

1. **The Post as a Draft, and the Series.** Create `src/content/posts/2026-11-04-tools-as-data.mdx` (`draft: true`) from the lesson with the edits above. Remove "The roadmap" and "Tools as data" from `planned` in the Series file. Check the Series page in dev mode shows Parts 1–3 and planned Parts 4–7, and that every `<Quiz>` renders.
2. **Verify the claims.** Run the checks under Claims; fix the Post for anything that does not hold, and add a "Checked:" line at the end with the date, in the style of Part 2.
3. **Part 2's Stage C bullet.** The one-sentence edit to "Permissions" in `src/content/posts/2026-11-04-the-roadmap.mdx`. Re-read Part 2's safety note and Stage A bullet for Part 3 to be sure they still agree with Part 3.
4. **Publish.** Vlad has read the Draft: remove `draft: true`, rename the file to the real date if it differs, and set this spec's status to implemented and published. Then reduce this spec to product intent.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a README rule about removing Planned Parts from `planned`, Stage B and Stage C Parts in the Series' Planned Parts, any change to Part 1, any change to Part 2 beyond the one sentence.
