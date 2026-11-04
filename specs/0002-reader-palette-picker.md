# 0002 · Reader Palette picker

Status: ready for implementation, **after spec 0001 is fully implemented**
Date: 2026-11-03

**Read first:** [GLOSSARY.md](../GLOSSARY.md) (especially Mode, Palette, Default Palette, Custom Palette), [ADR 0001](../docs/adr/0001-astro-over-react-frameworks.md), [spec 0001](./0001-blog-foundation.md), and the visual + behavioural reference [mockups/home.html](./mockups/home.html).

The mockup contains a **working reference implementation**: the header palette button, the popover, the wheel and the palette recipe in its last `<script>` block. Port its behaviour faithfully into typed, tested modules. Don't invent a different algorithm.

---

## Problem statement

Vlad picked his Default Palette using a triad colour wheel and enjoyed it enough that he wants every reader to have it. A reader should be able to restyle the blog's colours to their taste while reading, without being able to make the site unreadable. Readers who never touch the picker must pay (almost) nothing for it.

## Solution

A small "colours" button in the header's top-right corner, just before the Mode toggle. It opens a popover with:

- an OKLCH colour wheel with **three handles 120° apart**. Dragging any handle rotates all three together, keeping the angles, and the distance from the centre sets the strength (chroma) for all three;
- a **background tint** slider;
- a **Reset to default** button.

Changes apply instantly to the whole site, in both Modes. The reader's Custom Palette is saved in their browser and applied before first paint on every page. Text colours are automatically nudged so they always keep at least 4.5:1 contrast. The picker code is downloaded only when a reader first opens it.

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
16. As the author, I want saved Custom Palettes to be discarded automatically if I change the colour recipe, so returning readers never get broken tokens.

## Implementation decisions

### Modules

**`src/lib/palette.ts`** is pure, framework-free and has no DOM access. It is the only test seam (see Testing). It exports:

```ts
export type Palette = { hue: number; chroma: number; tint: number }; // hue 0–359 (int), chroma 0–0.25 (3 dp), tint 0–100 (int)
export type TokenName =
  'bg' | 'surface' | 'line' | 'muted' | 'fg' | 'accent' | 'accent-2' | 'accent-fg';
export type Tokens = Record<TokenName, string>; // '#rrggbb'
export const DEFAULT_PALETTE: Palette; // { hue: 359, chroma: 0.211, tint: 10 }
export const RECIPE_VERSION: number; // 1; bump whenever paletteTokens' output can change
export const CHROMA_MAX = 0.25;
export const HANDLE_OFFSETS = [0, 120, 240] as const; // accent, secondary, ground
export function paletteTokens(p: Palette): { dark: Tokens; light: Tokens };
export function paletteCss(p: Palette): string; // the three dark-first :root blocks (see below)
export function rotateTo(
  p: Palette,
  handle: 0 | 1 | 2,
  pointer: { hue: number; chroma: number },
): Palette;
export function nudge(p: Palette, key: 'left' | 'right' | 'up' | 'down', big: boolean): Palette;
export function handlePositions(p: Palette): Array<{ x: number; y: number; color: string }>; // x/y in % of wheel box
export function pointerToPolar(
  dx: number,
  dy: number,
  radiusPx: number,
): { hue: number; chroma: number };
export function nearestHandle(p: Palette, dx: number, dy: number, radiusPx: number): 0 | 1 | 2;
export function isDefault(p: Palette): boolean;
export function serialize(p: Palette): string; // JSON { v: RECIPE_VERSION, hue, chroma, tint, tokens }
export function parseStored(raw: string | null): Palette | null; // null if missing, malformed, out of range or wrong v
export function contrast(a: string, b: string): number; // WCAG ratio of two hex colours
export function wheelRgb(hue: number, chroma: number): [number, number, number]; // wheel pixel as 0–255 sRGB (added in step 1: the controller paints the wheel with it)
```

Internal helpers are not exported: OKLCH→linear sRGB, gamut mapping by binary search on chroma, sRGB encode, hex.

**Recipe.** Port it exactly from the mockup's `paletteTokens`. Each token is an OKLCH `[L, C, h]` per Mode, where `ha` is the hue, `hs = ha + 120`, `hg = ha + 240` and `g = tint/100 × 0.05`:

