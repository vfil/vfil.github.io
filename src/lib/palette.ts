/**
 * The Palette recipe: three numbers (hue, chroma, tint) → every colour token, in both Modes.
 * Pure, no DOM. Ported from the reference implementation in specs/mockups/home.html.
 */

export type Palette = { hue: number; chroma: number; tint: number };
export type TokenName =
  'bg' | 'surface' | 'line' | 'muted' | 'fg' | 'accent' | 'accent-2' | 'accent-fg';
export type Tokens = Record<TokenName, string>;

export const DEFAULT_PALETTE: Palette = { hue: 359, chroma: 0.211, tint: 10 };

/**
 * Version of the recipe in paletteTokens. Bump it whenever its output can change: readers'
 * stored Custom Palettes (which hold computed tokens) are then discarded instead of misapplied.
 */
export const RECIPE_VERSION = 1;
/** localStorage key holding the reader's Custom Palette (written by serialize). */
export const PALETTE_STORAGE_KEY = 'palette';
export const CHROMA_MAX = 0.25;
/** Hue offsets of the three handles: accent, secondary, ground. */
export const HANDLE_OFFSETS = [0, 120, 240] as const;
export type Handle = 0 | 1 | 2;

const MIN_CONTRAST = 4.5;
/** Lightness the wheel image and handle colours are drawn at. */
const WHEEL_L = 0.75;

type Rgb = [number, number, number]; // linear sRGB, 0–1
type Lch = [number, number, number]; // OKLCH

function norm(h: number): number {
  return ((h % 360) + 360) % 360;
}

function oklchToLinear(L: number, C: number, h: number): Rgb {
  const r = (h * Math.PI) / 180;
  const a = C * Math.cos(r);
  const b = C * Math.sin(r);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function inGamut(c: Rgb): boolean {
  return c.every((v) => v >= -1e-4 && v <= 1.0001);
}

/** OKLCH → linear sRGB, reducing chroma by binary search until the colour fits sRGB. */
function mapped(L: number, C: number, h: number): Rgb {
  const c = oklchToLinear(L, C, h);
  if (inGamut(c)) return c;
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear(L, mid, h))) lo = mid;
    else hi = mid;
  }
  return oklchToLinear(L, lo, h).map((v) => Math.min(1, Math.max(0, v))) as Rgb;
}

