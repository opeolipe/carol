import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://carolineratuolivia.com",
  integrations: [tailwind(), react()],
  output: "static",
});
