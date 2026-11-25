# 0014 · Part 10 of the agent Series: "Context limits and compaction"

Status: planned

Product spec only. The Post will be `src/content/posts/2026-11-25-context-limits-and-compaction.mdx` in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md) to [spec 0013](0013-inbox-vs-execution-post.md) for how Parts 1–9 were ported.

## Problem statement

Part 9 ends with an agent that accepts prompts at any time and keeps them across a restart, but its session never shrinks. Since Part 8 the agent rebuilds the whole history from the event log before every step and sends all of it, so a long task eventually sends more than the model's context window holds. Ollama answers such a request without any error, and llama.cpp and Anthropic refuse it, after which every later turn fails the same way. Part 2's roadmap lists _Context limits and compaction_ as the third and last topic of Stage B (Session). Vlad finished that Part as a lesson in his OpenCode fork (`lessons/0010-context-limits-and-compaction.html`), with the code tagged in the Companion repo as `Part10_context_limit_compaction`. It needs to become Part 10, reading and looking like Parts 1–9.

The Series has no `planned` list, so the Series page needs no change beyond showing Part 10.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same kinds of edits as specs 0006 to 0013. It is a Draft until Vlad has read it.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `sqlite`, `drizzle`, `ollama`, `llama-cpp`, Series _Building an agent from scratch_, Part 10, title "Context limits and compaction" (sentence case, the name Part 2's roadmap uses), Snapshot `Part10_context_limit_compaction`, spelled as the tag is on the remote. `pubDate` is 2026-11-25. `llama-cpp` is a new Tag, because this Part depends on llama.cpp's refusal and runs both providers. The Foreword calls it the third and last Part of Stage B (Session) in [the roadmap](/posts/the-roadmap/) and links the Snapshot in a plain sentence, like Parts 1 and 3 to 9 ([spec 0005](0005-companion-repo.md)). There is no "your prediction" section.
- **Content**: a session that outgrows the model (every step sends the whole history; context window and token defined); what providers do with a request that is too long, shown as the two plain `curl` requests (Ollama with a 4k context answering with status 200, llama.cpp refusing with status 400 and `exceed_context_size_error`), and why the agent therefore checks the size before it sends; summarizing instead of dropping messages, and why the event log makes a summary safe; the three terms (context window, compaction, summary); the six decisions (the agent estimates the size at four characters per token over the history and tools as JSON; the check runs before every step and compacts at 75% of the window; the summary is a `compacted` event and the fold starts from the latest one; the summary is written from a plain text transcript with clipped tool input and output and a six-heading template; nothing before the summary is kept word for word except the latest request; failed summaries and restarts); what this leaves for later; the five quizzes; the hands-on build in six steps (the compacted event and the fold, the context window, the estimate and the summary, compact before every step, restarts after a compaction, a small window and a real model) with the finished files collapsed; Possible extensions; "OpenCode does more"; callouts; Sources.
- **Scope**: nothing in the lesson is cut except the lesson-pack scaffolding (navigation, reference and glossary links, the kicker) and the detail inside "OpenCode does more" (below).
- **OpenCode does more**: kept as a short list of what OpenCode adds beyond this Part: native compaction where a provider offers it, summaries written in the background before they are due, shortening an oversized transcript oldest exchanges first, asking once more when a summary ignores the headings, and updating the previous summary on a later compaction. One clause each, with no numbers, timings or mechanics (the lesson's "30 to 60 seconds", the prompt-cache timing and the four shortening levels are cut).
- **OpenCode links**: OpenCode files are linked with URLs pinned to `97be25f046`, as in Parts 5 to 9, but the prose names only files (`session/compaction.ts`, `runner/to-llm-message.ts`, `util/token.ts`) and never a commit. Constant names the lesson cites (`RESERVE_MIN`, `RESERVE_SHARE`, `TRANSCRIPT_CLIP`, `SUMMARY_TEMPLATE`, `SUMMARY_RULES`, `Settings.keep`) and the two quotations stay in the six decisions, because they compare this agent's choices with OpenCode's.
- **Vocabulary**: "Part", not "post", "lesson" or "module" (for a Part), so the lesson's "this post" and "This part adds…" become "this Part" and "This Part adds…". Parts 1, 8 and 9 are linked where the lesson mentions them. Context window, token, compaction and summary are defined inline, and the lesson's "The glossary has three new terms" becomes a definition in the Post; `GLOSSARY.md` does not change, because these are agent vocabulary and not blog terms. "Part" never means a message part, and "Tag" appears only inside code identifiers.
- **Quizzes**: the lesson's five "Check yourself" questions as `<Quiz>` ([spec 0004](0004-quiz-component.md)).
- **Stance**: the Post describes what compaction does in this agent, what each test covers and what OpenCode does differently. It does not argue that compaction, a 75% threshold or a four-characters-per-token estimate suits other agents.
- **Tone**: applies to Part 10 only. "I" appears only in the Foreword's sentence about the Companion repo; claims are attributed or hedged; verdict-style and strongly opinionated sentences become descriptions; imperatives appear only where the reader acts (build steps, callouts). Specific edits to the lesson: "the design depends on that difference", "So the agent cannot wait for an error… The agent has to check the size itself" and "The session cannot recover on its own" become descriptions of what happens; "The common approach is…" is attributed (OpenCode, Claude Code) rather than stated as a rule; the "Watch for this" callout describes the case and keeps advice to one sentence; the Ollama/MLX observation (the model read the whole over-length message) is worded as what was observed with that runner and version. After the port, the Draft gets a `/humanizer-custom` pass.
- **Commands**: as in the lesson, with `bun run typecheck` and `bun run test` as in Part 9; the starting point is Part 9's finished files. Part 10 adds no dependency and no migration, so the finished `package.json` is not repeated. The two `curl` requests and the live runs (`CONTEXT_WINDOW=2000` and `CONTEXT_WINDOW=1100`, `DB_PATH`, `PROVIDER=llamacpp`) and the `sqlite3` queries stay with their output, shortened where lines are long.
- **Test environment**: one short line before the hands-on steps (machine, Bun 1.4.4, Effect 4.1.0, drizzle-orm and drizzle-kit 1.0.0-rc.5, `@effect/sql-sqlite-bun` 4.1.0, the Ollama versions, llama.cpp b9830, `qwen3.5:9b`, the date), replacing the lesson's "Versions" line. There are no Measured, Checked or Not re-run paragraphs, and the Post says nothing about how its claims were checked: results are stated as facts.
- **Closing**: the lesson's "Part 10 ends Stage B. Stage C… starts with permissions" becomes "This Part ends Stage B", with Stage C's first topic named as the roadmap names it (_Permissions_), linked to [the roadmap](/posts/the-roadmap/) and given no Part number. Nothing is added to the Series, and it stays Ongoing. The limits (a summary loses detail; one tool result larger than the window still overflows; the estimate does not know the real tokenizer; the user waits while the summary is written) stay in "What this leaves for later" as limits.
- **Sources**: the first item is the primary source, OpenCode's `session/compaction.ts`, with the lesson's anchors (the reserve, the transcript clip, the summary template and rules, no compaction right after one); then `runner/to-llm-message.ts` (how a summary reaches the model) and `util/token.ts` (four characters per token); then Ollama's docs on context length.
- **Earlier Parts**: two published Posts would otherwise be out of date, and change in the step that publishes Part 10, not before:
  - Part 9: the limit "a session never shrinks… which the roadmap's _Context limits and compaction_ covers" links Part 10, and the closing sentence no longer says that topic has no Part scheduled.
  - Part 2 (the roadmap): the Stage B intro says Parts 8 to 10 cover its three topics, and the _Context limits and compaction_ entry links Part 10, as the Part 8 and Part 9 entries do.

  No other Part changes.

### Claims

The Post states only what was checked before publishing, and anything that cannot be re-run is cut or worded as observed on a named version instead of carried over from the lesson. The checks below are done silently; none of them is described in the Post:

- the `Part10_context_limit_compaction` tag on the remote: its `src` and `test` files equal the Post's finished files; differences in `package.json` and the folder name (`sigma-agent` against `my-agent`) are noted in the Post, as in Part 9; the starting point matches Part 9's finished files, including `src/lines.ts`
- Steps 1–6 replayed on Part 9's finished files, with every state type-checking, the files after each step equal to the "Stuck?" files, and the tests the Post names (four in `history.test.ts`, two in `provider.test.ts`, the new `compaction.test.ts`, three in `resume.test.ts`) passing with the counts the Post states
- the two `curl` requests: Ollama with `OLLAMA_CONTEXT_LENGTH=4096` returning status 200 with no sign of overflow (and whether the model found the word), llama.cpp with `-c 32768` returning 400 `exceed_context_size_error`; the character and token counts quoted (334,977 characters, 100,926 tokens, about 3.3 characters per token, the estimate about 20% low)
- that the five tool definitions come to about 650 tokens by the agent's own estimate
- that no migration is needed: a `compacted` event is one more row in the event table
- the live runs on Ollama: the `CONTEXT_WINDOW=2000` runs (no compaction during the first run; compaction before the question in the second; the answer from the summary; the event sequence in `sqlite3`; the summary following the template, including Latest request), the same runs with `PROVIDER=llamacpp` compacting at the same point, and the `CONTEXT_WINDOW=1100` run compacting mid-turn with a summary longer than the history it replaced; token numbers and model wording may differ and are updated to the re-run
- the failure and restart rules of decision 6 (a failed or empty summary fails the turn with no `compacted` event; `turn-failed` after a compaction cuts back to the summary; `resume` leaves a turn whose last event is `turn-failed` alone; no compaction when the latest event is `compacted`), each backed by a test
- OpenCode links, anchors, constant names and the two quotations at `97be25f046` ("A compaction just completed; let the runner rebuild the request from it first", "The transcript has no tool definitions, which the summary does not need"), the 15% share with a 16,000-token minimum, the 2,000-character clip, the 15,000-token `Settings.keep`, the summary introduction in `runner/to-llm-message.ts`; and each item kept in "OpenCode does more" found in the source, or cut
- the statements about providers: Anthropic refusing an over-long request, Anthropic's Messages API expecting the first message from the user, usage reporting in OpenAI-style `stream_options` and Anthropic's `message_start`/`message_delta`
- the Part numbers and titles against the Series file, and the statements about Parts 1, 8 and 9 and the roadmap against those Posts

## Steps

Start from a `main` that includes the `polish-wording` branch, since that branch rewords the roadmap and Part 9 sentences that Step 3 edits.

1. Port the lesson as a Draft Post (`draft: true`) with the front matter, Foreword, vocabulary, commands, tone edits, "OpenCode does more", Sources and closing described above; then a `/humanizer-custom` pass.
2. Verify the Claims; correct the Post (Test environment line included, no evidence paragraphs).
3. Publish: `draft` off after Vlad has read it; make the edits to Part 9 and the roadmap; reduce this spec to product intent.

## User stories

1. As a reader who finished Part 9, I want to see what Ollama and llama.cpp do with a request that is too long, so I understand why the agent checks the size before it sends.
2. As a reader, I want to know why the history is summarized instead of trimmed, and why the event log makes a summary safe, so I can judge the design instead of copying it.
3. As a reader, I want to know how the agent estimates a request's size without the model's tokenizer, and how far off the estimate can be.
4. As a reader, I want to know why the check runs before every step and leaves a quarter of the window free.
5. As a reader, I want to see how a `compacted` event changes the history the fold builds, while every earlier event stays in the log.
6. As a reader, I want to know why the summary is written from a plain text transcript with no tools, and why the latest request is quoted word for word.
7. As a reader, I want to know what happens when a summary fails, when a turn fails after a compaction, and when the agent restarts right after one.
8. As a reader following along, I want each build step to end with code that type-checks and runs, so I can stop after any of them.
9. As a reader, I want to lower the window, watch the agent compact with a real model, and read the summary it wrote in the log, so I believe compaction works.
10. As a reader, I want a short view of what OpenCode does beyond this Part, without its internals, so I know where the full version lives.
11. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
12. As a reader, I want the prose to describe and attribute rather than boast, argue for a pattern in general, or instruct where I'm not acting, so the Part reads like the others.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, recall quizzes from earlier Parts, any change to Parts 1–8, any change to Part 9 or the roadmap beyond the edits above, scheduling or numbering Stage C Parts, measured token counts from providers, compacting after a refusal, keeping recent history word for word, skipping compactions that do not help, OpenCode's native and background compaction, staged transcript shortening and summary updates beyond the one-clause mentions, advice on compaction for other agents.
