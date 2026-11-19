import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai-studio44.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [tailwind(), sitemap()],
  // Oude pagina's van voor de Website Roast
  redirects: {
    '/diensten': '/',
    '/nieuws': '/',
    '/vibe-coding': '/',
    '/ai-voor-bedrijven': '/',
    '/contact': '/#aanvraag',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['astro:assets'],
    },
    server: {
      hmr: {
        port: 4322,
      },
    },
  },
});
