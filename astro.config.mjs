// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: 'https://seu-site.firebaseapp.com',
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});