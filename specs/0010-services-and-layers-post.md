# 0010 · Part 6 of the agent Series: "Services and layers"

Status: implemented (2026-11-06), published

Product spec only. The Post is `src/content/posts/2026-11-06-services-and-layers.mdx` in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md), [spec 0007](0007-tools-as-data-post.md), [spec 0008](0008-providers-behind-one-interface-post.md) and [spec 0009](0009-why-effect-post.md) for how Parts 1–5 were ported.

## Problem statement

Part 5 ends with an agent in which every failure shows in a type, but the loop can only run against the real world: the model, the terminal and the tools are reached by imports, and each import does its work when the file loads. Importing `provider.ts` with an unknown `PROVIDER` throws before a test could run, importing `terminal.ts` attaches readline to standard input, and `index.ts` starts the agent. Part 2's roadmap and Part 5 promise that _Services and layers_ (Part 6) turns these into things the loop asks for, so that a test can run the whole loop against a scripted model. Vlad finished that Part as a lesson in his OpenCode fork (`lessons/0006-services-and-layers.html`), with the code tagged in the Companion repo as `Part6_services_and_layers`. It needed to become Part 6, reading and looking like Parts 1–5.

The Series' `planned` list still contained "Services and layers", so the Series page would have shown it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same kinds of edits as specs 0006 to 0009. It was a Draft until Vlad had read it, and is now published.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `testing`, `ollama`, Series _Building an agent from scratch_, Part 6, title "Services and layers" (the name used by the Series, Part 2 and Part 5), Snapshot `Part6_services_and_layers`. The Foreword calls it the fourth Part of Stage A (Harness), counting from Part 3 as Parts 3 to 5 do, and links the Snapshot in a plain sentence, like Parts 1 and 3 to 5 ([spec 0005](0005-companion-repo.md)). There is no "your prediction" section.
- **Content**: why the Part 5 loop cannot be tested (a table of the four pieces reached by import, and the `PROVIDER=nope` import experiment); services and layers in four ideas with a runnable snippet each (a service is a key, a layer builds one and providing it removes the requirement, a layer can run code and fail, a layer can open and close a resource); the five decisions in the rewrite (three services, methods without requirements of their own, live layers that hold what used to happen at import, a loop that can be imported, a fake that is a layer and what it can and cannot show); the agent's `scriptedModel` compared with OpenCode's `Layer.mock`; six quizzes; the hands-on build in six steps (`agent.ts`, `Terminal`, `ModelClient`, `Tools`, the fakes and three tests, then reading `R`, breaking things and running it live) with the finished files collapsed; callouts; Sources with OpenCode's `core/src/tool.ts` and `session-compact.test.ts` first.
- **Vocabulary**: "Part", not "post", "lesson" or "module" (for a Part). Other Parts are italic titles with their number, unlinked; Parts 1–5 are linked. Service, layer, requirement (`R`) and REPL are defined inline; `GLOSSARY.md` does not change. "Tag" appears only inside code identifiers such as `catchTag`, because Part 5 already told readers that Effect's `_tag` is unrelated to a Post's Tags.
- **Quizzes**: the lesson's six "Check yourself" questions as `<Quiz>` ([spec 0004](0004-quiz-component.md)).
- **Stance**: the Post describes what services and layers do in this agent and what a scripted model can and cannot show. It does not argue that they suit other programs.
- **Tone**: applies to Part 6 only; Parts 1–5 are left as published. "I" appears only for measured facts and the Foreword's sentence about the Companion repo; claims are attributed or hedged; verdict-style sentences are descriptions; imperatives appear only where the reader acts (build steps, callouts).
- **Corrections to the lesson**: Parts 1 to 5 never gave readers `typecheck`, `reset` or `test` scripts, so the Post uses `bunx --package typescript tsc --noEmit` and `bun test`, and leaves out the script step and the finished `package.json`. The Step 3 instruction to replace the routes "down to `chat`" names the comment above `chat`, which the replay showed would otherwise be deleted. "The first two lines are as before" in Step 2 was wrong and is reworded. The lesson's `Layer.mock` statement follows Effect's documentation (a missing member fails with an unimplemented defect). The test durations are the measured ones.
- **Sources**: OpenCode is linked at commit `97be25f046`, as in Part 5: the tool layer asking for three services only matches that commit, and the Post says so in its Checked paragraph. The Post makes no statement about the Claude route beyond `PROVIDER=claude` selecting the Anthropic route and printing `Set ANTHROPIC_API_KEY first` without a key, and shows no Claude transcript.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Services and layers" left `planned`, so the Series page shows Parts 1–6 written and Part 7 planned: _Streaming_.
- **Earlier Parts**: unchanged. Part 5's italic, unlinked "(Part 6)" mention and Part 2's roadmap entry stay.

### Claims

The Post states only what was checked on 2026-11-06: the `Part6_services_and_layers` tag on the remote (commit `93fc2e7`), whose files equal the Post's finished files apart from trailing commas and the position of one import in `agent.ts`; Steps 1–4 replayed on Part 5's finished files, with every state type-checking and the files after Steps 2–4 equal to the "Stuck?" files; the finished files type-checking and the three tests passing on Effect 4.1.0, with the compiler errors and the failing test as shown; every snippet in "What services and layers add"; the `PROVIDER=nope` experiment; the table against Part 5's files; the Ollama and llama.cpp runs repeated with paced input (the model's wording differs from the recorded transcripts); `Layer.mock` and the Services page of the migration guide; OpenCode links and quotations at `97be25f046`, including the Effect 4.1.0 pin; the Part numbers and titles against the Series file.

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

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from earlier Parts, linking the earlier Parts' "(Part 6)" mentions, any change to Parts 1–5, Stage B and Stage C Parts in the Series' Planned Parts, a permission service (a later Part), streaming (Part 7), `Layer.provide` wiring between layers beyond the OpenCode example, advice on adopting services and layers in other projects.