- `bg`: dark `[0.18, g, hg]`, light `[0.985, 0.35g, hg]`
- `surface`: dark `[0.215, 1.1g, hg]`, light `[0.955, 0.6g, hg]`
- `line`: dark `[0.30, 1.2g, hg]`, light `[0.90, 0.8g, hg]`
- `muted`: dark `[0.68, 1.2g, hg]`, light `[0.50, g, hg]`
- `fg`: dark `[0.92, 0.5g, hg]`, light `[0.22, 0.8g, hg]`
- `accent`: dark `[0.80, C, ha]`, light `[0.55, C, ha]`
- `accent-2`: dark `[0.76, 0.85C, hs]`, light `[0.50, 0.85C, hs]`
- `accent-fg` = `bg`

Any colour outside sRGB has its chroma reduced until it fits. **Contrast guard:** for `muted`, `fg`, `accent` and `accent-2`, step L by 0.01 (up in dark Mode, down in light) until contrast against `bg` is ≥ 4.5:1, at most 40 steps. **Measure contrast on the hex-rounded colours**, not the unrounded floats. Measuring before rounding lets values like 4.4999 through; a sweep caught this at hue 120, chroma 0.25, tint 0, light Mode.

**Wheel geometry.** Hue runs counter-clockwise from the right (3 o'clock = 0°). The radius is proportional to chroma (rim = `CHROMA_MAX`). The wheel image is drawn at L = 0.75.

### Default Palette is generated, not hand-copied

- `BaseHead` emits the colour tokens as an inline `<style>` built at build time from `paletteCss(DEFAULT_PALETTE)`: dark on bare `:root`, light under `@media (prefers-color-scheme: light) :root:not([data-theme="dark"])` and under `:root[data-theme="light"]`.
- Remove the colour hex values that spec 0001 put in the global stylesheet. Non-colour tokens (fonts, steps, measure) stay there.
- The global stylesheet gains the three `:root[data-palette="custom"]` blocks from the mockup, mapping `--x` to `var(--d-x)` / `var(--l-x)`.

### Before-first-paint script (inline in `<head>`, extends spec 0001's Mode script)

1. Add class `js` to `<html>`.
2. Apply `localStorage.mode`, as in 0001.
3. Read `localStorage.palette`. If it parses and `v === RECIPE_VERSION`, write each `tokens.dark[t]` to `--d-t` and `tokens.light[t]` to `--l-t` on `<html>`, and set `data-palette="custom"`. Otherwise remove the key.

Everything is wrapped in try/catch. `RECIPE_VERSION` is injected at build time (`define:vars` or string interpolation); the script has no imports. Storing the computed tokens is what keeps this script tiny: it never runs the colour maths.

### `PalettePicker` component

- **Markup:** the header button (`aria-expanded`, `aria-controls`, label "Change colours", triad-dots icon coloured by `--accent`, `--accent-2` and `--muted`) and the popover container (`role="dialog"`, `aria-label="Colours"`, `hidden`).
- **No JS:** CSS hides the button unless `html.js` is set.
- **Loading:** on first click, the component's `<script>` runs `import('./palette-picker-controller')`. Vite splits that into its own chunk, which then renders the wheel, handles, slider and reset into the popover. No picker logic is in the initial bundle.
- **Controller behaviour** (match the mockup):
  - **Dragging:** pointer capture on the wheel; `touch-action: none`. A pointerdown on empty wheel space grabs the nearest handle.
  - **Keyboard on a focused handle:** ←/→ rotate the triad 2° (10° with Shift), ↑/↓ change strength by 0.005.
  - **Applying a change:** every change calls `paletteTokens` and writes `--d-*` / `--l-*`.
  - **Storage:** a Custom Palette is saved with `serialize`. When the Palette equals the default, remove `data-palette` and the storage key instead.
  - **Wheel image:** drawn once on first open into a canvas sized to its box × `min(devicePixelRatio, 2)`, and redrawn only if the box size changes.
  - **Open:** focus the accent handle.
  - **Close:** Escape closes and returns focus to the button. Clicking outside, or the button again, closes it.
  - **Reset:** "Reset to default" is disabled while the Palette is the default.
  - **Readout:** a small `hue° · chroma · tint%` line, which is handy for the author when tuning.
- **Placement:** the popover is absolutely positioned under the header's right edge (`.site-header { position: relative }`), with `width: min(19rem, 100%)`, so it fits at 390px.
- **Header order:** colours · Mode toggle.

### Not affected

Shiki code-block colours stay on their fixed GitHub light/dark themes; only `--surface` behind them follows the Palette.

## Testing decisions

- **One seam: `src/lib/palette.ts`**, built test-first (the `tdd` skill) in `src/lib/palette.test.ts`. Test only through the exports above.
- Required cases:
  - `paletteTokens(DEFAULT_PALETTE)` equals the exact hex table in spec 0001's "Design tokens" section. This guards against accidental recipe drift; if the recipe changes on purpose, update the table and bump `RECIPE_VERSION` together.
  - **Contrast sweep:** for hue 0–345 in steps of 15, chroma ∈ {0, 0.1, 0.25} and tint ∈ {0, 50, 100}, in both Modes, `muted`, `fg`, `accent` and `accent-2` are each ≥ 4.5:1 against `bg`.
  - Every token is a valid `#rrggbb`, including at chroma 0.25 for all hues.
  - `rotateTo` puts handle k on the pointer's hue, keeps the 120° offsets, and clamps chroma to [0, `CHROMA_MAX`]. Hue wraps correctly across 0°/360°.
  - `nudge` steps and clamps as specified.
  - `pointerToPolar` gives: right = 0°, up = 90°, centre = chroma 0, beyond the rim = `CHROMA_MAX`. It round-trips with `handlePositions`.
  - `nearestHandle` picks the geometrically closest handle.
  - `parseStored`:
    - accepts `serialize(p)`;
    - returns null for a different `v`, malformed JSON, missing fields and out-of-range values.
  - `paletteCss` contains the three blocks with the right selectors and the default values.
- The controller (DOM, canvas, pointer events) is not unit-tested. It is verified by the step checks below.

## Out of scope

Sharing a Palette by link, presets or named palettes, syncing across devices, changing fonts or Shiki code themes, a separate picker per Mode.

---

## Step-by-step plan

One commit per step. Every step ends with `bun run check && bun run test && bun run build` green.

### Step 1: `palette.ts` (TDD)

Depends on: spec 0001 complete

- Implement `src/lib/palette.ts` and `src/lib/palette.test.ts` covering every Testing case.

Done when: all tests pass, and `paletteTokens(DEFAULT_PALETTE)` matches spec 0001's table exactly.

### Step 2: Generate the Default Palette CSS

Depends on: 1

- `BaseHead` emits `paletteCss(DEFAULT_PALETTE)` inline.
- Remove the hand-written colour hex values from the global stylesheet.
- Add the `data-palette="custom"` mapping blocks.

Done when: the site looks pixel-identical to before in both Modes (compare `/` and `/posts/hello-world/` screenshots), and `grep -E '#[0-9a-f]{6}' src/styles` finds no colour-token definitions.

### Step 3: Before-first-paint script

Depends on: 2

- Extend the head script as specified, with `RECIPE_VERSION` injected.

Done when, testing by hand in the browser console:

- After `localStorage.setItem('palette', <serialize({hue:200,chroma:0.15,tint:40})>)`, a hard reload shows the custom colours with no flash of the default.
- After changing `v` to 999, a reload shows the default and the key is gone.
- With JS disabled, the site shows the Default Palette and no colours button.

### Step 4: `PalettePicker` component and controller

Depends on: 3

- The header button, popover and lazily imported controller, with behaviour as specified and visuals as in the mockup.

Done when:

- Dragging any handle rotates all three, keeping 120°, and recolours the page live in both Modes.
- The choice survives navigation and reload.
- Reset restores the default and clears storage.
- A keyboard-only run works: Tab to the button, Enter, arrows, Escape, and focus is back on the button.
- On a touch device (or emulation), dragging doesn't scroll the page.
- At 390px wide, the popover fits with no horizontal scroll.
- The network panel shows the controller chunk is fetched only on first open.

### Step 5: Budget, accessibility and docs

Depends on: 4

Checks:

- Initial JS per page (inline scripts + component stub) is ≤ 2 KB gzipped more than at the end of spec 0001.
- Lighthouse accessibility ≥ 95 with the popover closed.
- Changing `DEFAULT_PALETTE` to `{ hue: 200, chroma: 0.15, tint: 40 }` in a scratch run makes step 1's table test fail. That's the expected guard. Revert the change.

Docs: add a README section "Colours" covering how readers use the picker, how to change the Default Palette (edit three numbers, update the token table in spec 0001's test, bump `RECIPE_VERSION`), and why tokens are stored computed.

Done when: all three checks pass and the README section is written.

## Further notes

- Use the glossary words in code and UI copy: `Palette`, `Mode`, `DEFAULT_PALETTE`. The button says "colours", never "theme".
- The mockup's controller is plain ES5-style JS for portability. Port it to typed TS modules: no `var`, no globals.
