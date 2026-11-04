# 0002 · Reader Palette picker

Status: implemented (2026-11-04)

Product spec only. How it works lives in the code (`src/lib/palette.ts` and the `PalettePicker` component) and the README's Colours section; see [GLOSSARY.md](../GLOSSARY.md) for Mode, Palette, Default Palette and Custom Palette.

## Problem statement

Vlad picked his Default Palette using a triad colour wheel and enjoyed it enough that he wants every reader to have it. A reader should be able to restyle the blog's colours to their taste while reading, without being able to make the site unreadable. Readers who never touch the picker must pay (almost) nothing for it.

## Solution

A small "colours" button in the header's top-right corner, just before the Mode toggle. It opens a popover with:

- a colour wheel with **three handles 120° apart**. Dragging any handle rotates all three together, and the distance from the centre sets the strength for all three;
- a **background tint** slider;
- a **Reset to default** button.

Changes apply instantly to the whole site, in both Modes. The reader's Custom Palette is saved in their browser and applied before first paint on every page. Text colours are automatically nudged so they always keep at least 4.5:1 contrast. The picker's code is downloaded only when a reader first opens it.

## User stories

1. As a reader, I want a colours button in the top-right corner, so I can find the picker without hunting.
2. As a reader, I want to drag any of three dots around a colour wheel and see the whole blog recolour live, so picking is playful and immediate.
3. As a reader, I want the three dots to stay 120° apart however I drag, so the result is always a balanced triad.
4. As a reader, I want to drag towards the centre for calmer colours and outwards for stronger ones.
5. As a reader, I want a background-tint slider, so I can choose between neutral grey and a tinted background.
6. As a reader, I want my Custom Palette to work in both dark and light Mode, so switching Mode never breaks my choice.
7. As a reader, I want my Custom Palette remembered on every page and every visit in this browser, with no flash of the Default Palette on load.
8. As a reader, I want "Reset to default", so I can always get back to the author's colours.
9. As a reader, I want text to stay readable whatever I pick, so I can't accidentally make the blog unusable.
10. As a keyboard user, I want to open the picker, move the triad with arrow keys, change strength with up/down, and close it with Escape, with focus returning to the button.
11. As a touch user, I want to drag dots with my finger without scrolling the page.
12. As a reader on a phone, I want the popover to fit the screen at 390px wide.
13. As a reader who never opens the picker, I don't want to download its code.
14. As a reader without JavaScript, I don't want to see a button that does nothing.
15. As the author, I want the Default Palette defined once (three numbers), with the site's built-in colours generated from it, so they can never drift apart.
16. As the author, I want saved Custom Palettes to be discarded automatically if I change the colour recipe, so returning readers never get broken colours.

## Out of scope

Sharing a Palette by link, presets or named palettes, syncing across devices, changing fonts or code-block colour themes, a separate picker per Mode.
