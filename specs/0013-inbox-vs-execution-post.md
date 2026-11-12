# 0013 · Part 9 of the agent Series: "Inbox vs. execution"

Status: implemented (2026-11-12), published

Product spec only. The Post is `src/content/posts/2026-11-12-inbox-vs-execution.mdx` in the Series `src/content/series/building-an-agent-from-scratch.md`; see [GLOSSARY.md](../GLOSSARY.md) for Post, Draft, Series, Part, Planned Part, Tag, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md), [spec 0006](0006-roadmap-post.md) to [spec 0012](0012-session-event-log-post.md) for how Parts 1–8 were ported.

## Problem statement

Part 8 ends with an agent whose session survives the process, but only from the moment the agent takes a prompt. A line typed while a turn runs sits in the terminal's input buffer, and a line the program has read but not yet appended sits in memory; a restart finds neither. Part 2's roadmap lists _Inbox vs. execution_ as the second Part of Stage B (Session): saving a prompt and running the model become two separate acts, so a prompt is durable the moment it is accepted and a queued prompt survives a crash and runs on restart. Vlad finished that Part as a lesson in his OpenCode fork (`lessons/0009-inbox-vs-execution.html`), with the code tagged in the Companion repo as `Part9_inbox_vs_execution`. It needed to become Part 9, reading and looking like Parts 1–8.

The Series has no `planned` list, so the Series page needs no change beyond showing Part 9.

## Solution

A faithful port of the lesson as one Post, lightly edited for the blog, with the same kinds of edits as specs 0006 to 0012. It was a Draft until Vlad had read it, and is now published.

