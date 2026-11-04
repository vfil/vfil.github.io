/**
 * Palette picker controller: renders the popover (wheel, handles, tint slider, reset) and applies
 * the reader's Palette live. Loaded on first click by PalettePicker.astro, so readers who never
 * open the picker never download it. All colour maths is in src/lib/palette.ts.
 */
import {
  DEFAULT_PALETTE,
  handlePositions,
  isDefault,
  nearestHandle,
  nudge,
  paletteTokens,
  parseStored,
  pointerToPolar,
  rotateTo,
  serialize,
  wheelRgb,
  type Handle,
  type Palette,
} from '../lib/palette';

const STORAGE_KEY = 'palette';

const HANDLE_LABELS = ['Accent colour', 'Second colour', 'Background colour'] as const;
const KEY_HINT = 'Left and right arrows turn the colours, up and down change strength.';

const ARROWS: Record<string, 'left' | 'right' | 'up' | 'down'> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

const TEMPLATE = `
  <div class="pop-head"><strong>colours</strong><span>saved in this browser</span></div>
  <p class="pop-hint">Drag a dot to turn all three colours. Closer to the centre is calmer.</p>
  <div class="wheel">
    <canvas aria-hidden="true"></canvas>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,50 50,50 50,50"></polygon>
      <line x1="50" y1="50" x2="50" y2="50"></line>
      <line x1="50" y1="50" x2="50" y2="50"></line>
      <line x1="50" y1="50" x2="50" y2="50"></line>
    </svg>
    ${HANDLE_LABELS.map(
      (label, k) =>
        `<button class="handle${k === 0 ? ' main' : ''}" type="button" data-k="${k}" aria-label="${label}. ${KEY_HINT}"></button>`,
    ).join('')}
  </div>
  <div class="slider">
    <label for="palette-tint"><span>background tint</span><span class="tint-value"></span></label>
    <input id="palette-tint" type="range" min="0" max="100" step="1" />
  </div>
  <div class="pop-foot">
    <output></output>
    <button class="btn reset" type="button">Reset to default</button>
  </div>
`;

function readStored(): Palette | null {
  try {
    return parseStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStored(value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable (private mode): the Palette lasts for this page only.
  }
}

function query<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`palette picker: missing ${selector}`);
  return el;
}

