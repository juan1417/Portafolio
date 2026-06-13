// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://portafolio-codingspace.vercel.app',
  adapter: vercel(),
  output: 'server',
  vite: { plugins: [tailwindcss()] },
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
