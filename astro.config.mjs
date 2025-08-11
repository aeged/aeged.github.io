import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [mdx(), sitemap()],
  site: 'https://aeged.github.io',
  base: '/<your-repo-name>', // include leading slash
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'snazzy-light',
    },
  },
});
