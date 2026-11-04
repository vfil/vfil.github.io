# 0005 · Companion repo and Snapshots

Status: implemented (2026-11-04)

Product spec only. How it works lives in the code (`companionRepo` in `src/lib/model.ts`, `CompanionFooter.astro`) and the README's "Write a Series" section; see [GLOSSARY.md](../GLOSSARY.md) for Series, Part, Companion repo and Snapshot, and [spec 0003](0003-agent-loop-post.md) for the Post this first applies to.

## Problem statement

Vlad is building the agent from _Building an agent from scratch_ in parallel, in a public repo, [vfil/sigma-agent](https://github.com/vfil/sigma-agent). The blog doesn't say so. A reader of Part 1 can't tell that the finished code exists, let alone browse it as they read. The repo moves on with every Part, so a link to its latest state would show code that no longer matches the Post. For Part 1 Vlad has already tagged the repo (`Part1_the_loop`) and will do the same for every Part.

## Solution

A Series can name its Companion repo, and each Part can name the Snapshot (the Git tag) that matches it. Every page of such a Series then says where the code lives:

- **Top of a Part**: a plain sentence in the Foreword, written by hand, linking to the Snapshot ("The code for this Part is available as the `Part1_the_loop` snapshot of vfil/sigma-agent, the repo where I build this agent in parallel."). A generated label read as ambiguous, so the top is prose and states a fact; it doesn't tell the reader what to do with it.
- **Bottom of a Part**, above the previous/next links: "Explore the code as it stands in this Part: `Part1_the_loop` in vfil/sigma-agent ↗", linking to the Snapshot.
- **Series page**: a sentence in the Series introduction, written by hand, saying the agent is built in parallel there and that each Part has a Snapshot.

A Part with no Snapshot (a new Draft) links to the repo root instead. A Series with no Companion repo looks exactly as it does today. Nothing is validated beyond the frontmatter's shape: the Snapshot is not checked against GitHub (a typo is a 404), and a Snapshot on a Part whose Series has no repo is simply not shown.

Code in the Posts stays inline and unlinked: readers skim the code as they read and shouldn't be sent away from it. The Snapshot is for exploring beyond what the Post shows.

## User stories

1. As a reader, I want to be told in the Foreword that the code for this Part exists as a real repo, so I can decide whether and how to use it.
2. As a reader, I want a link to the code exactly as it was when this Part was written, so what I browse matches what I read.
3. As a reader who finishes a Part, I want the link at the bottom, where I'm looking for what to do next.
4. As a reader on the Series page, I want to learn from the introduction that the repo exists, before deciding to read the Series.
5. As the author, I want the footer link on every Part generated from the repo URL (once per Series) and the Snapshot name (once per Part), and to write the mentions at the top in my own words.
6. As the author, I want a Series without a repo (or a Part without a Snapshot) to still build and look right.

## Out of scope

Validating that the Snapshot exists, linking from the code blocks inside Posts, a per-Part Snapshot link in the Series' Parts list, repos hosted outside GitHub, showing repo activity (stars, last commit).
