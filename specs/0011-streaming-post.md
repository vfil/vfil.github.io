# 0011 · Part 7 of the agent Series: "Streaming"

Status: planned

Product spec only. The Post will be `src/content/posts/2026-11-09-streaming.mdx` in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md), [spec 0007](0007-tools-as-data-post.md), [spec 0008](0008-providers-behind-one-interface-post.md), [spec 0009](0009-why-effect-post.md) and [spec 0010](0010-services-and-layers-post.md) for how Parts 1–6 were ported.

## Problem statement

Part 6 ends with an agent whose loop can be tested against a scripted model, but which still sends a request, waits until the model has written the whole reply and only then prints it. A model writes one token at a time, so the silence lasts as long as the reply. Part 2's roadmap and Part 6 promise that _Streaming_ (Part 7) fixes this: the model client returns a stream of events instead of one reply, and each protocol decodes the server's messages into those events. Vlad finished that Part as a lesson in his OpenCode fork (`lessons/0007-streaming.html`), with the code tagged in the Companion repo as `Part7_Streaming`. It needs to become Part 7, reading and looking like Parts 1–6.

The Series' `planned` list still contains "Streaming", so the Series page would show it a second time as a Planned Part.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same kinds of edits as specs 0006 to 0010. It is a Draft until Vlad has read it, then published.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `streaming`, `ollama`, Series _Building an agent from scratch_, Part 7, title "Streaming" (the name used by the Series, Part 2 and Part 6), Snapshot `Part7_Streaming`, spelled as the tag is on the remote (its capital S differs from Parts 1–6). `pubDate` is 2026-11-09. The Foreword calls it the fifth Part of Stage A (Harness), counting from Part 3 as Parts 3 to 6 do, and links the Snapshot in a plain sentence, like Parts 1 and 3 to 6 ([spec 0005](0005-companion-repo.md)). There is no "your prediction" section.
- **Content**: the silence of the Part 6 agent, with a timing table of first text against whole reply on Ollama and llama.cpp; what the server sends (server-sent events, the recorded Ollama and llama.cpp streams, and how the two send a tool call differently) and the rules of the format; what streams add in four ideas with a runnable snippet each (values handed over as produced, a failure after some values, bytes cut into lines wherever the pieces end, state carried from one value to the next); the six decisions in the rewrite (three events, one path, a protocol as a step function from frames to events, a loop that folds events into a message and runs tools after the finish, a reply that breaks off in the middle, two kinds of test); the five quizzes; the hands-on build in four steps (events, reading the stream from the wire, tests for the stream, breaking things and running it live) with the finished files collapsed; callouts; Sources with OpenCode's `ai/src/route/client.ts` and `ai/src/route/framing.ts` first, then the HTML Standard and Anthropic's Streaming Messages page.
- **Vocabulary**: "Part", not "post", "lesson" or "module" (for a Part), so the lesson's "this post" becomes "this Part". Other Parts are italic titles with their number, unlinked; Parts 1–6 are linked. Stream, server-sent events, frame, step function and _model event_ are defined inline, and the lesson's "the glossary calls what a step produces a model event" becomes a definition in the Post; `GLOSSARY.md` does not change. "Tag" appears only inside code identifiers, as in Parts 5 and 6.
- **Quizzes**: the lesson's five "Check yourself" questions as `<Quiz>` ([spec 0004](0004-quiz-component.md)).
- **Stance**: the Post describes what streams do in this agent and what each kind of test covers. It does not argue that streaming or Effect's `Stream` suit other programs.
- **Tone**: applies to Part 7 only; Parts 1–6 are left as published. "I" appears only for measured facts and the Foreword's sentence about the Companion repo; claims are attributed or hedged; verdict-style sentences are descriptions; imperatives appear only where the reader acts (build steps, callouts). Specific edits to the lesson: the remark that the parser is short "so you can see what SSE is" becomes a description of what the parser covers; the Sources exercise is phrased as a suggested exercise, as in Part 6; the two-bullet "single newline / double newline" block in the third idea is rewritten as prose in the voice of the rest of the Post.
- **Corrections to the lesson**: the sentence "Part 2 measured about 8 tokens per second on a 16 GB M1" comes from the lesson pack's Part 2; the blog's Parts 1 and 2 state no such figure, so it is cut together with the half-minute extrapolation. The wait is described as growing with the length of the reply, and the timing table, measured in the Part 1 environment, stays. The closing paragraph ("Part 8 starts Stage B… a SQLite log") is replaced: the Post keeps "completes Stage A" and says that the Session stage comes next, with its Parts not yet scheduled, as Part 2 says. It names no Part number and no storage.
- **Sources**: OpenCode is linked at commit `97be25f046`, as in Parts 5 and 6, including the line anchors the lesson uses if they hold at that commit. The Post makes no statement about the Claude route beyond what the Snapshot's tests and Anthropic's Streaming Messages page show, and shows no Claude transcript.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: "Streaming" leaves `planned`, so the Series page shows Parts 1–7 written and nothing planned. The Series stays Ongoing, because the Session and Sandbox stages are not yet scheduled as Parts.
- **Earlier Parts**: unchanged. Part 6's italic, unlinked "(Part 7)" mention and Part 2's roadmap entry stay.

