# 0008 · Part 4 of the agent Series: "Providers behind one interface"

Status: planned

Product spec plus implementation steps. Once implemented, delete the tech details, steps and mockups and keep only the product intent, as in [spec 0007](0007-tools-as-data-post.md). The Post will be `src/content/posts/2026-11-05-providers-behind-one-interface.mdx` (renamed to the real date when published) in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md) and [spec 0007](0007-tools-as-data-post.md) for how Parts 1–3 were ported.

## Problem statement

Part 3 ends with an agent that exists twice: `index.ts` talks to Ollama and llama.cpp, `claude.ts` talks to Claude, and the five tools, `runTool` and the confirmation prompt are copied in both. Parts 1, 2 and 3 each promise that _Providers behind one interface_ (Part 4) removes that duplication. Vlad has finished that Part as a lesson in his OpenCode fork (`/Users/vladex/PLAYGROUND/opencode/lessons/0004-providers-behind-one-interface.html`), with the code tagged in the Companion repo as `Part4_common_interface`. It needs to become Part 4, reading and looking like Parts 1–3.

The Series' `planned` list still contains "Providers behind one interface", so after publishing the Series page would show it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same edits as specs 0006 and 0007. It stays a Draft until Vlad has read it.

- **Front matter**: category Agentic AI, tags `agents`, `providers`, `typescript`, `ollama`, Series _Building an agent from scratch_, Part 4, title exactly "Providers behind one interface", Snapshot `Part4_common_interface`, `pubDate` 2026-11-05, and the description "After Part 3 the agent exists twice, once per protocol. I give it its own message types, so one loop runs on Ollama, llama.cpp or Claude by changing a setting."
- **Foreword**: a plain sentence linking to the Snapshot, like Parts 1 and 3 ([spec 0005](0005-companion-repo.md)). The footer link is generated. There is no "your prediction" section: Part 2's three predictions are answered or belong to the Session stage.
- **Content**: the diff between the two files and its five groups of differences; protocols and routes (the two protocols and three routes the agent ends with); the agent's own message types compared with OpenCode's `schema/messages.ts`, and the table mapping them to each protocol; the five decisions in those types; the quizzes; the hands-on build in four steps (own types, the OpenAI protocol, routes and `PROVIDER`, the optional Claude protocol that also removes `claude.ts`) plus a closing step that runs one prompt on every route and checks the separation; the "Watch for this", memory and Result callouts; the Primary source; Sources.
- **Vocabulary**: "Part", not "post", "module" or "lesson". Other Parts are italic titles with their number, unlinked; Parts 1–3 are linked. Provider, protocol and route are recalled in a sentence pointing to [Part 1](/posts/the-loop/) and [Part 2](/posts/the-roadmap/) instead of the lesson's "the glossary already has the two words". The lesson's `Part` type stays as written, because the code and the Snapshot cannot change; the prose calls it a "content part" (lowercase) and says once, at first use, that it is agent vocabulary unrelated to the Series' Parts, as spec 0006 did for "Session". Agent vocabulary (protocol, route, content part, native) is defined inline; `GLOSSARY.md` does not change.
- **Quizzes**: the lesson's nine "Check yourself" questions (four sorting a piece of code into the loop, a protocol or a route; five multiple choice) become `<Quiz>` ([spec 0004](0004-quiz-component.md)), with right/wrong feedback in the style of Part 3. No recall quizzes from Part 3 are added.
- **Shapes**: the side-by-side Agent / OpenCode comparison becomes two consecutive code blocks. The tables become Markdown tables. Callouts become blockquotes. `<details class="reveal">` becomes `<details>`. Code in Posts is never reformatted by Prettier.
- **Correction to the lesson**: decision 3 says the OpenAI decoder bases `finish` on tool calls "not on the server's `finish_reason`, which is the check Part 3 used". Parts 1–3 never read `finish_reason`; they stop when a reply has no tool calls. The Post says instead that Parts 1–3 also stopped on a reply without tool calls, and that Part 4 names that decision (`finish`) and lets each protocol make it.
- **Tone**: applies to Part 4 only; Parts 1–3 are left as published. A checklist for the implementing session:
  - "I" appears only for measured facts ("in my runs…") and the Foreword's sentence about the Companion repo; no claims about how well the design turned out.
  - Claims are attributed or hedged. For example, "Before Part 4 this meant switching to another file. Now it is a setting." becomes a plain description of what changed.
  - Imperatives only where the reader acts: the build steps ("Replace…", "Add…", "Run…") and callouts. Elsewhere they become descriptive. For example, the closing "Read the documentation comment… then list what OpenCode has that the agent does not" becomes "A useful exercise: …", and "Compare that with the five groups…" becomes a statement.
