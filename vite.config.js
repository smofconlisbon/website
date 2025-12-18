import { defineConfig } from 'vite'
import { resolve } from 'path'
import { imagetools } from 'vite-imagetools'
import svgo from 'vite-plugin-svgo'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('optimize')) {
          return new URLSearchParams({
            format: 'webp;avif;jpg',
            quality: '80',
          })
        }
        return new URLSearchParams()
      }
    }),
    svgo({
      multipass: true,
    }),
    handlebars({
      partialDirectory: resolve(process.cwd(), 'partials'),
    })
  ]
})
