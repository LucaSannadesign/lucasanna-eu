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
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/?$/, '/');
        // Non inserire in sitemap pagine di servizio interno, 404 o redirect 301.
        return !['/404/', '/playground/', '/realizzazione-siti-web-sassari/'].includes(pathname)
          && !pathname.startsWith('/api/');
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
