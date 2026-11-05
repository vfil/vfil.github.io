# 0008 · Part 4 of the agent Series: "Providers behind one interface"

Status: implemented (2026-11-05), published

Product spec only. The Post is `src/content/posts/2026-11-05-providers-behind-one-interface.mdx` in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md) and [spec 0007](0007-tools-as-data-post.md) for how Parts 1–3 were ported.

## Problem statement

Part 3 ends with an agent that exists twice: `index.ts` talks to Ollama and llama.cpp, `claude.ts` talks to Claude, and the five tools, `runTool` and the confirmation prompt are copied in both. Parts 1, 2 and 3 each promise that _Providers behind one interface_ (Part 4) removes that duplication. Vlad finished that Part as a lesson in his OpenCode fork (`lessons/0004-providers-behind-one-interface.html`), with the code tagged in the Companion repo as `Part4_common_interface`. It needed to become Part 4, reading and looking like Parts 1–3.

The Series' `planned` list still contained "Providers behind one interface", so the Series page would have shown it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same edits as specs 0006 and 0007. It was a Draft until Vlad had read it, and is now published.

- **Front matter**: category Agentic AI, tags `agents`, `providers`, `typescript`, `ollama`, Series _Building an agent from scratch_, Part 4, Snapshot `Part4_common_interface`. The Foreword links to the Snapshot in a plain sentence, like Parts 1 and 3 ([spec 0005](0005-companion-repo.md)). There is no "your prediction" section: Part 2's predictions are answered or belong to the Session stage.
- **Content**: the diff between Part 3's two files and its five groups of differences; protocols and routes; the agent's own message types compared with OpenCode's `schema/messages.ts`, and the table mapping them to each protocol; the five decisions in those types; nine quizzes; the hands-on build in four steps (own types, the OpenAI protocol, routes and `PROVIDER`, the optional Claude protocol that also removes `claude.ts`) plus a closing step that runs one prompt on every route and checks the separation; callouts; Sources with the primary source first.
- **Vocabulary**: "Part", not "post", "module" or "lesson". Other Parts are italic titles with their number, unlinked; Parts 1–3 are linked. Provider, protocol and route are recalled in a sentence pointing to Parts 1 and 2. The code's `Part` type stays as written, because the code and the Snapshot cannot change; the prose calls it a "content part" (lowercase) and says once that it is agent vocabulary unrelated to the Series' Parts. Agent vocabulary (protocol, route, content part, native) is defined inline; `GLOSSARY.md` does not change.
- **Quizzes**: the lesson's nine "Check yourself" questions (four sorting a piece of code into the loop, a protocol or a route; five multiple choice) as `<Quiz>` ([spec 0004](0004-quiz-component.md)).
- **Correction to the lesson**: the lesson said the OpenAI decoder bases `finish` on tool calls "not on the server's `finish_reason`, which is the check Part 3 used". Parts 1–3 never read `finish_reason`; they stop when a reply has no tool calls. The Post says that Part 4 names that decision (`finish`) and lets each protocol make it.
- **Tone**: applies to Part 4 only; Parts 1–3 are left as published. "I" appears only for measured facts and the Foreword's sentence about the Companion repo; claims are attributed or hedged; imperatives appear only where the reader acts (build steps, callouts).
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Providers behind one interface" left `planned`, so the Series page shows Parts 1–4 written and Parts 5–7 planned: _Why Effect: errors as values_, _Services and layers_, _Streaming_.
- **Earlier Parts**: unchanged. Their italic, unlinked "(Part 4)" mentions stay.

### Claims

The Post states only what was checked on 2026-11-05: the `Part4_common_interface` tag on the remote; every code block and the Step 1–4 edits replayed on Part 3's finished `index.ts` against the lesson's finished files and the Snapshot, which type-check with the seven Step 1 errors appearing as listed; the diff count; OpenCode links and quotations at the pinned commit `863ea41364`; the Claude, Ollama and llama.cpp documentation claims; the Step 1–3 transcripts rerun on Ollama and llama.cpp; Step 4 run against the live Anthropic API with `claude-sonnet-5-5`, with no transcript shown; the two `grep` separation checks; the Part numbers and titles against the Series file.

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

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from Part 3, linking the earlier Parts' "(Part 4)" mentions, any change to Parts 1–3, Stage B and Stage C Parts in the Series' Planned Parts, renaming `type Part` in the code.
