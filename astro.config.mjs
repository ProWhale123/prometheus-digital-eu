import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // FONTOS: Add your final production URL here.
  // This is required for SEO and sitemap generation.
  // Cseréld le a végleges domain nevedre, ha más!
  site: 'https://www.prometheusdigital.hu',

  vite: {
    plugins: [tailwindcss()]
  },

    build: {
    // Ez az opció megmondja az Astro-nak, hogy a 15kb-nál kisebb CSS fájlokat
    // ágyazza be közvetlenül a HTML-be, ezzel megszüntetve a render-blocking kérést.
    inlineStylesheets: 'auto'
  },

  integrations: [sitemap(), react()]
});