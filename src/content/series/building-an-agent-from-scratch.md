---
title: 'Building an agent from scratch'
description: 'Learning how LLM agents work by writing one, one piece at a time.'
status: ongoing
repo: https://github.com/vfil/sigma-agent
planned:
  [
    'The roadmap',
    'Tools as data',
    'Providers behind one interface',
    'Why Effect: errors as values',
    'Services and layers',
    'Streaming',
  ]
---

Frameworks hide the interesting parts. In this Series I build a small coding agent in TypeScript with no agent framework, adding one capability per Part, so I understand each piece before I reach for a library that does it for me. I check my design against OpenCode, an open-source coding agent, as the reference.

I build the same agent in parallel in a public repo, [vfil/sigma-agent](https://github.com/vfil/sigma-agent), and tag a Snapshot of it for each Part, so you can explore the code as it stood when I wrote that Part.
