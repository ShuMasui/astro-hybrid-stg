// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // デフォルトは静的生成（SSG）、必要なページだけSSRにする設定
  output: 'static',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});