- **Sources**: the lesson's "Primary source" (OpenCode's `route/protocol.ts` and `schema/messages.ts`) joins the Sources list, marked as the one to read first. The "Measured" statement stays, with Step 4 added: it was run against the live Anthropic API with `claude-sonnet-5-5` on 2026-11-05 with the prompts of Steps 2 and 3. No Claude transcript is shown, so the Post says only that the prompts behaved as on the local routes (an `[error]` line for the missing file, a prompt before `write_file` and `bash`). The "Not measured against the live API" paragraph from Part 3 has no counterpart.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Providers behind one interface" leaves `planned`, so the Series page shows Parts 1–4 written and Parts 5–7 planned: _Why Effect: errors as values_, _Services and layers_, _Streaming_.
- **Earlier Parts**: unchanged. Their italic, unlinked "(Part 4)" mentions stay, as Part 2's mention of Part 3 did after Part 3 shipped; the text of each is still accurate.

### Claims

The Post states only what was checked:

- The `Part4_common_interface` tag exists on vfil/sigma-agent (confirmed on the remote), and its `index.ts` equals the lesson's finished file apart from blank lines (confirmed).
- Every code block compared with the Snapshot, and the Step 1–3 "replace this / with this" edits applied in order to Part 3's finished `index.ts` and compared with the lesson's "finished after step 3" file; the same for Step 4. Both finished files type-check with `bunx --package typescript tsc --noEmit`, and the seven Step 1 errors the lesson lists appear.
- The diff count ("66 changed lines out of roughly 220 per file") recomputed on Part 3's two finished files, and the five groups of differences against that diff.
- OpenCode links and quotations at the pinned commit `863ea41364`, using the local `opencode` checkout: `route/protocol.ts` (the `Protocol` doc comment quoting "what does this API look like" and not "which URL, which headers, or which auth scheme"), `protocols/openai-compatible-chat.ts` ("24 lines"), `schema/messages.ts` (`ToolCallPart`, `ToolResultPart`, the extra result variants `json` and `content`), `protocols/anthropic-messages.ts` (the `is_error` line at `#L988`, the reasoning/thinking lines at `#L934-L937`).
- The Claude, Ollama and llama.cpp documentation claims re-fetched: all results of a step in one user message and `is_error` (Handle tool calls), the OpenAI-compatible endpoints, llama.cpp function calling.
- The transcripts in Steps 1–3 and the Step 1 `runTool` outputs rerun on Ollama (and the `PROVIDER=llamacpp` and unknown-provider outputs) in the Part 1 test environment where available; any that cannot be rerun are marked as recorded by the lesson's author on 2026-11-05.
- The two `grep` separation checks in the closing step print nothing on the finished file.
- The Part numbers and titles against the Series file after the edit.

## User stories

1. As a reader who finished Part 3, I want the duplicated agent merged into one loop, so I can see what in it is specific to a provider and what is not.
2. As a reader, I want the differences between the two files sorted into groups, so I can tell which belong to a protocol and which to a provider.
3. As a reader, I want the agent to have message types of its own, so the loop and the tools never name a wire format.
4. As a reader, I want to know why the types look the way they do (error as a kind of result, one tool message per step, a reply that says why it ended, `native`, malformed arguments), so I can judge the design instead of copying it.
5. As a reader, I want to choose a provider with one setting, so replaying a prompt on Claude to diagnose a local model is no longer a matter of switching files.
6. As a reader following along, I want each build step to end with something to run, and a finished file to compare with when I'm stuck.
7. As a reader without an API key, I want the Claude step kept optional and last, so I can skip it.
8. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
9. As a reader of the Series page, I want the list of Parts to show each Part once, in order.
10. As a reader, I want the prose to describe and attribute rather than boast or instruct where I'm not acting, so the Part reads like the others.

## Steps

One step per commit. Before each commit run `bun run format && bun run check && bun run test && bun run build`.

1. **The Post as a Draft, and the Series.** Create `src/content/posts/2026-11-05-providers-behind-one-interface.mdx` (`draft: true`) from the lesson with the edits above, including the tone checklist and the `finish_reason` correction. Remove "Providers behind one interface" from `planned` in the Series file. Check the Series page in dev mode shows Parts 1–4 and planned Parts 5–7, and that every `<Quiz>` renders.
2. **Verify the claims.** Run the checks under Claims; fix the Post for anything that does not hold, and add the "Measured" and "Checked:" lines at the end with the date, in the style of Part 3.
3. **Publish.** Vlad has read the Draft: remove `draft: true`, rename the file to the real date if it differs, and set this spec's status to implemented and published. Then reduce this spec to product intent.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from Part 3, linking the earlier Parts' "(Part 4)" mentions, any change to Parts 1–3, Stage B and Stage C Parts in the Series' Planned Parts, renaming `type Part` in the code.
