import { defineConfig } from "vite";
import { resolve } from "path";
import { imagetools } from "vite-imagetools";
import svgo from "vite-plugin-svgo";
import handlebars from "vite-plugin-handlebars";

const base = process.env.BASE_URL || "/";

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "policies/code-of-conduct": resolve(
          __dirname,
          "policies/code-of-conduct.html",
        ),
        "policies/disease-mitigation": resolve(
          __dirname,
          "policies/disease-mitigation.html",
        ),
        "policies/privacy-policy": resolve(
          __dirname,
          "policies/privacy-policy.html",
        ),
      },
    },
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
      partialDirectory: resolve(process.cwd(), "partials"),
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
