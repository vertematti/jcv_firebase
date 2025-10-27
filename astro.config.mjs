// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    mdx(),
    react(), // ATIVA REACT
  ],
  site: 'https://seu-site.firebaseapp.com',
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
  output: 'static',
});