### Claims

The Post states only what is checked before publishing, and anything that cannot be re-run is cut or hedged instead of carried over from the lesson:

- the `Part7_Streaming` tag on the remote: its `src`, `test` and `test/fixtures` files equal the Post's finished files, and the starting point of "ten files in `src` and two in `test`" matches Part 6's finished files
- Steps 1–4 replayed on Part 6's finished files, with every state type-checking and the files after each step equal to the "Stuck?" files
- the finished files type-checking and the tests passing on Effect 4.1.0, and the deliberate breakages failing as shown
- every snippet in "What streams add"
- the `curl` transcripts re-recorded against live Ollama and a second llama-server on port 9932, including the difference in how the two split a tool call (the model's wording may differ), and the first-text against whole-reply table re-measured; the Post says what could not be re-run
- the fixtures cut at every byte position, and the local-server tests (stream, cut-off, bad JSON, error status, no server)
- the Effect 4.1.0 statement that `effect/encoding/Sse` is unstable
- OpenCode links, line anchors and quotations at `97be25f046`
- the SSE parsing rules against the HTML Standard, and the event types against Anthropic's Streaming Messages page
- the Part numbers and titles against the Series file, and the Stage A count against the Forewords of Parts 3 to 6

## User stories

1. As a reader who finished Part 6, I want to see how long the agent stays silent before the first words and what streaming changes, so I understand why the model client returns a stream.
2. As a reader, I want to see what a server actually sends, including how Ollama and llama.cpp split a tool call, so the decoding makes sense.
3. As a reader, I want the Effect `Stream` ideas the rewrite uses explained one at a time with a runnable snippet each, so I can follow the code without prior knowledge of streams.
4. As a reader, I want to know why the agent has three events, and what OpenCode's larger set is for, so I can judge the design instead of copying it.
5. As a reader, I want to know what happens to the history and the screen when a reply breaks off halfway, so a streamed turn fails as cleanly as a whole one.
6. As a reader following along, I want each build step to end with code that type-checks and runs, so I can stop after any of them.
7. As a reader, I want to know which tests cover the loop and which cover the wire, and what neither covers, so I don't mistake a passing test for a working model.
8. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
9. As a reader of the Series page, I want the list of Parts to show each Part once, in order, with nothing planned that has been published.
10. As a reader, I want the prose to describe and attribute rather than boast, argue for a pattern in general, or instruct where I'm not acting, so the Part reads like the others.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from earlier Parts, linking the earlier Parts' "(Part 7)" mentions, any change to Parts 1–6, scheduling Stage B and Stage C Parts, a Part number or storage format for the Session stage, running tools while the model is still writing, reasoning events, showing tool arguments as they are written, Effect's own SSE module in place of the agent's parser, advice on adopting streaming or `Stream` in other projects.
