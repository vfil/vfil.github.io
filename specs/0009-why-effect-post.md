# 0009 · Part 5 of the agent Series: "Why Effect: errors as values"

Status: implemented (2026-11-05), published

Product spec only. The Post is `src/content/posts/2026-11-05-why-effect.mdx` in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md), [spec 0007](0007-tools-as-data-post.md) and [spec 0008](0008-providers-behind-one-interface-post.md) for how Parts 1–4 were ported.

## Problem statement

Part 4 ends with an agent in which four kinds of failure are handled four different ways and none of them shows in a type: a tool that throws is caught and sent to the model, a bug inside that same `try` is sent to the model as if it were the model's mistake, a failed model request exits the program, and closed input throws out of `readline`. Part 2's roadmap and Part 3 promise that _Why Effect: errors as values_ (Part 5) fixes this. Vlad finished that Part as a lesson in his OpenCode fork (`lessons/0005-why-effect.html`), with the code tagged in the Companion repo as `Part5_use_effects`. It needed to become Part 5, reading and looking like Parts 1–4.

The Series' `planned` list still contained "Why Effect: errors as values", so the Series page would have shown it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same edits as specs 0006, 0007 and 0008. It was a Draft until Vlad had read it, and is now published.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `ollama`, Series _Building an agent from scratch_, Part 5, title "Why Effect: errors as values" (the name used by the Series, Part 2 and Part 3, not the lesson's shorter "Why Effect"), Snapshot `Part5_use_effects`. The Foreword links to the Snapshot in a plain sentence, like Parts 1, 3 and 4 ([spec 0005](0005-companion-repo.md)). There is no "your prediction" section: Part 2's predictions are answered or belong to the Session stage.
- **Content**: the four failures of Part 4 (a table) and the `listFiles` crash from Part 1; what Effect adds, in four ideas with a runnable snippet each; the five decisions in the rewrite; the agent's `Tool` compared with OpenCode's `ai/src/tool.ts`; seven quizzes; the hands-on build (the split into eight files under `src`, the failure classes and `ask`, `tool.ts`, the tools declared with Schemas, `chat` and the loop as Effects, and a closing step that causes each kind of failure on purpose) with the finished files collapsed; callouts; Sources with the primary source first.
- **Vocabulary**: "Part", not "post", "module" or "lesson". Other Parts are italic titles with their number, unlinked; Parts 1–4 are linked at their first mention in a section. Effect and agent vocabulary (tool failure, defect, provider error, Schema) is defined inline; `GLOSSARY.md` does not change. Because the blog's **Tag** is a keyword on a Post, the prose says once, at first use, that Effect's `_tag` is unrelated to a Post's Tags, and writes `_tag` and `catchTag` only as code identifiers.
- **Quizzes**: the lesson's seven "Check yourself" questions (three sorting an event by who reads its error; four multiple choice) as `<Quiz>` ([spec 0004](0004-quiz-component.md)).
- **Stance**: the Post describes what Effect adds to this agent and who reads each kind of error. It does not argue that Effect suits other projects or that plain TypeScript falls short in general.
- **Tone**: applies to Part 5 only; Parts 1–4 are left as published. "I" appears only for measured facts and the Foreword's sentence about the Companion repo; claims are attributed or hedged; verdict-style sentences are descriptions; imperatives appear only where the reader acts (build steps, callouts).
- **Corrections to the lesson**: the build steps ran `bun run typecheck` and `sh reset-playground.sh`, which Parts 1–4 never gave readers, so they use `bunx --package typescript tsc --noEmit` and "delete `playground/notes/hello.txt`"; the `effect4.ts` snippet gained the `console.log` its transcript needs; "OpenCode pins Effect 4.1.0" became tied to the commit the links point to.
- **Sources**: OpenCode is linked at commit `97be25f046`, not Parts 2–4's `863ea41364`: the lesson's `Tool` comparison (with `input`) and the Effect 4.1.0 pin only match the newer commit, and the Post says so in its Checked paragraph. The Post makes no statement about the Claude route beyond `PROVIDER=claude` still selecting the Anthropic route, and shows no Claude transcript.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Why Effect: errors as values" left `planned`, so the Series page shows Parts 1–5 written and Parts 6–7 planned: _Services and layers_, _Streaming_.
- **Earlier Parts**: unchanged. Part 3's italic, unlinked "(Part 5)" mention and Part 2's roadmap entry stay.

### Claims

The Post states only what was checked on 2026-11-05: the `Part5_use_effects` tag on the remote; Steps 1–5 replayed on Part 4's finished `index.ts` against the Snapshot, with the listed compiler errors appearing as shown and the finished files type-checking on Effect 4.1.0 and 4.1.2; every Effect snippet and every `check.ts` run; the failures table against Part 4's finished file; the Step 5–6 transcripts rerun on Ollama and llama.cpp; the Effect documentation quotations and the migration guide; OpenCode links and quotations at `97be25f046`; the Part numbers and titles against the Series file.

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

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from earlier Parts, linking the earlier Parts' "(Part 5)" mentions, any change to Parts 1–4, Stage B and Stage C Parts in the Series' Planned Parts, `Context`, services and layers (Part 6), streaming (Part 7), advice on adopting Effect in other projects.