- **Front matter**: category Agentic AI, tags `agents`, `effect`, `typescript`, `sqlite`, `drizzle`, `ollama`, Series _Building an agent from scratch_, Part 9, title "Inbox vs. execution" (sentence case, the name Part 2's roadmap uses), Snapshot `Part9_inbox_vs_execution`, spelled as the tag is on the remote. `pubDate` is 2026-11-12. The Foreword calls it the second Part of Stage B (Session) in [the roadmap](/posts/the-roadmap/) and links the Snapshot in a plain sentence, like Parts 1 and 3 to 8 ([spec 0005](0005-companion-repo.md)). There is no "your prediction" section.
- **Content**: a prompt typed while the agent is busy and what a restart finds today, as a table of where a prompt can be when the process dies; why this belongs to the session (the two Anthropic posts the lesson quotes); four words (inbox, admit, deliver, wake); the six decisions (a prompt is in the inbox or in the log; delivery is one transaction; the wake is a hint and the inbox is the truth; one prompt per turn, oldest first, only when the agent is idle; a reader and a worker as two fibers, with the input-ended flag read before delivering; a terminal that gives each line to the newest question); what this leaves for later; the six quizzes; the hands-on build in seven steps (the inbox table and the move of the table file, `admit`/`deliver`/`pending` on the Session, tests of the inbox on a file with deliberate breakages, the line router, a reader and a worker, prompts that survive a restart, then queueing three prompts, killing the agent and starting it again) with the finished files collapsed; callouts; Sources.
- **Scope**: nothing in the lesson is cut except the lesson-pack scaffolding. The line router stays, because the reader and the approval question share the keyboard in Step 5.
- **Vocabulary**: "Part", not "post", "lesson" or "module" (for a Part), so the lesson's "this post" becomes "this Part". Parts 1–8 are linked. Inbox, admit, deliver, wake, transaction, fiber and coalesce are defined inline, and the lesson's "the glossary has four new terms" becomes a definition in the Post; `GLOSSARY.md` does not change, because these are agent vocabulary and not blog terms. "Part" never means a message part (those appear only as code identifiers such as `TextPart`), and "Tag" appears only inside code identifiers such as `catchTag`.
- **Quizzes**: the lesson's six "Check yourself" questions as `<Quiz>` ([spec 0004](0004-quiz-component.md)).
- **Stance**: the Post describes what the inbox does in this agent, what each kind of test covers and what OpenCode does differently (its projected `session_inbox` table, the "queue" and "steer" modes, its coordinator and claims). It does not argue that an inbox or event sourcing suits other programs.
- **Tone**: applies to Part 9 only. "I" appears only for the Foreword's sentence about the Companion repo; claims are attributed or hedged; verdict-style sentences are descriptions; imperatives appear only where the reader acts (build steps, callouts). Specific edits to the lesson: "This post closes that gap. The goal is…" and "An agent with an inbox keeps it" become plain descriptions; "a missed wake does no harm" is hedged; "The fix is a small router" becomes a description of what the router does; the Bun 1.4.4 readline claims (with two questions open the first line goes to the older one, and a line that arrives with no question open is dropped) are re-verified and worded as the behaviour observed in that version, or cut; "In OpenCode prompts steer by default" stays attributed to its source; the Sources exercise stays a suggested exercise, as in Parts 6 to 8.
- **Commands**: as in the lesson, with `bun run typecheck` and `bun run test` as in Part 8; the starting point is Part 8's finished files. Part 9 adds no dependency, so the finished `package.json` is not repeated; Step 1 generates a second migration with `bun run db:generate --name inbox`.
- **Test environment**: one short line before the hands-on steps (machine, Bun 1.4.4, Effect 4.1.0, drizzle-orm and drizzle-kit 1.0.0-rc.5, `@effect/sql-sqlite-bun` 4.1.0, Ollama 0.40.14, `qwen3.5:9b`, the date), as in Part 8. There are no Measured, Checked or Not re-run paragraphs.
- **Corrections to the lesson**: the closing material that names "Part 10" and describes it is replaced. The Post names the next topic as the roadmap does ("Context limits and compaction") with no Part number, and nothing is added to the Series; the limits (a prompt that always kills the process is resumed on every start, a line typed while the model streams appears mid-reply, steering a running turn is not built, a session never shrinks) stay in "What this leaves for later" as limits. The Series stays Ongoing.
- **Sources**: OpenCode is linked at commit `97be25f046`, as in Parts 5 to 8, with the lesson's line anchors where they hold at that commit. The first item is the primary source: `session/inbox.ts`, `session/execution.ts` and `session/execution/restart.ts`; then `AGENTS.md` (the Session Core section on admission, delivery and wakeups); then Anthropic's _Scaling Managed Agents_ and _Building effective agents_ as the lesson cites them. The lesson's "Versions" line becomes the Test environment line.
- **Cut**: the lesson-pack scaffolding (navigation, reference and glossary links, the kicker).
- **Series**: unchanged; the page shows Parts 1–9 written.
- **Earlier Parts**: Part 8 got two small edits, because two sentences would otherwise have been out of date: the mention of the roadmap's _Inbox vs. execution_ in "What this leaves for later" links Part 9, and the closing sentence no longer lists it among the topics whose Parts are not yet scheduled. Part 2's roadmap entry (including the line that Stage B Parts are not yet scheduled) and Part 7's closing sentence stay as published.

### Claims

The Post states only what was checked before publishing, and anything that could not be re-run was cut or hedged instead of carried over from the lesson. Its purpose is to teach, so it carries a Test environment line but no Measured, Checked or Not re-run paragraphs:

- the `Part9_inbox_vs_execution` tag on the remote: its `src`, `test` and `drizzle` files equal the Post's finished files; the differences in `package.json` (`bun check`, `@effect/tsgo`), the folder name (`sigma-agent` against `my-agent`) and the migration timestamps are noted in the Post, not hidden; the starting point matches Part 8's finished files
- Steps 1–7 replayed on Part 8's finished files, with every state type-checking, the files after each step equal to the "Stuck?" files, and any test the Post says fails on purpose failing exactly as shown
- the finished files type-checking and the tests passing, with the counts the Post states, and the deliberate breakages of Step 3 failing as shown
- the second migration generated by `bun run db:generate --name inbox`, and that moving the table file reports no schema change, as the lesson says
- the Bun 1.4.4 behaviour of `readline` questions behind the line router, reproduced or reworded
- the live Ollama run, and the run that queues three prompts, kills the agent and starts it again; the Post says the model's wording differs and what could not be re-run
- the statement that the worker reads the input-ended flag before delivering, with the lost-prompt case it prevents, backed by a test or a replay
- OpenCode links, line anchors and quotations at `97be25f046`: the AGENTS.md rules ("Keep durable prompt admission separate from model execution", the `session_inbox` and delivery-in-one-transaction sentences), the `wake` comment in `session/execution.ts` ("Repeated wakeups may coalesce"), the "queue" and "steer" modes and steer as the default
- the two Anthropic quotations and their attribution
- the Part numbers and titles against the Series file, and the statements about Part 8 and Part 2 against those Posts

Known gap: the `Part9_inbox_vs_execution` tag's `src/terminal.ts` is still Part 8's readline version and does not use `src/lines.ts`, so the Post's Step 4 and Step 7 describe code the Snapshot does not yet contain. Delete this paragraph once the tag includes the router.

## User stories

1. As a reader who finished Part 8, I want to see where a prompt can be when the process dies, and which of those places a restart can find, so I understand what the inbox adds to the log.
2. As a reader, I want to know why a waiting prompt is kept apart from the event log, so I can judge the design instead of copying it.
3. As a reader, I want to know why delivering a prompt is one transaction, and what a kill in the middle would otherwise do, so a queued prompt is never lost or run twice.
4. As a reader, I want to know what a wake carries and why a missed one is harmless, so I understand why the inbox, not the signal, holds the work.
5. As a reader, I want to know why prompts run one per turn and only when the agent is idle, and how OpenCode's "steer" mode differs.
6. As a reader, I want the reader and the worker explained as two tasks with a clear ending rule, so I can see why the input-ended flag is read before delivering.
7. As a reader, I want to know why two questions open at once need a line router, so a `y` meant for an approval is not taken as a new prompt.
8. As a reader following along, I want each build step to end with code that type-checks and runs, so I can stop after any of them.
9. As a reader, I want to queue three prompts, kill the agent and start it again, and see the prompts run in order, so I believe the inbox works.
10. As a reader, I want the code as it stood when the Part was written, through the Snapshot link.
11. As a reader, I want the prose to describe and attribute rather than boast, argue for a pattern in general, or instruct where I'm not acting, so the Part reads like the others.

## Out of scope

The lesson's reference pages (tool design, agent architecture, glossary), an agentic-AI glossary, new components, a Claude transcript, recall quizzes from earlier Parts, any change to Parts 1–7 or to Part 8 beyond the two sentences above, scheduling or numbering later Stage B Parts, steering a running turn, a crash-loop guard, OpenCode's projected tables, coordinator and claim machinery, compaction, advice on adopting an inbox or event sourcing in other projects.