function encode(v: number): number {
  const x = Math.min(1, Math.max(0, v));
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

function decode(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function hex(c: Rgb): string {
  return (
    '#' +
    bytes(c)
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

function bytes(c: Rgb): [number, number, number] {
  return c.map((v) => Math.round(encode(v) * 255)) as [number, number, number];
}

function hexToLinear(x: string): Rgb {
  return [1, 3, 5].map((i) => decode(parseInt(x.slice(i, i + 2), 16) / 255)) as Rgb;
}

function luminance(c: Rgb): number {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function ratio(a: Rgb, b: Rgb): number {
  const A = luminance(a) + 0.05;
  const B = luminance(b) + 0.05;
  return A > B ? A / B : B / A;
}

/** WCAG contrast ratio of two `#rrggbb` colours. */
export function contrast(a: string, b: string): number {
  return ratio(hexToLinear(a), hexToLinear(b));
}

type Recipe = Record<Exclude<TokenName, 'accent-fg'>, { dark: Lch; light: Lch }>;

const TEXT_TOKENS: ReadonlySet<TokenName> = new Set(['muted', 'fg', 'accent', 'accent-2']);

function recipe(p: Palette): Recipe {
  const ha = norm(p.hue);
  const hs = norm(p.hue + 120);
  const hg = norm(p.hue + 240);
  const C = p.chroma;
  const g = (p.tint / 100) * 0.05;
  return {
    bg: { dark: [0.18, g, hg], light: [0.985, g * 0.35, hg] },
    surface: { dark: [0.215, g * 1.1, hg], light: [0.955, g * 0.6, hg] },
    line: { dark: [0.3, g * 1.2, hg], light: [0.9, g * 0.8, hg] },
    muted: { dark: [0.68, g * 1.2, hg], light: [0.5, g, hg] },
    fg: { dark: [0.92, g * 0.5, hg], light: [0.22, g * 0.8, hg] },
    accent: { dark: [0.8, C, ha], light: [0.55, C, ha] },
    'accent-2': { dark: [0.76, C * 0.85, hs], light: [0.5, C * 0.85, hs] },
  };
}

/**
 * Every colour token for both Modes. Text tokens are stepped in lightness (up in dark Mode, down
 * in light) until they reach 4.5:1 against bg, measured on the hex-rounded colours that ship.
 */
export function paletteTokens(p: Palette): { dark: Tokens; light: Tokens } {
  const r = recipe(p);
  const build = (mode: 'dark' | 'light'): Tokens => {
    const dir = mode === 'dark' ? 1 : -1;
    const bg = hex(mapped(...r.bg[mode]));
    const bgRgb = hexToLinear(bg);
    const out = {} as Tokens;
    for (const [name, spec] of Object.entries(r) as Array<[TokenName, Recipe['bg']]>) {
      let [L] = spec[mode];
      const [, c, h] = spec[mode];
      let value = hex(mapped(L, c, h));
      if (TEXT_TOKENS.has(name)) {
        for (let n = 0; n < 40 && ratio(hexToLinear(value), bgRgb) < MIN_CONTRAST; n++) {
          L += dir * 0.01;
          value = hex(mapped(L, c, h));
        }
      }
      out[name] = value;
    }
    out['accent-fg'] = bg;
    return out;
  };
  return { dark: build('dark'), light: build('light') };
}

function wholeHue(h: number): number {
  return norm(Math.round(h));
}

function clampChroma(c: number): number {
  return Math.round(Math.max(0, Math.min(CHROMA_MAX, c)) * 1000) / 1000;
}

/** Drag `handle` to the pointer: the whole triad turns with it, and the pointer's distance sets chroma. */
export function rotateTo(
  p: Palette,
  handle: Handle,
  pointer: { hue: number; chroma: number },
): Palette {
  return {
    ...p,
    hue: wholeHue(pointer.hue - HANDLE_OFFSETS[handle]),
    chroma: clampChroma(pointer.chroma),
  };
}

const HUE_STEP = 2;
const HUE_STEP_BIG = 10;
const CHROMA_STEP = 0.005;

/** Keyboard on a focused handle: ←/→ turn the triad, ↑/↓ change strength. */
export function nudge(p: Palette, key: 'left' | 'right' | 'up' | 'down', big: boolean): Palette {
  const step = big ? HUE_STEP_BIG : HUE_STEP;
  switch (key) {
    case 'left':
      return { ...p, hue: wholeHue(p.hue + step) };
    case 'right':
      return { ...p, hue: wholeHue(p.hue - step) };
    case 'up':
      return { ...p, chroma: clampChroma(p.chroma + CHROMA_STEP) };
    case 'down':
      return { ...p, chroma: clampChroma(p.chroma - CHROMA_STEP) };
  }
}

/**
 * Pointer offset from the wheel centre (dx right, dy up, in px) → hue and chroma.
 * Hue runs counter-clockwise from 3 o'clock; the rim is CHROMA_MAX.
 */
export function pointerToPolar(
  dx: number,
  dy: number,
  radiusPx: number,
): { hue: number; chroma: number } {
  return {
    hue: norm((Math.atan2(dy, dx) * 180) / Math.PI),
    chroma: Math.min(1, Math.hypot(dx, dy) / radiusPx) * CHROMA_MAX,
  };
}

/** Where each handle sits on the wheel (x/y in % of its box) and its fill colour. */
export function handlePositions(p: Palette): Array<{ x: number; y: number; color: string }> {
  const r = (p.chroma / CHROMA_MAX) * 50;
  return HANDLE_OFFSETS.map((offset) => {
    const h = norm(p.hue + offset);
    const a = (h * Math.PI) / 180;
    return {
      x: 50 + r * Math.cos(a),
      y: 50 - r * Math.sin(a),
      color: hex(mapped(WHEEL_L, p.chroma, h)),
    };
  });
}

/** The handle closest to a pointer offset from the wheel centre (dx right, dy up, in px). */
export function nearestHandle(p: Palette, dx: number, dy: number, radiusPx: number): Handle {
  let best: Handle = 0;
  let bestDist = Infinity;
  handlePositions(p).forEach((pos, k) => {
    const hx = (pos.x / 100 - 0.5) * 2 * radiusPx;
    const hy = (0.5 - pos.y / 100) * 2 * radiusPx;
    const d = (hx - dx) ** 2 + (hy - dy) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = k as Handle;
    }
  });
  return best;
}

export function isDefault(p: Palette): boolean {
  return (
    p.hue === DEFAULT_PALETTE.hue &&
    p.chroma === DEFAULT_PALETTE.chroma &&
    p.tint === DEFAULT_PALETTE.tint
  );
}

/** What is saved in localStorage: the Palette plus its computed tokens for the head script. */
export function serialize(p: Palette): string {
  return JSON.stringify({ v: RECIPE_VERSION, ...p, tokens: paletteTokens(p) });
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** A stored Custom Palette, or null if it's missing, malformed, out of range or from another recipe. */
export function parseStored(raw: string | null): Palette | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObject(data) || data.v !== RECIPE_VERSION) return null;
  const { hue, chroma, tint, tokens } = data;
  if (!isObject(tokens) || !isObject(tokens.dark) || !isObject(tokens.light)) return null;
  if (!Number.isInteger(hue) || (hue as number) < 0 || (hue as number) > 359) return null;
  if (typeof chroma !== 'number' || !(chroma >= 0 && chroma <= CHROMA_MAX)) return null;
  if (!Number.isInteger(tint) || (tint as number) < 0 || (tint as number) > 100) return null;
  return { hue: hue as number, chroma, tint: tint as number };
}

/**
 * ES5 source, inlined in <head>, that applies the stored Custom Palette before first paint. It
 * accepts exactly what parseStored accepts (the tests hold them together) and removes anything
 * else. It writes the stored tokens as-is, so no colour maths runs before paint.
 */
export const storedPaletteScript = `(function () {
  try {
    var key = ${JSON.stringify(PALETTE_STORAGE_KEY)};
    var raw = localStorage.getItem(key);
    if (raw === null) return;
    var p = null;
    try { p = JSON.parse(raw); } catch (e) {}
    var obj = function (x) { return typeof x === 'object' && x !== null && !Array.isArray(x); };
    var int = function (x, max) { return typeof x === 'number' && x % 1 === 0 && x >= 0 && x <= max; };
    var ok = obj(p) && p.v === ${RECIPE_VERSION} &&
      obj(p.tokens) && obj(p.tokens.dark) && obj(p.tokens.light) &&
      int(p.hue, 359) && typeof p.chroma === 'number' && p.chroma >= 0 && p.chroma <= ${CHROMA_MAX} &&
      int(p.tint, 100);
    if (!ok) { localStorage.removeItem(key); return; }
    var root = document.documentElement;
    for (var t in p.tokens.dark) root.style.setProperty('--d-' + t, p.tokens.dark[t]);
    for (var u in p.tokens.light) root.style.setProperty('--l-' + u, p.tokens.light[u]);
    root.setAttribute('data-palette', 'custom');
  } catch (e) {}
})();`;

function declarations(tokens: Tokens, scheme: 'dark' | 'light'): string {
  const vars = Object.entries(tokens).map(([name, value]) => `--${name}:${value};`);
  return vars.join('') + `color-scheme:${scheme}`;
}

/**
 * The Palette as CSS, dark-first: dark on bare :root; light under the OS light preference (unless
 * the reader chose dark) and under an explicit light choice.
 */
export function paletteCss(p: Palette): string {
  const { dark, light } = paletteTokens(p);
  const l = declarations(light, 'light');
  return [
    `:root{${declarations(dark, 'dark')}}`,
    `@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){${l}}}`,
    `:root[data-theme="light"]{${l}}`,
  ].join('\n');
}

/** The wheel image's colour at a hue and chroma, as 0–255 sRGB bytes (for canvas pixels). */
export function wheelRgb(hue: number, chroma: number): [number, number, number] {
  return bytes(mapped(WHEEL_L, chroma, norm(hue)));
}
