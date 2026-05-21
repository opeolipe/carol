import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://carolineratuolivia.com",
  base: "/carol",
  integrations: [tailwind(), react(), mdx()],
  output: "static",
});
