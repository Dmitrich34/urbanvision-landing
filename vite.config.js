import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const isSingle = mode === 'single' // спец. режим «одним файлом»

  return {
    // Для GitHub Pages этого проекта путь всегда фиксированный:
    // https://dmitrich34.github.io/urbanvision-landing/
    // поэтому base должен быть ровно '/urbanvision-landing/'.
    base: isSingle ? './' : '/urbanvision-landing/',

    plugins: [
      react(),
      tailwindcss(),
      ...(isSingle ? [viteSingleFile()] : []),
    ],

    resolve: {
      alias: { '@': resolve(__dirname, './src') },
    },

    build: {
      target: 'es2018',
      cssCodeSplit: isSingle ? false : true,
      assetsInlineLimit: isSingle ? 100_000_000 : 4096,
      rollupOptions: isSingle ? { output: { inlineDynamicImports: true } } : {},
    },
  }
})
