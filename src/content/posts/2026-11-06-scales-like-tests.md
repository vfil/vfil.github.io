---
title: 'Practising scales like writing tests'
description: 'Scales are boring for the same reason unit tests are: they only pay off later.'
pubDate: 2026-11-06
category: music
tags: [practice, guitar, habits]
draft: true
---

Nobody enjoys practising scales, just as nobody enjoys writing unit tests, but in both cases everything gets easier once they're in place.

![A one-octave C major scale written as tab](../../assets/scale-tab.svg)

I keep a practice log the same way I keep a changelog. Every morning I run the scales like a test suite, five minutes before I play anything fun:

```sh
# practice.sh: five minutes, every day, before anything fun
for key in C G D A E; do
  echo "major scale in $key, 60 bpm"
  sleep 60
done
```

The habit stuck once I made the scales short enough that skipping them would feel silly. Now I never skip them.
