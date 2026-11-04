import { describe, expect, it } from 'vitest';
import {
  CHROMA_MAX,
  contrast,
  DEFAULT_PALETTE,
  handlePositions,
  isDefault,
  nearestHandle,
  nudge,
  paletteCss,
  paletteTokens,
  parseStored,
  PALETTE_STORAGE_KEY,
  pointerToPolar,
  RECIPE_VERSION,
  rotateTo,
  serialize,
  storedPaletteScript,
  wheelRgb,
  type Palette,
  type TokenName,
} from './palette';

const TEXT: TokenName[] = ['muted', 'fg', 'accent', 'accent-2'];
const HUES = Array.from({ length: 24 }, (_, i) => i * 15);

describe('Default Palette', () => {
  it("generates exactly the token table in spec 0001's Design tokens section", () => {
    expect(paletteTokens(DEFAULT_PALETTE)).toEqual({
      dark: {
        bg: '#101214',
        surface: '#171a1c',
        line: '#2b2e31',
        muted: '#95999c',
        fg: '#e3e5e6',
        accent: '#ff9abc',
        'accent-2': '#a6c000',
        'accent-fg': '#101214',
      },
      light: {
        bg: '#f9fafb',
        surface: '#eef0f2',
        line: '#dcdee0',
        muted: '#616466',
        fg: '#191b1c',
        accent: '#c91a6f',
        'accent-2': '#5c6c00',
        'accent-fg': '#f9fafb',
      },
    });
  });
});

