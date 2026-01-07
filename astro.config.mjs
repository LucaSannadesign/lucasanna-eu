import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/static";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: "https://www.lucasanna.eu",
  vite: {
    plugins: [tailwind()],
  },
});