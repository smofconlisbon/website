import { globSync } from "node:fs";
import { defineConfig } from "vite";
import { resolve } from "path";
import { imagetools } from "vite-imagetools";
import svgo from "vite-plugin-svgo";
import handlebars from "vite-plugin-handlebars";

const base = process.env.BASE_URL || "/";

const htmlFiles = globSync("**/*.html", { cwd: resolve(__dirname, "src") });
const input = Object.fromEntries(
  htmlFiles.map((file) => [
    file.replace(/\.html$/, ""),
    resolve(__dirname, "src", file),
  ]),
);

export default defineConfig({
  root: "src",
  base,
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: { input },
  },
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has("optimize")) {
          return new URLSearchParams({
            format: "webp;avif;jpg",
            quality: "80",
          });
        }
        return new URLSearchParams();
      },
    }),
    svgo({
      multipass: true,
    }),
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
      helpers: {
        url: (path) => {
          if (path.startsWith("/")) {
            return base.replace(/\/$/, "") + path;
          }
          return path;
        },
      },
    }),
  ],
});
