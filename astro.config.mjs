import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwind from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  legacy: {
    collections: true,
  },
  output: "static",
  adapter: vercel(),
  site: "https://www.lucasanna.eu",
  trailingSlash: "always",
  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        // Escludi /playground e /api/*
        if (page.includes('/playground') || page.includes('/api/') || page.includes('/realizzazione-siti-web-sassari')) {
          return false;
        }
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