describe('contrast', () => {
  it('gives the WCAG ratio of two hex colours, in either order', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#777777')).toBe(1);
    // WebAIM checker: #767676 on white is 4.54:1
    expect(contrast('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });
});

describe('contrast guard', () => {
  const palettes: Palette[] = HUES.flatMap((hue) =>
    [0, 0.1, 0.25].flatMap((chroma) => [0, 50, 100].map((tint) => ({ hue, chroma, tint }))),
  );

  it.each(palettes)('keeps text tokens at 4.5:1 on bg for %o', (p) => {
    const tokens = paletteTokens(p);
    for (const mode of ['dark', 'light'] as const) {
      for (const t of TEXT) {
        expect(contrast(tokens[mode][t], tokens[mode].bg), `${mode} ${t}`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    }
  });

  it('emits only #rrggbb values, even at full chroma for every hue', () => {
    for (const hue of Array.from({ length: 360 }, (_, i) => i)) {
      const tokens = paletteTokens({ hue, chroma: 0.25, tint: 100 });
      for (const value of [...Object.values(tokens.dark), ...Object.values(tokens.light)]) {
        expect(value).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });
});

describe('rotateTo', () => {
  const p: Palette = { hue: 359, chroma: 0.211, tint: 10 };

  it('puts the dragged handle on the pointer hue and the triad follows', () => {
    expect(rotateTo(p, 0, { hue: 200, chroma: 0.1 })).toEqual({ hue: 200, chroma: 0.1, tint: 10 });
    // handle 1 sits at accent + 120°, so accent = 30 - 120 = 270
    expect(rotateTo(p, 1, { hue: 30, chroma: 0.1 }).hue).toBe(270);
    // handle 2 sits at accent + 240°, so accent = 10 - 240 = 130 after wrapping
    expect(rotateTo(p, 2, { hue: 10, chroma: 0.1 }).hue).toBe(130);
  });

  it('rounds hue to a whole degree in 0–359', () => {
    expect(rotateTo(p, 0, { hue: 359.6, chroma: 0.1 }).hue).toBe(0);
    expect(rotateTo(p, 0, { hue: 42.4, chroma: 0.1 }).hue).toBe(42);
  });

  it('clamps chroma to [0, CHROMA_MAX] at 3 decimals and keeps tint', () => {
    expect(rotateTo(p, 0, { hue: 0, chroma: 0.4 }).chroma).toBe(CHROMA_MAX);
    expect(rotateTo(p, 0, { hue: 0, chroma: -0.1 }).chroma).toBe(0);
    expect(rotateTo(p, 0, { hue: 0, chroma: 0.12345 }).chroma).toBe(0.123);
    expect(rotateTo(p, 0, { hue: 0, chroma: 0.1 }).tint).toBe(10);
  });
});

describe('nudge', () => {
  const p: Palette = { hue: 359, chroma: 0.211, tint: 10 };

  it('turns the triad 2° per arrow (10° with Shift); left is counter-clockwise', () => {
    expect(nudge(p, 'left', false).hue).toBe(1);
    expect(nudge(p, 'right', false).hue).toBe(357);
    expect(nudge(p, 'left', true).hue).toBe(9);
    expect(nudge({ ...p, hue: 5 }, 'right', true).hue).toBe(355);
  });

  it('changes strength by 0.005 per up/down, clamped to [0, CHROMA_MAX]', () => {
    expect(nudge(p, 'up', false).chroma).toBe(0.216);
    expect(nudge(p, 'down', true).chroma).toBe(0.206);
    expect(nudge({ ...p, chroma: 0.248 }, 'up', false).chroma).toBe(CHROMA_MAX);
    expect(nudge({ ...p, chroma: 0.003 }, 'down', false).chroma).toBe(0);
  });

  it('leaves the other numbers alone', () => {
    expect(nudge(p, 'up', false)).toMatchObject({ hue: 359, tint: 10 });
    expect(nudge(p, 'left', false)).toMatchObject({ chroma: 0.211, tint: 10 });
  });
});

describe('pointerToPolar', () => {
  // dx to the right, dy upwards, from the wheel centre; radius 100px
  it('reads hue counter-clockwise from 3 o’clock', () => {
    expect(pointerToPolar(10, 0, 100).hue).toBeCloseTo(0, 6);
    expect(pointerToPolar(0, 10, 100).hue).toBeCloseTo(90, 6);
    expect(pointerToPolar(-10, 0, 100).hue).toBeCloseTo(180, 6);
    expect(pointerToPolar(0, -10, 100).hue).toBeCloseTo(270, 6);
  });

  it('maps distance to chroma: centre is 0, the rim and beyond is CHROMA_MAX', () => {
    expect(pointerToPolar(0, 0, 100).chroma).toBe(0);
    expect(pointerToPolar(0, 50, 100).chroma).toBeCloseTo(0.125, 6);
    expect(pointerToPolar(60, 80, 100).chroma).toBeCloseTo(CHROMA_MAX, 6);
    expect(pointerToPolar(0, -300, 100).chroma).toBe(CHROMA_MAX);
  });
});

describe('handlePositions', () => {
  it('places the three handles 120° apart, radius proportional to chroma (x/y in % of the box)', () => {
    const [a, b, c] = handlePositions({ hue: 0, chroma: CHROMA_MAX, tint: 10 });
    expect(a!.x).toBeCloseTo(100, 6);
    expect(a!.y).toBeCloseTo(50, 6);
    // 120° is up-left: 50 + 50·cos120°, 50 − 50·sin120°
    expect(b!.x).toBeCloseTo(25, 6);
    expect(b!.y).toBeCloseTo(6.699, 3);
    expect(c!.x).toBeCloseTo(25, 6);
    expect(c!.y).toBeCloseTo(93.301, 3);
  });

  it('collapses to the centre at chroma 0, coloured mid grey (the wheel is drawn at L 0.75)', () => {
    for (const h of handlePositions({ hue: 123, chroma: 0, tint: 10 })) {
      expect(h).toEqual({ x: 50, y: 50, color: '#aeaeae' });
    }
  });

  it('round-trips with pointerToPolar', () => {
    const radius = 112;
    for (const p of [
      { hue: 359, chroma: 0.211, tint: 10 },
      { hue: 47, chroma: 0.08, tint: 0 },
      { hue: 200, chroma: 0.25, tint: 100 },
    ]) {
      handlePositions(p).forEach((pos, k) => {
        const dx = (pos.x / 100 - 0.5) * 2 * radius;
        const dy = (0.5 - pos.y / 100) * 2 * radius;
        const polar = pointerToPolar(dx, dy, radius);
        expect(polar.chroma).toBeCloseTo(p.chroma, 6);
        expect(rotateTo(p, k as 0 | 1 | 2, polar)).toEqual(p);
      });
    }
  });
});

describe('nearestHandle', () => {
  // hue 90, half strength on a 100px wheel: handles at (0, 50), (−43.3, −25), (43.3, −25)
  const p: Palette = { hue: 90, chroma: 0.125, tint: 10 };

  it('picks the geometrically closest handle', () => {
    expect(nearestHandle(p, 0, 100, 100)).toBe(0);
    expect(nearestHandle(p, -90, 0, 100)).toBe(1);
    expect(nearestHandle(p, 40, -40, 100)).toBe(2);
    expect(nearestHandle(p, 5, 30, 100)).toBe(0);
  });
});

describe('isDefault', () => {
  it('is true only for the Default Palette', () => {
    expect(isDefault({ hue: 359, chroma: 0.211, tint: 10 })).toBe(true);
    expect(isDefault({ hue: 0, chroma: 0.211, tint: 10 })).toBe(false);
    expect(isDefault({ hue: 359, chroma: 0.21, tint: 10 })).toBe(false);
    expect(isDefault({ hue: 359, chroma: 0.211, tint: 11 })).toBe(false);
  });
});

const custom: Palette = { hue: 200, chroma: 0.15, tint: 40 };
const stored = (fields: Record<string, unknown>) =>
  JSON.stringify({ ...JSON.parse(serialize(custom)), ...fields });
const INVALID: Array<[string, string | null]> = [
  ['nothing stored', null],
  ['empty string', ''],
  ['malformed JSON', '{"v":1,'],
  ['not an object', '[1,2,3]'],
  ['JSON null', 'null'],
  ['another recipe version', stored({ v: RECIPE_VERSION + 1 })],
  ['missing hue', stored({ hue: undefined })],
  ['missing tokens', stored({ tokens: undefined })],
  ['hue 360', stored({ hue: 360 })],
  ['fractional hue', stored({ hue: 12.5 })],
  ['negative chroma', stored({ chroma: -0.01 })],
  ['chroma above CHROMA_MAX', stored({ chroma: 0.3 })],
  ['tint above 100', stored({ tint: 101 })],
  ['tint as a string', stored({ tint: '40' })],
];

describe('stored Custom Palette', () => {
  it('round-trips through serialize and parseStored', () => {
    expect(parseStored(serialize(custom))).toEqual(custom);
    expect(parseStored(serialize({ hue: 0, chroma: 0, tint: 0 }))).toEqual({
      hue: 0,
      chroma: 0,
      tint: 0,
    });
  });

  it('stores the recipe version and the computed tokens, so the head script needs no colour maths', () => {
    const data = JSON.parse(serialize(custom));
    expect(data.v).toBe(RECIPE_VERSION);
    expect(data.tokens).toEqual(paletteTokens(custom));
  });

  it.each(INVALID)('rejects %s', (_, raw) => {
    expect(parseStored(raw)).toBeNull();
  });
});

describe('storedPaletteScript (inlined in <head>, runs before first paint)', () => {
  /** Runs the script against a fake <html> and localStorage holding `raw`. */
  function run(raw: string | null) {
    const storage = new Map<string, string>();
    if (raw !== null) storage.set(PALETTE_STORAGE_KEY, raw);
    const vars: Record<string, string> = {};
    const attrs: Record<string, string> = {};
    const document = {
      documentElement: {
        style: { setProperty: (name: string, value: string) => (vars[name] = value) },
        setAttribute: (name: string, value: string) => (attrs[name] = value),
      },
    };
    const localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
    };
    new Function('document', 'localStorage', storedPaletteScript)(document, localStorage);
    return {
      custom: attrs['data-palette'] === 'custom',
      vars,
      kept: storage.has(PALETTE_STORAGE_KEY),
    };
  }

  it('applies a stored Custom Palette: its tokens as --d-*/--l-*, and data-palette="custom"', () => {
    const result = run(serialize(custom));
    const tokens = paletteTokens(custom);
    expect(result.custom).toBe(true);
    expect(result.kept).toBe(true);
    expect(result.vars['--d-bg']).toBe(tokens.dark.bg);
    expect(result.vars['--d-accent-2']).toBe(tokens.dark['accent-2']);
    expect(result.vars['--l-fg']).toBe(tokens.light.fg);
    expect(Object.keys(result.vars)).toHaveLength(16);
  });

  it.each(INVALID)('ignores and removes what parseStored rejects: %s', (_, raw) => {
    const result = run(raw);
    expect(result.custom).toBe(false);
    expect(result.vars).toEqual({});
    expect(result.kept).toBe(false);
  });

  it('survives storage that throws (e.g. blocked cookies)', () => {
    const document = { documentElement: { style: { setProperty() {} }, setAttribute() {} } };
    const localStorage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(() =>
      new Function('document', 'localStorage', storedPaletteScript)(document, localStorage),
    ).not.toThrow();
  });
});

describe('paletteCss', () => {
  const css = paletteCss(DEFAULT_PALETTE);
  const block = (selector: RegExp) => {
    const match = css.match(new RegExp(selector.source + String.raw`\s*\{([^{}]*)\}`));
    expect(match, `block ${selector}`).not.toBeNull();
    return match![1]!;
  };
  const decls = (body: string) =>
    Object.fromEntries(
      body
        .split(';')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => d.split(':').map((x) => x.trim()) as [string, string]),
    );

  it('puts dark Mode on bare :root', () => {
    expect(decls(block(/(?:^|\})\s*:root/))).toEqual({
      '--bg': '#101214',
      '--surface': '#171a1c',
      '--line': '#2b2e31',
      '--muted': '#95999c',
      '--fg': '#e3e5e6',
      '--accent': '#ff9abc',
      '--accent-2': '#a6c000',
      '--accent-fg': '#101214',
      'color-scheme': 'dark',
    });
  });

  it('puts light Mode under the OS preference (unless dark is chosen) and under an explicit light choice', () => {
    const light = {
      '--bg': '#f9fafb',
      '--surface': '#eef0f2',
      '--line': '#dcdee0',
      '--muted': '#616466',
      '--fg': '#191b1c',
      '--accent': '#c91a6f',
      '--accent-2': '#5c6c00',
      '--accent-fg': '#f9fafb',
      'color-scheme': 'light',
    };
    expect(css).toMatch(
      /@media \(prefers-color-scheme: light\)\s*\{\s*:root:not\(\[data-theme="dark"\]\)/,
    );
    expect(decls(block(/:root:not\(\[data-theme="dark"\]\)/))).toEqual(light);
    expect(decls(block(/:root\[data-theme="light"\]/))).toEqual(light);
  });
});

describe('wheelRgb', () => {
  it('is mid grey at the centre and matches the handle colour wherever a handle sits', () => {
    expect(wheelRgb(77, 0)).toEqual([174, 174, 174]);
    const p: Palette = { hue: 359, chroma: 0.211, tint: 10 };
    handlePositions(p).forEach((pos, k) => {
      const hex =
        '#' +
        wheelRgb((p.hue + [0, 120, 240][k]!) % 360, p.chroma)
          .map((v) => v.toString(16).padStart(2, '0'))
          .join('');
      expect(hex).toBe(pos.color);
    });
  });
});
