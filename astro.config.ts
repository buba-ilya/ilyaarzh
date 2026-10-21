// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  output: 'static',
  integrations: [sitemap()],
  // ABOUT moved to the home page; keep old links working.
  redirects: { '/about': '/' },
});
