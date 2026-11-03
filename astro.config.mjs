// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vfil.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Both themes are emitted as CSS variables; global.css picks one per Mode.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
  ],
});