export function mountPalettePicker(button: HTMLElement, pop: HTMLElement): void {
  const html = document.documentElement;
  let palette: Palette = readStored() ?? { ...DEFAULT_PALETTE };

  pop.innerHTML = TEMPLATE;
  const wheel = query<HTMLDivElement>(pop, '.wheel');
  const canvas = query<HTMLCanvasElement>(wheel, 'canvas');
  const triangle = query<SVGPolygonElement>(wheel, 'polygon');
  const spokes = [...wheel.querySelectorAll<SVGLineElement>('line')];
  const handles = [...wheel.querySelectorAll<HTMLButtonElement>('.handle')];
  const tint = query<HTMLInputElement>(pop, 'input');
  const tintValue = query<HTMLSpanElement>(pop, '.tint-value');
  const readout = query<HTMLOutputElement>(pop, 'output');
  const reset = query<HTMLButtonElement>(pop, '.reset');

  function render(): void {
    const positions = handlePositions(palette);
    positions.forEach((pos, k) => {
      const handle = handles[k]!;
      handle.style.left = `${pos.x}%`;
      handle.style.top = `${pos.y}%`;
      handle.style.setProperty('--c', pos.color);
      spokes[k]!.setAttribute('x2', String(pos.x));
      spokes[k]!.setAttribute('y2', String(pos.y));
    });
    triangle.setAttribute(
      'points',
      positions.map((pos) => `${pos.x.toFixed(2)},${pos.y.toFixed(2)}`).join(' '),
    );
    tint.value = String(palette.tint);
    tintValue.textContent = `${palette.tint}%`;
    readout.textContent = `${palette.hue}° · ${palette.chroma.toFixed(3)} · ${palette.tint}%`;
    reset.disabled = isDefault(palette);
  }

  function apply(next: Palette): void {
    palette = next;
    if (isDefault(palette)) {
      html.removeAttribute('data-palette');
      writeStored(null);
    } else {
      const { dark, light } = paletteTokens(palette);
      for (const name of Object.keys(dark) as Array<keyof typeof dark>) {
        html.style.setProperty(`--d-${name}`, dark[name]);
        html.style.setProperty(`--l-${name}`, light[name]);
      }
      html.setAttribute('data-palette', 'custom');
      writeStored(serialize(palette));
    }
    render();
  }

  function drawWheel(): void {
    const box = wheel.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const n = Math.max(1, Math.round(box.width * dpr));
    if (!box.width || canvas.width === n) return;
    canvas.width = canvas.height = n;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(n, n);
    const d = image.data;
    const r = n / 2;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const dx = x + 0.5 - r;
        const dy = r - (y + 0.5);
        const dist = Math.hypot(dx, dy);
        const i = (y * n + x) * 4;
        if (dist > r) continue;
        const { hue, chroma } = pointerToPolar(dx, dy, r);
        const [red, green, blue] = wheelRgb(hue, chroma);
        d[i] = red;
        d[i + 1] = green;
        d[i + 2] = blue;
        d[i + 3] = dist > r - 1 ? Math.round((r - dist) * 255) : 255; // antialiased rim
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  // ---------- open / close ----------

  const isOpen = () => !pop.hidden;

  function open(): void {
    pop.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    drawWheel();
    render();
    handles[0]!.focus();
  }

  function close(returnFocus: boolean): void {
    pop.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) button.focus();
  }

  button.addEventListener('click', () => (isOpen() ? close(false) : open()));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && isOpen()) close(true);
  });
  document.addEventListener('pointerdown', (ev) => {
    const target = ev.target as Node;
    if (isOpen() && !pop.contains(target) && !button.contains(target)) close(false);
  });

  // ---------- dragging ----------

  let dragging: Handle | null = null;

  function pointerOffset(ev: PointerEvent): { dx: number; dy: number; radius: number } {
    const box = wheel.getBoundingClientRect();
    return {
      dx: ev.clientX - (box.left + box.width / 2),
      dy: box.top + box.height / 2 - ev.clientY,
      radius: box.width / 2,
    };
  }

  function dragTo(ev: PointerEvent): void {
    if (dragging === null) return;
    const { dx, dy, radius } = pointerOffset(ev);
    apply(rotateTo(palette, dragging, pointerToPolar(dx, dy, radius)));
  }

  wheel.addEventListener('pointerdown', (ev) => {
    const { dx, dy, radius } = pointerOffset(ev);
    const k = (ev.target as HTMLElement).dataset?.k;
    dragging = k !== undefined ? (Number(k) as Handle) : nearestHandle(palette, dx, dy, radius);
    wheel.setPointerCapture(ev.pointerId);
    wheel.classList.add('dragging');
    dragTo(ev);
    ev.preventDefault();
  });
  wheel.addEventListener('pointermove', dragTo);
  const endDrag = () => {
    dragging = null;
    wheel.classList.remove('dragging');
  };
  wheel.addEventListener('pointerup', endDrag);
  wheel.addEventListener('pointercancel', endDrag);

  // ---------- keyboard, slider, reset ----------

  for (const handle of handles) {
    handle.addEventListener('keydown', (ev) => {
      const key = ARROWS[ev.key];
      if (!key) return;
      ev.preventDefault();
      apply(nudge(palette, key, ev.shiftKey));
    });
  }
  tint.addEventListener('input', () => apply({ ...palette, tint: Number(tint.value) }));
  reset.addEventListener('click', () => {
    apply({ ...DEFAULT_PALETTE });
    handles[0]!.focus(); // the reset button is now disabled, so keep focus inside the popover
  });

  open();
}
