import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      pages: [
        { path: "/" },
        { path: "/contact-me" },
        { path: "/case-study" },
        { path: "/frontend-stack" },
        { path: "/my-background" },
      ],
      prerender: {
        autoSubfolderIndex: true,
        crawlLinks: true,
        enabled: true,
        failOnError: true,
      },
    }),
    mdx({
      remarkPlugins: [remarkFrontmatter],
    }),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
});
