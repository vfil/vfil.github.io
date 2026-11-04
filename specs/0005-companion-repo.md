# 0005 · Companion repo and Snapshots

Status: planned

Terms: see [GLOSSARY.md](../GLOSSARY.md) for Series, Part, Companion repo and Snapshot. Spec [0003](0003-agent-loop-post.md) is the Post this first applies to.

## Problem statement

Vlad is building the agent from _Building an agent from scratch_ in parallel, in a public repo, [vfil/sigma-agent](https://github.com/vfil/sigma-agent). The blog doesn't say so. A reader of Part 1 can't tell that the finished code exists, let alone browse it as they read. The repo moves on with every Part, so a link to its latest state would show code that no longer matches the Post. For Part 1 Vlad has already tagged the repo (`Part1_the_loop`) and will do the same for every Part.

## Solution

A Series can name its Companion repo, and each Part can name the Snapshot (the Git tag) that matches it. Every page of such a Series then says where the code lives:

- **Top of a Part**, under the Series box and always visible: `companion repo: vfil/sigma-agent @ Part1_the_loop ↗`, linking to the Snapshot.
- **Bottom of a Part**, above the previous/next links: "Explore the code as it stands in this Part: `Part1_the_loop` in vfil/sigma-agent ↗", linking to the Snapshot.
- **Series page**: the repo in the line under the title, linking to the repo root, plus a sentence in the Series introduction saying the agent is built in parallel there and that each Part has a Snapshot.

A Part with no Snapshot (a new Draft) links to the repo root instead. A Series with no Companion repo looks exactly as it does today. Nothing is validated beyond the frontmatter's shape: the Snapshot is not checked against GitHub (a typo is a 404), and a Snapshot on a Part whose Series has no repo is simply not shown.

Code in the Posts stays inline and unlinked: readers skim the code as they read and shouldn't be sent away from it. The Snapshot is for exploring beyond what the Post shows.

## User stories

1. As a reader, I want to know at the top of a Part that the agent exists as a real repo, so I can see the code is not just illustrative.
2. As a reader, I want a link to the code exactly as it was when this Part was written, so what I browse matches what I read.
3. As a reader who finishes a Part, I want the link at the bottom, where I'm looking for what to do next.
4. As a reader on the Series page, I want to see the repo before deciding to read the Series.
5. As the author, I want to write the repo URL once per Series and one Snapshot name per Part, and have every page derive its links from them.
6. As the author, I want a Series without a repo (or a Part without a Snapshot) to still build and look right.

## Implementation

One step per commit; run `bun run format && bun run check && bun run test && bun run build` before each.

1. **Model and data.** Add optional `repo` (a URL) to the Series collection schema in `src/content.config.ts`, and optional `snapshot` (non-empty string) to Posts. Carry them through `SeriesRecord` / `PostRecord` and `src/lib/content.ts`. Add a pure helper in `src/lib/model.ts`, `companionRepo(repoUrl, snapshot?)`, returning `{ name, url, snapshot?: { name, url } }`: `name` is `owner/repo` from a GitHub URL, the Snapshot URL is `<repo>/tree/<snapshot>`. Tests cover: no Snapshot, a Snapshot, trailing slash and `.git` on the URL, a Snapshot with characters that need encoding.
2. **Part pages.** New `CompanionNote.astro` (the line under the Series box) and `CompanionFooter.astro` (the block above `SeriesNav`), both rendered by `PostLayout.astro` only when the Part's Series has a `repo`. External links get `rel="noopener"` and a visible ↗. Style with Palette tokens only.
3. **Series page and content.** Show the repo in the meta line of `src/pages/series/[slug]/index.astro`. Add `repo: https://github.com/vfil/sigma-agent` to `building-an-agent-from-scratch.md` with an intro sentence ("I build the same agent in parallel in the Companion repo, vfil/sigma-agent, and tag a Snapshot for each Part so you can explore the code as you read."), and `snapshot: Part1_the_loop` to Part 1.
4. **Docs.** README: `repo` under "Write a Series", `snapshot` under the Post frontmatter, and the rule "push the tag before you publish the Part". Trim this spec to product intent and mark it implemented.

## Out of scope

Validating that the Snapshot exists, linking from the code blocks inside Posts, a per-Part Snapshot link in the Series' Parts list, repos hosted outside GitHub, showing repo activity (stars, last commit).
